import "./Navbar.css";
import { Link } from "react-router-dom";
import { FaPaintBrush, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
    const [darkMode, setDarkMode] = useState(true);

    const toggleTheme = () => {
        document.documentElement.classList.toggle("light-theme");
        setDarkMode(!darkMode);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <FaPaintBrush className="logo-icon" />
                <h2>Vyshu Arts Studio</h2>
            </div>

            <ul className="nav-links">
                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                    <Link to="/about">About</Link>
                </li>

                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>

            <div className="nav-right">
                <button className="theme-btn" onClick={toggleTheme}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

                <Link to="/request">
                    <button className="hire-btn">Hire Me</button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;