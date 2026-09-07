import { api } from "@/lib/axios";
import type { Product } from "@/features/product/api/product.api";

export interface WishlistItem {
    id: string;
    product: Product;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchWishlist(): Promise<WishlistItem[]> {
    const { data } = await api.get<ApiEnvelope<WishlistItem[]>>("/wishlist");
    return data.data;
}

export async function toggleWishlist(productId: string): Promise<{ added: boolean }> {
    const { data } = await api.post<ApiEnvelope<{ added: boolean }>>("/wishlist/toggle", { productId });
    return data.data;
}