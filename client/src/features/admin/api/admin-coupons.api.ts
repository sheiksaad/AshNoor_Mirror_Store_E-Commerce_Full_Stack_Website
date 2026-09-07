import { api } from "@/lib/axios";

export interface Coupon {
    id: string;
    code: string;
    discountPercent: number;
    maxUses: number;
    usedCount: number;
    expiresAt: string;
    isActive: boolean;
}

export interface CouponFormInput {
    code: string;
    discountPercent: number;
    maxUses: number;
    expiresAt: string;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchCoupons(): Promise<Coupon[]> {
    const { data } = await api.get<ApiEnvelope<Coupon[]>>("/coupons");
    return data.data;
}

export async function createCoupon(input: CouponFormInput): Promise<Coupon> {
    const { data } = await api.post<ApiEnvelope<Coupon>>("/coupons", input);
    return data.data;
}

export async function deactivateCoupon(id: string): Promise<void> {
    await api.patch(`/coupons/${id}/deactivate`);
}