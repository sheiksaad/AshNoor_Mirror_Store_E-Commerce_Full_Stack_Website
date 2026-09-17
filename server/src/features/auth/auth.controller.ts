import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.validation.js";
import {
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "./auth.validation.js";
import { verifyUserEmail, requestPasswordReset, resetPassword } from "./auth.service.js";
import { prisma } from "../../config/prisma.js";
import { registerUser, loginUser, revokeRefreshToken, rotateRefreshToken } from "./auth.service.js";
import { googleAuthSchema } from "./auth.validation.js";
import { findOrCreateGoogleUser } from "./google.service.js";
import { issueTokensForUser } from "./auth.service.js";
// imports cleaned
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { env } from "../../config/env.js";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, name: true, email: true, role: true },
    });

    if (!user) throw new ApiError(404, "User not found");
    sendResponse(res, 200, "Current user fetched", user);
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
    const input = verifyEmailSchema.parse(req.body);
    await verifyUserEmail(input.email, input.code);
    sendResponse(res, 200, "Email verified successfully", null);
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
    const input = forgotPasswordSchema.parse(req.body);
    await requestPasswordReset(input.email);
    sendResponse(res, 200, "If an account exists, a reset code has been sent", null);
}

export async function resetPasswordHandler(req: Request, res: Response): Promise<void> {
    const input = resetPasswordSchema.parse(req.body);
    await resetPassword(input.email, input.code, input.newPassword);
    sendResponse(res, 200, "Password reset successfully", null);
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
    const input = googleAuthSchema.parse(req.body);
    const user = await findOrCreateGoogleUser(input.idToken);
    const tokens = await issueTokensForUser(user);

    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendResponse(res, 200, "Signed in with Google successfully", {
        user,
        accessToken: tokens.accessToken,
    });
}

export async function register(req: Request, res: Response): Promise<void> {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);

    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendResponse(res, 201, "Account created successfully", {
        user: result.user,
        accessToken: result.accessToken,
    });
}

export async function login(req: Request, res: Response): Promise<void> {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendResponse(res, 200, "Logged in successfully", {
        user: result.user,
        accessToken: result.accessToken,
    });
}

export async function refresh(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) throw new ApiError(401, "Refresh token missing");

    const tokens = await rotateRefreshToken(token);

    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendResponse(res, 200, "Access token refreshed", { accessToken: tokens.accessToken });
}

export async function logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.refreshToken as string | undefined;
    if (token) {
        await revokeRefreshToken(token);
    }
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    sendResponse(res, 200, "Logged out successfully", null);
}