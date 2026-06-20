import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import GalleryGrid from "../components/gallery/GalleryGrid";
import ChatBot from "../components/chatbot/ChatBot";
import AboutSection from "../components/about/AboutSection";
import Testimonials from "../components/testimonials/Testimonials";
import Footer from "../components/footer/Footer";
import RequestForm from "../components/request/RequestForm";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <GalleryGrid />
            <AboutSection />
            <Testimonials />
            <RequestForm />
            <Footer />
            <ChatBot />
        </>
    );
}

export default Home;