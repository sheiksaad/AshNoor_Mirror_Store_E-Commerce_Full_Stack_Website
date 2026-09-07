import { api } from "@/lib/axios";
import type { Product } from "@/features/product/api/product.api";
import type { Address } from "@/features/address/api/address.api";

export interface OrderItem {
    id: string;
    quantity: number;
    price: string;
    product: Product;
}

export type OrderStatus = "PENDING" | "ADVANCE_PAID" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface Order {
    id: string;
    status: OrderStatus;
    totalAmount: string;
    advanceAmount: string;
    remainingAmount: string;
    createdAt: string;
    items: OrderItem[];
    address: Address;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchMyOrders(): Promise<Order[]> {
    const { data } = await api.get<ApiEnvelope<Order[]>>("/orders");
    return data.data;
}