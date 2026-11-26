
import crypto from "node:crypto";

const SESSION_DURATION = 8 * 60 * 60;

function getSecret() {
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!secret) {
        throw new Error("ADMIN_SESSION_SECRET is missing.");
    }

    return secret;
}

export function createAdminSession() {
    const payload = {
        admin: true,
        expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION
    };

    const encoded = Buffer
        .from(JSON.stringify(payload))
        .toString("base64url");

    const signature = crypto
        .createHmac("sha256", getSecret())
        .update(encoded)
        .digest("base64url");

    return `${encoded}.${signature}`;
}

export function verifyAdminSession(token) {
    if (!token || typeof token !== "string") {
        return false;
    }

    const parts = token.split(".");

    if (parts.length !== 2) {
        return false;
    }

    const [encoded, signature] = parts;

    const expected = crypto
        .createHmac("sha256", getSecret())
        .update(encoded)
        .digest();

    let received;

    try {
        received = Buffer.from(signature, "base64url");
    } catch {
        return false;
    }

    if (
        received.length !== expected.length ||
        !crypto.timingSafeEqual(received, expected)
    ) {
        return false;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(encoded, "base64url").toString()
        );

        return (
            payload.admin === true &&
            payload.expiresAt > Math.floor(Date.now() / 1000)
        );
    } catch {
        return false;
    }
}

export function verifyAdminPassword(password) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
        typeof password !== "string" ||
        !adminPassword
    ) {
        return false;
    }

    const supplied = Buffer.from(password);
    const expected = Buffer.from(adminPassword);

    if (supplied.length !== expected.length) {
        return false;
    }

    return crypto.timingSafeEqual(supplied, expected);
}
