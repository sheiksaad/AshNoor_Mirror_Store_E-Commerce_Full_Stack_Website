import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { hashToken } from "../../utils/hash.js";
import { generateOtpCode } from "../../utils/otp.js";
import { sendEmail } from "../../utils/email.js";
import { otpEmailTemplate } from "./email.templates.js";
import type { OtpPurpose } from "../../../generated/prisma/enums.js";

const OTP_TTL_MS = 10 * 60 * 1000;

export async function createAndSendOtp(
    userId: string,
    email: string,
    purpose: OtpPurpose,
): Promise<void> {
    const code = generateOtpCode();

    await prisma.otp.create({
        data: {
            userId,
            purpose,
            codeHash: hashToken(code),
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
        },
    });

    await sendEmail({
        to: email,
        subject: purpose === "EMAIL_VERIFICATION" ? "Verify your email" : "Reset your password",
        html: otpEmailTemplate(code, purpose === "EMAIL_VERIFICATION" ? "verify" : "reset"),
    });
}

export async function verifyOtp(userId: string, purpose: OtpPurpose, code: string): Promise<void> {
    const record = await prisma.otp.findFirst({
        where: { userId, purpose, consumedAt: null },
        orderBy: { createdAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
        throw new ApiError(400, "OTP expired or not found, please request a new one");
    }

    if (record.codeHash !== hashToken(code)) {
        throw new ApiError(400, "Invalid OTP code");
    }

    await prisma.otp.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
}