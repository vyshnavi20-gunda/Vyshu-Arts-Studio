const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function requestOpenRouterReply({ message, apiKey, siteUrl }) {
    if (!apiKey) {
        return {
            status: 500,
            body: {
                error: "Chatbot is not configured. Add OPENROUTER_API_KEY to the server environment.",
            },
        };
    }

    if (typeof message !== "string" || !message.trim()) {
        return { status: 400, body: { error: "Please enter a message." } };
    }

    if (message.length > 2000) {
        return {
            status: 400,
            body: { error: "Please keep your message under 2,000 characters." },
        };
    }

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": siteUrl || "http://localhost",
                "X-OpenRouter-Title": "Vyshu Arts Studio",
            },
            body: JSON.stringify({
                model: "openrouter/free",
                max_tokens: 350,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are the helpful assistant for Vyshu Arts Studio. Answer briefly and warmly about portraits, sketches, artwork types, ordering, and the studio. If you do not know a studio-specific detail, ask the visitor to use the contact form.",
                    },
                    { role: "user", content: message.trim() },
                ],
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error("OpenRouter request failed:", response.status, data?.error?.message);
            return {
                status: response.status,
                body: {
                    error:
                        response.status === 429
                            ? "The assistant is busy right now. Please try again shortly."
                            : "The assistant could not answer right now. Please try again.",
                },
            };
        }

        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return {
                status: 502,
                body: { error: "The assistant returned an empty response." },
            };
        }

        return { status: 200, body: { reply } };
    } catch (error) {
        console.error("OpenRouter connection failed:", error);
        return {
            status: 502,
            body: { error: "Unable to connect to the assistant provider." },
        };
    }
}
