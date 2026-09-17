export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export function isGoogleAuthConfigured(): boolean {
    return Boolean(
        GOOGLE_CLIENT_ID &&
        GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID" &&
        !GOOGLE_CLIENT_ID.includes("placeholder") &&
        GOOGLE_CLIENT_ID.trim() !== ""
    );
}
