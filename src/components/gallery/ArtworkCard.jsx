import "./ArtworkCard.css";
import { FaHeart, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

function ArtworkCard({ artwork }) {
    return (
        <motion.div
            className="art-card"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
        >
            <img src={artwork.image} alt={artwork.title} />

            <div className="art-content">
                <h3>{artwork.title}</h3>

                <div className="art-actions">
                    <button className="like-btn">
                        <FaHeart />
                        {artwork.likes}
                    </button>

                    <a href={artwork.image} download>
                        <button className="download-btn">
                            <FaDownload />
                        </button>
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

export default ArtworkCard;