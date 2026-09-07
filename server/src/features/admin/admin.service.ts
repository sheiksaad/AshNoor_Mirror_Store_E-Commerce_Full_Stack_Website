import { prisma } from "../../config/prisma.js";

export async function getDashboardStats() {
    const [totalOrders, totalRevenue, totalProducts, totalCustomers, recentOrders] = await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID" } }),
        prisma.product.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true } } },
        }),
    ]);

    return {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount ?? 0,
        totalProducts,
        totalCustomers,
        recentOrders,
    };
}

export function listCustomers() {
    return prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAnalytics() {
    const [topProducts, lowStock] = await Promise.all([
        prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5,
        }),
        prisma.product.findMany({
            where: { isActive: true, stock: { lte: 5 } },
            select: { id: true, name: true, stock: true },
            orderBy: { stock: "asc" },
            take: 10,
        }),
    ]);

    const productIds = topProducts.map((p) => p.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
    });

    const topSelling = topProducts.map((tp) => ({
        productId: tp.productId,
        name: products.find((p) => p.id === tp.productId)?.name ?? "Unknown",
        unitsSold: tp._sum.quantity ?? 0,
    }));

    return { topSelling, lowStock };
}