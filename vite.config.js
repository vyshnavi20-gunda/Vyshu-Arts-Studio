
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { Resend } from "resend";

import { requestOpenRouterReply } from "./server/openRouterChat.js";

import {
    saveArtRequest,
    getArtRequests,
    updateArtRequestStatus
} from "./server/database.js";

import {
    createAdminSession,
    verifyAdminPassword,
    verifyAdminSession
} from "./server/adminAuth.js";


function apiPlugin(apiKey, resendApiKey) {
    const attachMiddleware = (server) => {

        // Helper: Read JSON request body
        const readBody = (req) => new Promise((resolve, reject) => {
            let rawBody = "";

            req.on("data", chunk => {
                rawBody += chunk;

                if (rawBody.length > 12000) {
                    reject(new Error("Request body too large."));
                    req.destroy();
                }
            });

            req.on("end", () => {
                try {
                    resolve(JSON.parse(rawBody || "{}"));
                } catch {
                    reject(new Error("Invalid JSON."));
                }
            });

            req.on("error", reject);
        });


        // Helper: Send JSON response
        const sendJson = (res, status, data) => {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
        };


        // Helper: Get admin session
        const getAdminToken = (req) => {
            const cookies = Object.fromEntries(
                (req.headers.cookie || "")
                    .split(";")
                    .filter(Boolean)
                    .map(cookie => {
                        const index = cookie.indexOf("=");

                        return [
                            cookie.slice(0, index).trim(),
                            cookie.slice(index + 1).trim()
                        ];
                    })
            );

            return cookies.vyshu_admin;
        };


        // 1. Chatbot API
        server.middlewares.use("/api/chat", async (req, res) => {
            if (req.method !== "POST") {
                return sendJson(res, 405, {
                    error: "Method not allowed"
                });
            }

            try {
                const body = await readBody(req);

                const result = await requestOpenRouterReply({
                    message: body.message,
                    apiKey,
                    siteUrl: req.headers.origin
                });

                return sendJson(res, result.status, result.body);

            } catch (error) {
                console.error("Chat API error:", error);

                return sendJson(res, 500, {
                    error: "Chatbot is temporarily unavailable."
                });
            }
        });


        // 2. Artwork Request API
        server.middlewares.use("/api/requests", async (req, res) => {
            if (req.method !== "POST") {
                return sendJson(res, 405, {
                    error: "Method not allowed"
                });
            }

            try {
                const body = await readBody(req);

                const data = {
                    name: body.name?.trim(),
                    email: body.email?.trim(),
                    artwork: body.artwork?.trim(),
                    budget: body.budget?.trim(),
                    message: body.message?.trim()
                };

                if (Object.values(data).some(value => !value)) {
                    return sendJson(res, 400, {
                        error: "Please fill in all details."
                    });
                }

                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(data.email)) {
                    return sendJson(res, 400, {
                        error: "Please enter a valid email."
                    });
                }

                // Save request in Neon
                const saved = await saveArtRequest(data);

                // Send email notification
                if (!resendApiKey) {
                    console.error("RESEND_API_KEY is missing.");
                } else {
                    try {
                        const resend = new Resend(resendApiKey);

                        const escapeHtml = value =>
                            String(value).replace(/[&<>"']/g, char => ({
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#39;"
                            })[char]);

                        const { data: emailData, error: emailError } =
                            await resend.emails.send({
                                from: "Vyshu Arts Studio <onboarding@resend.dev>",
                                to: ["vyshnavigupta20@gmail.com"],
                                subject: "New Artwork Request Received!",
                                html: `
                                    <h2>New Artwork Request 🎨</h2>
                                    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
                                    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                                    <p><strong>Artwork:</strong> ${escapeHtml(data.artwork)}</p>
                                    <p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>
                                    <p><strong>Message:</strong> ${escapeHtml(data.message)}</p>
                                `
                            });

                        if (emailError) {
                            console.error("Resend email error:", emailError);
                        } else {
                            console.log(
                                "Resend email accepted:",
                                emailData?.id
                            );
                        }

                    } catch (emailError) {
                        console.error(
                            "Email notification failed:",
                            emailError
                        );
                    }
                }

                return sendJson(res, 201, {
                    success: true,
                    message: "Artwork request saved successfully!",
                    request: saved[0]
                });

            } catch (error) {
                console.error("Request API error:", error);

                return sendJson(res, 500, {
                    error: "Unable to save your request."
                });
            }
        });


        // 3. Admin Login API
        server.middlewares.use("/api/admin-login", async (req, res) => {
            if (req.method !== "POST") {
                return sendJson(res, 405, {
                    error: "Method not allowed"
                });
            }

            try {
                const body = await readBody(req);

                if (!verifyAdminPassword(body.password)) {
                    return sendJson(res, 401, {
                        error: "Invalid admin password."
                    });
                }

                const token = createAdminSession();

                const secureCookie =
                    process.env.NODE_ENV === "production"
                        ? "; Secure"
                        : "";

                res.setHeader(
                    "Set-Cookie",
                    `vyshu_admin=${token}; HttpOnly${secureCookie}; SameSite=Strict; Path=/; Max-Age=28800`
                );

                return sendJson(res, 200, {
                    success: true,
                    message: "Admin login successful."
                });

            } catch (error) {
                console.error("Admin login error:", error);

                return sendJson(res, 500, {
                    error: "Unable to log in."
                });
            }
        });


        // 4. Protected Admin Requests API
        server.middlewares.use("/api/admin-requests", async (req, res) => {
            if (req.method !== "GET") {
                return sendJson(res, 405, {
                    error: "Method not allowed"
                });
            }

            if (!verifyAdminSession(getAdminToken(req))) {
                return sendJson(res, 401, {
                    error: "Unauthorized. Please log in."
                });
            }

            try {
                const requests = await getArtRequests();

                return sendJson(res, 200, {
                    success: true,
                    requests
                });

            } catch (error) {
                console.error("Admin requests error:", error);

                return sendJson(res, 500, {
                    error: "Unable to load artwork requests."
                });
            }
        });


        // 5. Protected Admin Status Update API
        server.middlewares.use(
            "/api/admin-update-request",
            async (req, res) => {

                if (req.method !== "PATCH") {
                    return sendJson(res, 405, {
                        error: "Method not allowed"
                    });
                }

                if (!verifyAdminSession(getAdminToken(req))) {
                    return sendJson(res, 401, {
                        error: "Unauthorized. Please log in."
                    });
                }

                try {
                    const body = await readBody(req);

                    if (
                        !body.id ||
                        !/^\d+$/.test(String(body.id))
                    ) {
                        return sendJson(res, 400, {
                            error: "Invalid request ID."
                        });
                    }

                    const updated = await updateArtRequestStatus(
                        body.id,
                        body.status
                    );

                    if (!updated.length) {
                        return sendJson(res, 404, {
                            error: "Artwork request not found."
                        });
                    }

                    return sendJson(res, 200, {
                        success: true,
                        request: updated[0]
                    });

                } catch (error) {
                    console.error("Admin update error:", error);

                    return sendJson(res, 400, {
                        error: error.message ||
                            "Unable to update request."
                    });
                }
            }
        );


        // 6. Admin Logout API
        server.middlewares.use("/api/admin-logout", (req, res) => {
            if (req.method !== "POST") {
                return sendJson(res, 405, {
                    success: false,
                    message: "Method not allowed"
                });
            }

            const secureCookie =
                process.env.NODE_ENV === "production"
                    ? " Secure;"
                    : "";

            res.setHeader(
                "Set-Cookie",
                `vyshu_admin=; HttpOnly;${secureCookie} SameSite=Strict; Path=/; Max-Age=0`
            );

            return sendJson(res, 200, {
                success: true,
                message: "Logged out successfully."
            });
        });

    };

    return {
        name: "vyshu-api",
        configureServer: attachMiddleware,
        configurePreviewServer: attachMiddleware
    };
}


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    for (const key of [
        "DATABASE_URL",
        "ADMIN_PASSWORD",
        "ADMIN_SESSION_SECRET"
    ]) {
        if (env[key]) {
            process.env[key] = env[key];
        }
    }

    return {
        plugins: [
            react(),
            apiPlugin(
                env.OPENROUTER_API_KEY,
                env.RESEND_API_KEY
            )
        ]
    };
});
