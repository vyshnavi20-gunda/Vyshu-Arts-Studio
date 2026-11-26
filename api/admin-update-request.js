
import { verifyAdminSession } from "../server/adminAuth.js";
import { updateArtRequestStatus } from "../server/database.js";

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

    if (!verifyAdminSession(cookies.vyshu_admin)) {
        return res.status(401).json({
            error: "Unauthorized. Please log in."
        });
    }

    if (req.method !== "PATCH") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { id, status } = req.body || {};

    if (!id || !/^\d+$/.test(String(id))) {
        return res.status(400).json({
            error: "Invalid request ID."
        });
    }

    try {
        const updated = await updateArtRequestStatus(
            id,
            status
        );

        if (!updated.length) {
            return res.status(404).json({
                error: "Artwork request not found."
            });
        }

        return res.status(200).json({
            success: true,
            request: updated[0]
        });

    } catch (error) {
        console.error("Admin update error:", error);

        return res.status(400).json({
            error: error.message || "Unable to update request."
        });
    }
}
