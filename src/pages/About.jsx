import Navbar from "../components/navbar/Navbar";
import AboutSection from "../components/about/AboutSection";
import Testimonials from "../components/testimonials/Testimonials";
import Footer from "../components/footer/Footer";
import ChatBot from "../components/chatbot/ChatBot";

function About() {
    return (
        <>
            <Navbar />
            <AboutSection />
            <Testimonials />
            <Footer />
            <ChatBot />
        </>
    );
}

export default About;