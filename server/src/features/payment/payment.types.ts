export interface InitiatePaymentInput {
    orderId: string;
    amount: number;
    phone: string;
}

export interface InitiatePaymentResult {
    transactionId: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    redirectUrl?: string;
}

export interface PaymentGateway {
    initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
    verifyPayment(transactionId: string): Promise<{ status: "SUCCESS" | "FAILED" | "PENDING" }>;
}