
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/admin-requests", {
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Unable to load requests.");
            }

            setRequests(result.requests || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            setError("");

            const response = await fetch("/api/admin-update-request", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({ id, status })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Unable to update status.");
            }

            setRequests(previous =>
                previous.map(item =>
                    String(item.id) === String(id)
                        ? { ...item, status: result.request.status }
                        : item
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            setError("");

            const response = await fetch("/api/admin-logout", {
                method: "POST",
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to log out.");
            }

            navigate("/admin/login", { replace: true });
        } catch (err) {
            setError(err.message);
            setLoggingOut(false);
        }
    };

    const pending = requests.filter(
        item => item.status === "Pending"
    ).length;

    const inProgress = requests.filter(
        item => item.status === "In Progress"
    ).length;

    const completed = requests.filter(
        item => item.status === "Completed"
    ).length;

    const formatDate = date => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const cardStyle = {
        background: "#242424",
        border: "1px solid #393939",
        borderRadius: "12px",
        padding: "22px"
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#171717",
            color: "#eee",
            padding: "30px",
            fontFamily: "Inter, sans-serif"
        }}>

            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "35px"
            }}>
                <div>
                    <h1 style={{
                        color: "#ffad00",
                        fontFamily: "Poppins, sans-serif",
                        margin: 0
                    }}>
                        Vyshu Arts Studio
                    </h1>

                    <p style={{ color: "#aaa" }}>
                        Admin Dashboard
                    </p>
                </div>

                <div style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap"
                }}>
                    <button
                        onClick={loadRequests}
                        disabled={loading || loggingOut}
                        style={{
                            padding: "11px 20px",
                            background: "#ffad00",
                            color: "#171717",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        ↻ Refresh Requests
                    </button>

                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        style={{
                            padding: "11px 20px",
                            background: "#383020",
                            color: "#ffad00",
                            border: "1px solid #665020",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        {loggingOut ? "Logging out..." : "↪ Logout"}
                    </button>
                </div>
            </header>

            <h2>Overview</h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "18px",
                marginBottom: "40px"
            }}>
                {[
                    ["Total Requests", requests.length],
                    ["Pending", pending],
                    ["In Progress", inProgress],
                    ["Completed", completed]
                ].map(([label, value]) => (
                    <div key={label} style={cardStyle}>
                        <p style={{ color: "#aaa", margin: 0 }}>
                            {label}
                        </p>

                        <h2 style={{
                            color: "#ffad00",
                            fontSize: "32px",
                            marginBottom: 0
                        }}>
                            {value}
                        </h2>
                    </div>
                ))}
            </div>

            <h2>Customer Requests</h2>

            {loading && <p>Loading customer requests...</p>}

            {error && (
                <p style={{ color: "#ff7777" }}>
                    {error}
                </p>
            )}

            {!loading && !error && requests.length === 0 && (
                <div style={cardStyle}>
                    No artwork requests found yet.
                </div>
            )}

            {!loading && requests.map(item => (
                <div
                    key={item.id}
                    style={{
                        ...cardStyle,
                        marginBottom: "18px"
                    }}
                >
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px"
                    }}>
                        <h3 style={{
                            color: "#ffad00",
                            marginTop: 0
                        }}>
                            {item.name}
                        </h3>

                        <select
                            value={item.status || "Pending"}
                            disabled={updatingId === item.id}
                            onChange={e =>
                                updateStatus(item.id, e.target.value)
                            }
                            style={{
                                background: "#383020",
                                color: "#ffad00",
                                padding: "9px 12px",
                                border: "1px solid #665020",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {updatingId === item.id && (
                        <p style={{ color: "#ffad00" }}>
                            Updating status...
                        </p>
                    )}

                    <p><strong>Email:</strong> {item.email}</p>
                    <p><strong>Artwork:</strong> {item.artwork}</p>
                    <p><strong>Budget:</strong> {item.budget}</p>
                    <p><strong>Message:</strong> {item.message}</p>

                    <p>
                        <strong>Submitted:</strong>{" "}
                        {formatDate(item.created_at)}
                    </p>

                    <p style={{
                        color: "#888",
                        fontSize: "12px"
                    }}>
                        Request ID: {item.id}
                    </p>
                </div>
            ))}
        </div>
    );
}
