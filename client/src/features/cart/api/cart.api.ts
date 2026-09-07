import { api } from "@/lib/axios";
import type { Product } from "@/features/product/api/product.api";

export interface CartItem {
    id: string;
    quantity: number;
    product: Product;
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchCart(): Promise<Cart> {
    const { data } = await api.get<ApiEnvelope<Cart>>("/cart");
    return data.data;
}

export async function addToCart(productId: string, quantity = 1): Promise<void> {
    await api.post("/cart", { productId, quantity });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<void> {
    await api.patch(`/cart/${itemId}`, { quantity });
}

export async function removeCartItem(itemId: string): Promise<void> {
    await api.delete(`/cart/${itemId}`);
}