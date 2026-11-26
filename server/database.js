
import { neon } from "@neondatabase/serverless";

function getDatabase() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing. Check your .env file.");
    }

    return neon(databaseUrl);
}

export async function saveArtRequest(data) {
    const sql = getDatabase();

    // Create the table if it doesn't exist
    await sql`
        CREATE TABLE IF NOT EXISTS art_requests (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(254) NOT NULL,
            artwork VARCHAR(120) NOT NULL,
            budget VARCHAR(80) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(30) DEFAULT 'Pending',
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `;

    // Save customer request
    const saved = await sql`
        INSERT INTO art_requests
        (name, email, artwork, budget, message)
        VALUES (
            ${data.name},
            ${data.email},
            ${data.artwork},
            ${data.budget},
            ${data.message}
        )
        RETURNING *
    `;

    return saved;
}


// Get all artwork requests for the admin dashboard
export async function getArtRequests() {
    const sql = getDatabase();

    const requests = await sql`
        SELECT *
        FROM art_requests
        ORDER BY created_at DESC
    `;

    return requests;
}

// Update artwork request status
export async function updateArtRequestStatus(id, status) {
    const sql = getDatabase();

    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid request status.");
    }

    const updated = await sql`
        UPDATE art_requests
        SET status = ${status}
        WHERE id = ${id}
        RETURNING *
    `;

    return updated;
}
