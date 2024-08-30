import token from "../utils/token.js";
import HttpException from "../utils/exceptions/HttpException.js";

async function verifyTokenFromHeader(req, next) {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer ")) {
        return next(new HttpException(401, "Unauthorized"));
    }

    const accessToken = bearer.split("Bearer ")[1].trim();

    try {
        const payload = await token.verifyToken(accessToken);
        if (!payload.id) {
            return next(new HttpException(401, "Unauthorized"));
        }
        req.user = payload.id;
        req.role = payload.user_role;

        return payload; // Return payload for further use
    } catch (err) {
        return next(new HttpException(401, err.message));
    }
}

export async function authMiddleware(req, res, next) {
    const payload = await verifyTokenFromHeader(req, next);
    if (payload) next(); // Call next if token is verified
}

export async function isAdmin(req, res, next) {
    const payload = await verifyTokenFromHeader(req, next);

    if (payload && payload.role === "admin") {
        next(); // Proceed if user is admin
    } else {
        next(new HttpException(403, "Forbidden"));
    }
}
