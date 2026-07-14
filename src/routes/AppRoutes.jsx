import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import Home from "../pages/Home";
import Gallery from "../pages/Gallery";
import About from "../pages/About";
import Contact from "../pages/Contact";
import RequestDrawing from "../pages/RequestDrawing";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/gallery' element={<Gallery />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/request' element={<RequestDrawing />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;