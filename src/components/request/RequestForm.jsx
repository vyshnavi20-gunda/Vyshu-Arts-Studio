
import "./RequestForm.css";
import { useState } from "react";
import { motion } from "framer-motion";

const initialForm = {
    name: "",
    email: "",
    artwork: "",
    budget: "",
    message: "",
};

function RequestForm() {
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));

        setFeedback({ type: "", message: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                value.trim(),
            ])
        );

        if (Object.values(data).some((value) => !value)) {
            setFeedback({
                type: "error",
                message: "Please fill in all the details.",
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setFeedback({
                type: "error",
                message: "Please enter a valid email address.",
            });
            return;
        }

        setLoading(true);
        setFeedback({ type: "", message: "" });

        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Unable to submit your request."
                );
            }

            setFormData(initialForm);

            setFeedback({
                type: "success",
                message:
                    "Your artwork request has been submitted successfully! 🎉",
            });

        } catch (error) {
            console.error("Artwork submission error:", error);

            setFeedback({
                type: "error",
                message:
                    error.message || "Something went wrong. Please try again.",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="request-section">
            <motion.div
                className="request-container"
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h4>CUSTOM ART REQUEST</h4>

                <h2>
                    Order Your Dream
                    <span> Artwork 🎨</span>
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={120}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Your Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        maxLength={254}
                        required
                    />

                    <select
                        name="artwork"
                        value={formData.artwork}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Artwork Type</option>
                        <option value="Pencil Sketch">Pencil Sketch</option>
                        <option value="Realistic Portrait">Realistic Portrait</option>
                        <option value="Couple Portrait">Couple Portrait</option>
                        <option value="Family Portrait">Family Portrait</option>
                        <option value="Pet Portrait">Pet Portrait</option>
                        <option value="Anime Art">Anime Art</option>
                        <option value="Canvas Painting">Canvas Painting</option>
                        <option value="Color Pencil Art">Color Pencil Art</option>
                        <option value="Charcoal Sketch">Charcoal Sketch</option>
                        <option value="Acrylic Painting">Acrylic Painting</option>
                        <option value="Watercolor Art">Watercolor Art</option>
                        <option value="Mandala Art">Mandala Art</option>
                        <option value="Cartoon Portrait">Cartoon Portrait</option>
                        <option value="Custom Artwork">Custom Artwork</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Your Budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        maxLength={80}
                        required
                    />

                    <textarea
                        placeholder="Describe your artwork..."
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={5000}
                        required
                    />

                    {feedback.message && (
                        <p
                            className={`request-feedback ${feedback.type}`}
                            role="status"
                            aria-live="polite"
                        >
                            {feedback.message}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Submitting..."
                            : "Submit Request"}
                    </button>

                </form>
            </motion.div>
        </section>
    );
}

export default RequestForm;
