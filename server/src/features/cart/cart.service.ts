import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import type { AddToCartInput, UpdateCartItemInput } from "./cart.validation.js";

const CART_INCLUDE = {
    product: { include: { images: true } },
} as const;

export async function getCart(userId: string) {
    const items = await prisma.cartItem.findMany({
        where: { userId },
        include: CART_INCLUDE,
        orderBy: { createdAt: "desc" },
    });

    const total = items.reduce((sum: number, item: typeof items[number]) => {
        const price = item.product.discountPrice ?? item.product.price;
        return sum + Number(price) * item.quantity;
    }, 0);

    return { items, total, itemCount: items.reduce((n, i) => n + i.quantity, 0) };
}

export async function addToCart(userId: string, input: AddToCartInput) {
    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    if (!product || !product.isActive) throw new ApiError(404, "Product not found");

    const existing = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId: input.productId } },
    });

    const desiredQuantity = (existing?.quantity ?? 0) + input.quantity;
    if (desiredQuantity > product.stock) {
        throw new ApiError(409, `Only ${product.stock} unit(s) available in stock`);
    }

    return prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId: input.productId } },
        update: { quantity: desiredQuantity },
        create: { userId, productId: input.productId, quantity: input.quantity },
        include: CART_INCLUDE,
    });
}

export async function updateCartItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { product: true } });
    if (!item || item.userId !== userId) throw new ApiError(404, "Cart item not found");

    if (input.quantity > item.product.stock) {
        throw new ApiError(409, `Only ${item.product.stock} unit(s) available in stock`);
    }

    return prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: input.quantity },
        include: CART_INCLUDE,
    });
}

export async function removeCartItem(userId: string, itemId: string): Promise<void> {
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.userId !== userId) throw new ApiError(404, "Cart item not found");

    await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(userId: string): Promise<void> {
    await prisma.cartItem.deleteMany({ where: { userId } });
}