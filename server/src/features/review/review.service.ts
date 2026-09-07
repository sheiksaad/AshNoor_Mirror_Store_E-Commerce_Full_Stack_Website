import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateReviewInput } from "./review.validation.js";

export async function createReview(userId: string, input: CreateReviewInput) {
    // Only customers who actually bought the product can review it
    const purchased = await prisma.orderItem.findFirst({
        where: { productId: input.productId, order: { userId, status: "DELIVERED" } },
    });
    if (!purchased) {
        throw new ApiError(403, "You can only review products you have purchased and received");
    }

    const existing = await prisma.review.findUnique({
        where: { userId_productId: { userId, productId: input.productId } },
    });
    if (existing) throw new ApiError(409, "You have already reviewed this product");

    return prisma.review.create({
        data: { userId, productId: input.productId, rating: input.rating, comment: input.comment },
        include: { user: { select: { name: true } } },
    });
}

export function listProductReviews(productId: string) {
    return prisma.review.findMany({
        where: { productId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    });
}