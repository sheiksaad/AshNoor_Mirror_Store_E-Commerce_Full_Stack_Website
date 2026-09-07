import { resend } from "../config/resend.js";
import { env } from "../config/env.js";

interface SendEmailInput {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
    const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
    });

    if (error) {
        console.error("❌ Email send failed:", error);
        throw new Error("Failed to send email");
    }
}