import crypto from "crypto";

// Secret key for signing and verifying tokens, stored in environment variables
const secret = process.env.JWT_SECRET;

/**
 * Encodes a string in Base64 URL format
 * @param {string} str - The string to encode
 * @returns {string} Base64 URL encoded string
 */
function base64UrlEncode(str) {
  return Buffer.from(str) // Convert string to a Buffer
    .toString("base64") // Encode the Buffer in base64
    .replace(/=/g, "") // Remove padding '=' characters
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_"); // Replace '/' with '_'
}

/**
 * Creates a JSON Web Token (JWT)
 * @param {Object} user - User object containing user details
 * @param {number} [expiresIn=7200] - Token expiration time in seconds (default: 2 hours)
 * @returns {string} JWT token
 */
function createToken(user, expiresIn = 7200) {
  // Header of the JWT specifying the algorithm and type
  const header = { alg: "HS256", typ: "JWT" };
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  // Payload containing user details and expiration time
  const payload = {
    id: user.id, // User ID
    role: user.user_role, // User role
    expires: currentTime + expiresIn, // Expiration time in seconds
  };

  // Base64 URL encode the header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create the signature using HMAC SHA-256 algorithm and the secret key
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Return the complete JWT in the format: header.payload.signature
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a JSON Web Token (JWT) and checks its validity
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload if the token is valid
 * @throws Will throw an error if the token is invalid or expired
 */
function verifyToken(token) {
  // Split the token into its three parts: header, payload, and signature
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  // Recreate the signature using the header and payload to validate
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Compare the provided signature with the expected signature
  if (signature !== expectedSignature) {
    throw new Error("Invalid signature"); // Invalid signature error
  }

  // Decode the payload from Base64 URL format
  const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString());

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  // Check if the token is expired
  if (payload.expires && currentTime > payload.expires) {
    throw new Error("Token has expired"); // Token expired error
  }

  // Return the decoded payload if the token is valid
  return payload;
}

// Export the functions for creating, verifying tokens, and encoding to Base64 URL
export default { createToken, verifyToken, base64UrlEncode };
