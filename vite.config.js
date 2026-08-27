import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { requestOpenRouterReply } from "./server/openRouterChat.js";

function chatApiPlugin(apiKey) {
    const attachMiddleware = (server) => {
        server.middlewares.use("/api/chat", (request, response, next) => {
            if (request.method !== "POST") {
                response.statusCode = 405;
                response.setHeader("Allow", "POST");
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({ error: "Method not allowed." }));
                return;
            }

            let rawBody = "";

            request.on("data", (chunk) => {
                rawBody += chunk;
                if (rawBody.length > 10_000) request.destroy();
            });

            request.on("end", async () => {
                try {
                    const body = JSON.parse(rawBody || "{}");
                    const result = await requestOpenRouterReply({
                        message: body.message,
                        apiKey,
                        siteUrl: request.headers.origin,
                    });

                    response.statusCode = result.status;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(result.body));
                } catch {
                    response.statusCode = 400;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });

            request.on("error", next);
        });
    };

    return {
        name: "vyshu-chat-api",
        configureServer: attachMiddleware,
        configurePreviewServer: attachMiddleware,
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const apiKey = env.OPENROUTER_API_KEY || env.VITE_GEMINI_API_KEY;

    return {
        plugins: [react(), chatApiPlugin(apiKey)],
    };
});
