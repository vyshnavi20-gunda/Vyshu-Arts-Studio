import "./RequestForm.css";
import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

function RequestForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        artwork: "",
        budget: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await emailjs.send(
                "service_hosr5x8",
                "template_41xgma4",
                formData,
                "BvHCiXoVA2xpwtCkF"
            );

            alert("Artwork request sent successfully 🎨");

            setFormData({
                name: "",
                email: "",
                artwork: "",
                budget: "",
                message: "",
            });
        } catch (error) {
            console.log(error);

            alert("Failed to send request 😢");
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
                        required
                    />

                    <input
                        type="email"
                        placeholder="Your Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="artwork"
                        value={formData.artwork}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Artwork Type
                        </option>

                        <option>Pencil Sketch</option>

                        <option>Anime Portrait</option>

                        <option>Digital Painting</option>

                        <option>Realistic Portrait</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Your Budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                    />

                    <textarea
                        placeholder="Describe your artwork..."
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>

                    <button type="submit">
                        Submit Request
                    </button>
                </form>
            </motion.div>
        </section>
    );
}

export default RequestForm;