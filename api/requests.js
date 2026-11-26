
import { saveArtRequest } from "../server/database.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { name, email, artwork, budget, message } = req.body || {};

    if (
        !name?.trim() ||
        !email?.trim() ||
        !artwork?.trim() ||
        !budget?.trim() ||
        !message?.trim()
    ) {
        return res.status(400).json({
            error: "Please fill in all details."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
        return res.status(400).json({
            error: "Please enter a valid email."
        });
    }

    try {
        // First save the request in Neon
        const savedRequest = await saveArtRequest({
            name: name.trim(),
            email: email.trim(),
            artwork: artwork.trim(),
            budget: budget.trim(),
            message: message.trim()
        });

        // Then send an email notification
        try {
            await resend.emails.send({
                from: "Vyshu Arts Studio <onboarding@resend.dev>",
                to: ["vyshnavigupta20@gmail.com"],
                subject: "New Artwork Request Received!",
                html: `
                    <h2>New Artwork Request 🎨</h2>
                    <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
                    <p><strong>Artwork:</strong> ${escapeHtml(artwork.trim())}</p>
                    <p><strong>Budget:</strong> ${escapeHtml(budget.trim())}</p>
                    <p><strong>Message:</strong> ${escapeHtml(message.trim())}</p>
                    <p>Log in to your studio dashboard to review this request.</p>
                `
            });

            console.log("Email notification sent successfully.");
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
        }

        return res.status(201).json({
            success: true,
            message: "Your artwork request was submitted!",
            request: savedRequest[0]
        });

    } catch (error) {
        console.error("Artwork request error:", error);

        return res.status(500).json({
            error: "Unable to save your request. Please try again."
        });
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}
