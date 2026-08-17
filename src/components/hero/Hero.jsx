import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();
    return (
        <section className="hero">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1>
                    Turning Memories Into <span>Art</span>
                </h1>

                <p>
                    Professional custom sketches, portraits, and digital artworks
                    crafted with creativity and emotion.
                </p>

                <div className="hero-buttons">
                    <button
                        className="explore-btn"
                        type="button"
                        onClick={() => navigate("/gallery")}
                    >
                        Explore Gallery
                    </button>

                    <button
                        className="order-btn"
                        type="button"
                        onClick={() => navigate("/request")}
                    >
                        Order Sketch
                    </button>
                </div>
            </motion.div>
        </section>
    );
}

export default Hero;