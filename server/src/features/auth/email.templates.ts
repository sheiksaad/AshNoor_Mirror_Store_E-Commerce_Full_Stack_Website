export function otpEmailTemplate(code: string, purpose: "verify" | "reset"): string {
    const heading = purpose === "verify" ? "Verify your email" : "Reset your password";
    const message =
        purpose === "verify"
            ? "Use the code below to verify your email address."
            : "Use the code below to reset your password.";

    return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>${heading}</h2>
      <p>${message}</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111;">${code}</p>
      <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;
}