import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, type JwtPayload } from "../../utils/jwt.js";
import { hashToken } from "../../utils/hash.js";
import { parseDurationToMs } from "../../utils/duration.js";
import { env } from "../../config/env.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";
import { createAndSendOtp, verifyOtp } from "./otp.service.js";

const SALT_ROUNDS = 12;

interface AuthResult {
    user: { id: string; name: string; email: string; role: JwtPayload["role"] };
    accessToken: string;
    refreshToken: string;
}

export async function issueTokensForUser(user: {
    id: string;
    role: JwtPayload["role"];
}): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRY)),
        },
    });

    return { accessToken, refreshToken };
}

async function issueTokens(user: {
    id: string;
    role: JwtPayload["role"];
}): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRY)),
        },
    });

    return { accessToken, refreshToken };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ApiError(409, "An account with this email already exists");

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { name: input.name, email: input.email, password: hashedPassword, phone: input.phone },
    });

    await createAndSendOtp(user.id, user.email, "EMAIL_VERIFICATION");

    const tokens = await issueTokensForUser(user);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
}

export async function verifyUserEmail(email: string, code: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    await verifyOtp(user.id, "EMAIL_VERIFICATION", code);
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
}

export async function requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return; // Don't reveal whether the email exists — silent no-op

    await createAndSendOtp(user.id, user.email, "PASSWORD_RESET");
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(400, "Invalid or expired code");

    await verifyOtp(user.id, "PASSWORD_RESET", code);

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

    // Reset password = kill all existing sessions, force re-login everywhere
    await prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
    });
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.password) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) throw new ApiError(401, "Invalid email or password");

    const tokens = await issueTokensForUser(user);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
}

export async function rotateRefreshToken(
    oldToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(oldToken);
    const oldHash = hashToken(oldToken);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: oldHash } });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
        if (stored) {
            // Reuse of an already-revoked token = likely theft. Kill all sessions for this user.
            await prisma.refreshToken.updateMany({
                where: { userId: stored.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }
        throw new ApiError(401, "Session expired, please log in again");
    }

    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

    const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.userId } });
    return issueTokens(user);
}

export async function revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(token), revokedAt: null },
        data: { revokedAt: new Date() },
    });
}