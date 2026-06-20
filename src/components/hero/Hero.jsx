import "./Hero.css";
import { motion } from "framer-motion";

function Hero() {
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
                    <button className="explore-btn">Explore Gallery</button>

                    <button className="order-btn">Order Sketch</button>
                </div>
            </motion.div>
        </section>
    );
}

export default Hero;