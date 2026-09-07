import crypto from "crypto";
import type { PaymentGateway, InitiatePaymentInput, InitiatePaymentResult } from "./payment.types.js";

// MOCK IMPLEMENTATION — replace with real EasyPaisa Business API calls
// once credentials are available. The PaymentGateway interface above
// must stay identical so order.service.ts never needs to change.
export const easypaisaMockGateway: PaymentGateway = {
    async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
        const transactionId = `MOCK-${crypto.randomBytes(8).toString("hex")}`;

        console.warn(
            `🧪 [MOCK EasyPaisa] Initiating payment: Rs. ${input.amount} for order ${input.orderId} from ${input.phone}`,
        );

        return { transactionId, status: "PENDING" };
    },

    async verifyPayment(transactionId: string): Promise<{ status: "SUCCESS" | "FAILED" | "PENDING" }> {
        // In mock mode, we auto-succeed after "verification" — real API
        // would call EasyPaisa's transaction status endpoint here.
        console.warn(`🧪 [MOCK EasyPaisa] Verifying transaction ${transactionId} → auto-approving`);
        return { status: "SUCCESS" };
    },
};