import { requestOpenRouterReply } from "../server/openRouterChat.js";

export default async function handler(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return response.status(405).json({ error: "Method not allowed." });
    }

    const result = await requestOpenRouterReply({
        message: request.body?.message,
        apiKey:
            process.env.OPENROUTER_API_KEY ||
            process.env.VITE_GEMINI_API_KEY,
        siteUrl: request.headers.origin,
    });

    return response.status(result.status).json(result.body);
}
