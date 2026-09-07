import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { activeGateway } from "../payment/payment.service.js";
import type { CreateOrderInput } from "./order.validation.js";
import type { OrderStatus } from "../../../generated/prisma/enums.js";

const ADVANCE_PAYMENT_PERCENT = 0.3; // 30% advance, 70% on delivery

export async function createOrder(userId: string, input: CreateOrderInput) {
    const address = await prisma.address.findUnique({ where: { id: input.addressId } });
    if (!address || address.userId !== userId) throw new ApiError(404, "Address not found");

    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });
    if (cartItems.length === 0) throw new ApiError(400, "Your cart is empty");

    // Re-verify stock at order time — cart may have gone stale since items were added
    for (const item of cartItems) {
        if (item.quantity > item.product.stock) {
            throw new ApiError(409, `${item.product.name} only has ${item.product.stock} unit(s) left`);
        }
    }

    let totalAmount = cartItems.reduce((sum, item) => {
        const price = Number(item.product.discountPrice ?? item.product.price);
        return sum + price * item.quantity;
    }, 0);

    let couponId: string | undefined;
    if (input.couponCode) {
        const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode } });
        if (!coupon || !coupon.isActive || coupon.expiresAt < new Date() || coupon.usedCount >= coupon.maxUses) {
            throw new ApiError(400, "Invalid or expired coupon");
        }
        totalAmount = totalAmount * (1 - coupon.discountPercent / 100);
        couponId = coupon.id;
    }

    const advanceAmount = Math.round(totalAmount * ADVANCE_PAYMENT_PERCENT * 100) / 100;
    const remainingAmount = Math.round((totalAmount - advanceAmount) * 100) / 100;

    // Order + stock decrement + cart clear must succeed or fail together —
    // a transaction prevents a paid order existing with wrong stock counts.
    const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                userId,
                addressId: input.addressId,
                totalAmount,
                advanceAmount,
                remainingAmount,
                couponId,
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.discountPrice ?? item.product.price,
                    })),
                },
            },
            include: { items: { include: { product: true } }, address: true },
        });

        for (const item of cartItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        if (couponId) {
            await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
        }

        await tx.cartItem.deleteMany({ where: { userId } });

        return created;
    });

    const payment = await activeGateway.initiatePayment({
        orderId: order.id,
        amount: advanceAmount,
        phone: address.phone,
    });

    return { order, payment };
}

export async function confirmPayment(orderId: string, transactionId: string) {
    const result = await activeGateway.verifyPayment(transactionId);

    if (result.status !== "SUCCESS") {
        throw new ApiError(402, "Payment verification failed");
    }

    return prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED", paymentStatus: "PAID" },
    });
}

export function listUserOrders(userId: string) {
    return prisma.order.findMany({
        where: { userId },
        include: {
            items: { include: { product: { include: { images: true } } } },
            address: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export function listAllOrders() {
    return prisma.order.findMany({
        include: {
            items: { include: { product: { include: { images: true } } } },
            address: true,
            user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["ADVANCE_PAID", "CANCELLED"],
    ADVANCE_PAID: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(404, "Order not found");

    if (!VALID_TRANSITIONS[order.status].includes(newStatus)) {
        throw new ApiError(400, `Cannot move order from ${order.status} to ${newStatus}`);
    }

    return prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
}