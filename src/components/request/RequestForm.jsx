import "./RequestForm.css";
import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { db } from "../../firebase/firebase";
import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

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

            await addDoc(collection(db, "requests"), {
                name: formData.name,
                email: formData.email,
                artwork: formData.artwork,
                budget: formData.budget,
                message: formData.message,
                createdAt: serverTimestamp(),
                status: "Pending",
            });


            await emailjs.send(
                "service_hosr5x8",
                "template_mlhnzon",
                {
                    name: formData.name,
                    email: formData.email,
                    artwork: formData.artwork,
                    budget: formData.budget,
                    message: formData.message,
                },
                "BvHCiXoVA2xpwtCkF"
            );


            await emailjs.send(
                "service_hosr5x8",
                "template_mlhnzon",
                {
                    name: formData.name,
                    email: formData.email,
                    artwork: formData.artwork,
                    budget: formData.budget,
                    message: formData.message,
                },
                "BvHCiXoVA2xpwtCkF"
            );

            alert("🎉 Request Submitted Successfully!");

            setFormData({
                name: "",
                email: "",
                artwork: "",
                budget: "",
                message: "",
            });

        } catch (err) {
            console.error("Error:", err);
            alert(err.text || err.message);
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
                        <option value="">Select Artwork Type</option>

                        <option>Pencil Sketch</option>
                        <option>Realistic Portrait</option>
                        <option>Couple Portrait</option>
                        <option>Family Portrait</option>
                        <option>Pet Portrait</option>
                        <option>Anime Art</option>
                        <option>Canvas Painting</option>
                        <option>Color Pencil Art</option>
                        <option>Charcoal Sketch</option>
                        <option>Acrylic Painting</option>
                        <option>Watercolor Art</option>
                        <option>Mandala Art</option>
                        <option>Cartoon Portrait</option>
                        <option>Custom Artwork</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Budget"
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