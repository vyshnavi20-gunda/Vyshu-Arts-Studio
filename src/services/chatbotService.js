export const generateAIResponse = async (message) => {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return data.error || "The assistant is temporarily unavailable.";
        }

        return data.reply || "No response from the assistant.";
    } catch (error) {
        console.error("Chat request failed:", error);
        return "Unable to connect to the assistant. Please try again.";
    }
};
