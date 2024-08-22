import crypto from "crypto";

const secret = "secret";

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function createToken(user) {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { id: user.id, role: user.userRole };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
        .createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
    }

    const payload = JSON.parse(
        Buffer.from(encodedPayload, "base64").toString()
    );
    return payload;
}

export default { createToken, verifyToken };
