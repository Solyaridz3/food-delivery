import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.js";
import HttpException from "../utils/exceptions/HttpException.js";

export async function authMiddleware(req, res, next) {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer ")) {
        return next(new HttpException(401, "Unauthorized"));
    }
    const accessToken = bearer.split("Bearer ")[1].trim();
    try {
        const payload = await verifyToken(accessToken);

        if (!payload.id) {
            return next(new HttpException(401, "Unauthorized"));
        }
        const userId = payload.id;
        req.user = userId;
        return next();

    } catch (error) {
        return next(new HttpException(401, "Unauthorized"));
    }
}
