import "./Navbar.css";
import { Link } from "react-router-dom";
import {
    FaPaintBrush,
    FaMoon,
    FaSun,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";

function Navbar() {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleTheme = () => {
        document.documentElement.classList.toggle("light-theme");
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMobileOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [mobileOpen]);

    return (
        <nav className="navbar">
            <div className="logo">
                <FaPaintBrush className="logo-icon" />
                <h2>Vyshu Arts Studio</h2>
            </div>

            <button
                className="menu-btn"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileOpen((s) => !s)}
            >
                {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>

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

            {mobileOpen && (
                <div className="mobile-menu" id="mobile-navigation">
                    <ul>
                        <li>
                            <Link to="/" onClick={() => setMobileOpen(false)}>
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/gallery"
                                onClick={() => setMobileOpen(false)}
                            >
                                Gallery
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/about"
                                onClick={() => setMobileOpen(false)}
                            >
                                About
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/contact"
                                onClick={() => setMobileOpen(false)}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>

                    <div className="mobile-actions">
                        <button
                            className="theme-btn"
                            type="button"
                            aria-label="Change color theme"
                            onClick={toggleTheme}
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>

                        <Link to="/request" onClick={() => setMobileOpen(false)}>
                            <button className="hire-btn">Hire Me</button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
