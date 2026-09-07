import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
    userId: string;
    role: "CUSTOMER" | "ADMIN";
}

export function signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"] });
}

export function signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}