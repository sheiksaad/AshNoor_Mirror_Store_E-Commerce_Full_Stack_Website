import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateCouponInput } from "./coupon.validation.js";

export async function createCoupon(input: CreateCouponInput) {
    const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
    if (existing) throw new ApiError(409, "A coupon with this code already exists");

    return prisma.coupon.create({ data: input });
}

export function listCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function deactivateCoupon(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new ApiError(404, "Coupon not found");
    return prisma.coupon.update({ where: { id }, data: { isActive: false } });
}