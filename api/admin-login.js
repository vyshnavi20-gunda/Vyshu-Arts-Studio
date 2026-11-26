
import {
    createAdminSession,
    verifyAdminPassword
} from "../server/adminAuth.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { password } = req.body || {};

    if (!verifyAdminPassword(password)) {
        return res.status(401).json({
            error: "Invalid admin password."
        });
    }

    const secureCookie =
        process.env.NODE_ENV === "production" ? "; Secure" : "";

    res.setHeader(
        "Set-Cookie",
        `vyshu_admin=${token}; HttpOnly${secureCookie}; SameSite=Strict; Path=/; Max-Age=28800`
    );

    return res.status(200).json({
        success: true,
        message: "Admin login successful."
    });
}
