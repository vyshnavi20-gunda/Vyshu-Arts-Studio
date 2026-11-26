
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/admin-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password }),
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Login failed.");
                return;
            }

            navigate("/admin");
        } catch {
            setError("Unable to connect. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h1 style={styles.title}>Vyshu Arts Studio</h1>
                <p style={styles.subtitle}>ADMIN ACCESS</p>

                <label style={styles.label}>
                    Admin Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={styles.input}
                />

                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#171717",
        padding: "20px"
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        background: "#242424",
        borderRadius: "16px",
        border: "1px solid #444",
        boxSizing: "border-box"
    },
    title: {
        color: "#ffad00",
        textAlign: "center",
        fontSize: "26px"
    },
    subtitle: {
        color: "#aaa",
        textAlign: "center",
        letterSpacing: "3px",
        marginBottom: "35px"
    },
    label: {
        display: "block",
        color: "#eee",
        marginBottom: "10px"
    },
    input: {
        width: "100%",
        padding: "13px",
        boxSizing: "border-box",
        background: "#303030",
        border: "1px solid #555",
        borderRadius: "8px",
        color: "#fff",
        marginBottom: "20px"
    },
    button: {
        width: "100%",
        padding: "14px",
        background: "#ffad00",
        color: "#171717",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer"
    },
    error: {
        color: "#ff7777",
        marginBottom: "15px"
    }
};
