import "./ChatBot.css";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { generateAIResponse } from "../../services/chatbotService";

function ChatBot() {
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            text: "Hi 👋 Ask me anything about artworks 🎨",
            sender: "bot",
        },
    ]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    // Auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = {
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);

        const currentMessage = input;

        setInput("");

        setLoading(true);

        const aiReply = await generateAIResponse(currentMessage);

        setLoading(false);

        setMessages((prev) => [
            ...prev,
            {
                text: aiReply,
                sender: "bot",
            },
        ]);
    };

    return createPortal(
        <>
            <button
                className="chat-toggle"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close chat" : "Open chat"}
                aria-expanded={open}
                aria-controls="art-studio-chatbot"
            >
                {open ? <FaTimes /> : <FaRobot />}
            </button>

            {open && (
                <section
                    className="chatbot"
                    id="art-studio-chatbot"
                    aria-label="Vyshu AI Assistant"
                >
                    <div className="chat-header">
                        <h3>Vyshu AI Assistant</h3>
                        <button
                            className="chat-close"
                            type="button"
                            aria-label="Close chat"
                            onClick={() => setOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-body">
                        {messages.length === 0 && (
                            <div className="welcome-text">
                                Ask anything about artworks 🎨
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? "user-message"
                                        : "bot-message"
                                }
                            >
                                {msg.text}
                            </div>
                        ))}

                        {loading && (
                            <div className="bot-message typing">
                                AI is typing...
                            </div>
                        )}

                        <div ref={chatEndRef}></div>
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <button onClick={sendMessage} aria-label="Send message">
                            <FaPaperPlane />
                        </button>
                    </div>
                </section>
            )}
        </>,
        document.body,
    );
}

export default ChatBot;
