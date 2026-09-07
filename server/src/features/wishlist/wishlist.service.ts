import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";

export function listWishlist(userId: string) {
    return prisma.wishlistItem.findMany({
        where: { userId },
        include: { product: { include: { images: true, category: true } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function toggleWishlist(userId: string, productId: string): Promise<{ added: boolean }> {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, "Product not found");

    const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });

    if (existing) {
        await prisma.wishlistItem.delete({ where: { id: existing.id } });
        return { added: false };
    }

    await prisma.wishlistItem.create({ data: { userId, productId } });
    return { added: true };
}