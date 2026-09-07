import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt.js";
import { ApiError } from "../utils/apiError.js";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError(401, "Access token missing");
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = verifyAccessToken(token as string);
        next();
    } catch {
        throw new ApiError(401, "Invalid or expired access token");
    }
}