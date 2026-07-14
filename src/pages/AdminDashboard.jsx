import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminDashboard() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        const snapshot = await getDocs(collection(db, "requests"));

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setRequests(data);
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Customer Requests</h1>

            {requests.map((item) => (
                <div
                    key={item.id}
                    style={{
                        marginTop: 20,
                        padding: 20,
                        borderRadius: 10,
                        background: "#222",
                        color: "white"
                    }}
                >
                    <h2>{item.name}</h2>

                    <p>Email : {item.email}</p>

                    <p>Phone : {item.phone}</p>

                    <p>Artwork : {item.artworkType}</p>

                    <p>Description : {item.description}</p>

                    <p>Budget : {item.budget}</p>

                    <p>Deadline : {item.deadline}</p>

                    <p>Status : {item.status}</p>

                </div>
            ))}
        </div>
    );
}