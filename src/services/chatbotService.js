const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIResponse = async (message) => {
    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are Vyshu Arts Studio AI assistant.",
                        },

                        {
                            role: "user",
                            content: message,
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        console.log("OPENROUTER:", data);

        if (data.choices) {
            return data.choices[0].message.content;
        }

        if (data.error) {
            return data.error.message;
        }

        return "No response from AI.";
    } catch (error) {
        console.log(error);

        return "AI failed 😢";
    }
};