import "./Footer.css";

import {
    FaInstagram,
    FaWhatsapp,
    FaEnvelope,
    FaPaintBrush,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <h2>
                    Let’s Create Something
                    <span> Beautiful Together 🎨</span>
                </h2>

                <p>
                    Want custom portraits, anime sketches, or
                    digital artworks? Let’s connect and bring
                    your ideas to life.
                </p>

                <button>Hire Me</button>
            </div>

            <div className="footer-middle">
                <div className="footer-logo">
                    <FaPaintBrush />

                    <div>
                        <h3>Vyshu Arts Studio</h3>

                        <p>@_wanderink._</p>
                    </div>
                </div>

                <div className="social-icons">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/_wanderink._?igsh=dnl6YnB3bnhtemR3"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaInstagram />
                    </a>

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/919985126855"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaWhatsapp />
                    </a>

                    {/* Gmail */}
                    <a href="mailto:vyshugupta20@gmail.com">
                        <FaEnvelope />
                    </a>
                </div>
            </div>

            <div className="footer-contact">
                <p>📧 vyshugupta20@gmail.com</p>

                <p>📱 +91 9985126855</p>
            </div>

            <div className="footer-bottom">
                <p>
                    © 2026 Vyshu Arts Studio. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;