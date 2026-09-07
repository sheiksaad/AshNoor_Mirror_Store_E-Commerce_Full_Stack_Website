import { api } from "@/lib/axios";
import type { Order } from "@/features/order/api/order.api";

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchAllOrders(): Promise<Order[]> {
    const { data } = await api.get<ApiEnvelope<Order[]>>("/orders/admin/all");
    return data.data;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
    await api.patch(`/orders/admin/${orderId}/status`, { status });
}