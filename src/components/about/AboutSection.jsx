import "./AboutSection.css";
import { motion } from "framer-motion";
import {
    FaPaintBrush,
    FaAward,
    FaHeart,
} from "react-icons/fa";

function AboutSection() {
    return (
        <section className="about-section">
            <motion.div
                className="about-left"
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <h4>ABOUT ARTIST</h4>

                <h2>
                    Bringing Photos To Life Through
                    <span> Art & Emotion</span>
                </h2>

                <p>
                    I create realistic portraits, anime sketches,
                    digital paintings, and custom artworks with
                    creativity and passion. Every artwork is crafted
                    carefully to turn memories into timeless art.
                </p>

                <button>Know More</button>
            </motion.div>

            <motion.div
                className="about-right"
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="about-card">
                    <FaPaintBrush />

                    <h3>200+</h3>

                    <p>Artworks Created</p>
                </div>

                <div className="about-card">
                    <FaHeart />

                    <h3>150+</h3>

                    <p>Happy Clients</p>
                </div>

                <div className="about-card">
                    <FaAward />

                    <h3>5★</h3>

                    <p>Client Ratings</p>
                </div>
            </motion.div>
        </section>
    );
}

export default AboutSection;