import Navbar from "../components/navbar/Navbar";
import GalleryGrid from "../components/gallery/GalleryGrid";
import Footer from "../components/footer/Footer";
import ChatBot from "../components/chatbot/ChatBot";

function Gallery() {
    return (
        <>
            <Navbar />
            <GalleryGrid />
            <Footer />
            <ChatBot />
        </>
    );
}

export default Gallery;