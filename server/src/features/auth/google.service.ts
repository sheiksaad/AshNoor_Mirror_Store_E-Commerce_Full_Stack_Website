import { OAuth2Client } from "google-auth-library";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { env } from "../../config/env.js";
import type { JwtPayload } from "../../utils/jwt.js";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

interface GoogleProfile {
    email: string;
    name: string;
    googleId: string;
}

async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
        throw new ApiError(401, "Invalid Google token");
    }

    return {
        email: payload.email,
        name: payload.name ?? payload.email.split("@")[0]!,
        googleId: payload.sub,
    };
}

export async function findOrCreateGoogleUser(
    idToken: string,
): Promise<{ id: string; name: string; email: string; role: JwtPayload["role"] }> {
    const profile = await verifyGoogleIdToken(idToken);

    let user = await prisma.user.findUnique({ where: { email: profile.email } });

    if (user && !user.googleId) {
        // Existing password-based account, same email — link Google to it
        user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.googleId, emailVerified: true },
        });
    }

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: profile.name,
                email: profile.email,
                googleId: profile.googleId,
                emailVerified: true,
            },
        });
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role };
}