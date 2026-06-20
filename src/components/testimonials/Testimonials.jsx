import "./Testimonials.css";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const reviews = [
    {
        id: 1,
        name: "Varshini",
        review:
            "The portrait was absolutely beautiful and realistic. I loved every detail!",
    },

    {
        id: 2,
        name: "Prabhu",
        review:
            "Amazing artwork and very fast delivery. Highly recommended 🎨",
    },

    {
        id: 3,
        name: "Naresh",
        review:
            "The anime sketch looked incredible. Better than I expected!",
    },
];

function Testimonials() {
    return (
        <section className="testimonials-section">
            <h4>CLIENT REVIEWS</h4>

            <h2>
                What People Say About
                <span> My Art</span>
            </h2>

            <div className="reviews-container">
                {reviews.map((item, index) => (
                    <motion.div
                        className="review-card"
                        key={item.id}
                        initial={{ opacity: 0, y: 80 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: index * 0.2 }}
                    >
                        <div className="stars">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>

                        <p>{item.review}</p>

                        <h3>{item.name}</h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default Testimonials;