import type { Product } from "@/features/product/api/product.api";
import { api } from "@/lib/axios";

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: string | number;
    totalProducts: number;
    totalCustomers: number;
    recentOrders: { id: string; totalAmount: string; status: string; user: { name: string } }[];
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get<ApiEnvelope<DashboardStats>>("/admin/stats");
    return data.data;
}

export async function updateProduct(id: string, input: Partial<{ name: string; description: string; price: number; stock: number }>): Promise<Product> {
    const { data } = await api.patch<ApiEnvelope<Product>>(`/products/${id}`, input);
    return data.data;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
    _count: { orders: number };
}

export async function fetchCustomers(): Promise<Customer[]> {
    const { data } = await api.get<ApiEnvelope<Customer[]>>("/admin/customers");
    return data.data;
}

export interface Analytics {
    topSelling: { productId: string; name: string; unitsSold: number }[];
    lowStock: { id: string; name: string; stock: number }[];
}

export async function fetchAnalytics(): Promise<Analytics> {
    const { data } = await api.get<ApiEnvelope<Analytics>>("/admin/analytics");
    return data.data;
}