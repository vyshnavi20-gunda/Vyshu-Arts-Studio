
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        let active = true;

        fetch("/api/admin-requests", {
            credentials: "same-origin"
        })
            .then(response => {
                if (active) {
                    setAuthenticated(response.ok);
                }
            })
            .catch(() => {
                if (active) {
                    setAuthenticated(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    if (authenticated === null) {
        return <p>Checking admin access...</p>;
    }

    if (!authenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
