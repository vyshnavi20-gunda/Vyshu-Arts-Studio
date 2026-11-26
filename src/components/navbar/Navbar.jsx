
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
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("vyshu-theme") !== "light";
    });

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle(
            "light-theme",
            !darkMode
        );

        localStorage.setItem(
            "vyshu-theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode((previous) => !previous);
    };

    useEffect(() => {
        if (!mobileOpen) return;

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
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((s) => !s)}
            >
                {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>

            <div className="nav-right">
                <button
                    className="theme-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle website theme"
                    title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

                <Link to="/request">
                    <button className="hire-btn">Hire Me</button>
                </Link>
            </div>

            {mobileOpen && (
                <div className="mobile-menu" id="mobile-navigation">
                    <ul>
                        {[
                            ["Home", "/"],
                            ["Gallery", "/gallery"],
                            ["About", "/about"],
                            ["Contact", "/contact"],
                        ].map(([label, path]) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mobile-actions">
                        <button
                            className="theme-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle website theme"
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>

                        <Link
                            to="/request"
                            onClick={() => setMobileOpen(false)}
                        >
                            <button className="hire-btn">Hire Me</button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
