
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";

    res.setHeader(
        "Set-Cookie",
        `vyshu_admin=; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=0`
    );

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}
