
import {
    verifyAdminSession
} from "../server/adminAuth.js";

import {
    getArtRequests
} from "../server/database.js";

export default async function handler(req, res) {
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

    const token = cookies.vyshu_admin;

    if (!verifyAdminSession(token)) {
        return res.status(401).json({
            error: "Unauthorized. Please log in."
        });
    }

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const requests = await getArtRequests();

        return res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("Admin requests API error:", error);

        return res.status(500).json({
            error: "Unable to load artwork requests."
        });
    }
}
