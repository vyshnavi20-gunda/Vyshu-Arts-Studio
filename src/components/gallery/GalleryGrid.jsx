import "./GalleryGrid.css";
import artworks from "../../data/artworks";
import ArtworkCard from "./ArtworkCard";

function GalleryGrid() {
    return (
        <section className="gallery-section">
            <h2>Featured Artworks</h2>

            <div className="gallery-grid">
                {artworks.map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
            </div>
        </section>
    );
}

export default GalleryGrid;