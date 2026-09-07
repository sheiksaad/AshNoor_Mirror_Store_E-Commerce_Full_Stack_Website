import { api } from "@/lib/axios";
import type { Product } from "@/features/product/api/product.api";

export interface ProductFormInput {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    categoryId: string;
    images?: FileList;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchAllProductsForAdmin(): Promise<Product[]> {
    const { data } = await api.get<ApiEnvelope<{ items: Product[] }>>("/products", {
        params: { limit: 50 },
    });
    return data.data.items;
}

export async function createProduct(input: ProductFormInput): Promise<Product> {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("price", String(input.price));
    if (input.discountPrice) formData.append("discountPrice", String(input.discountPrice));
    formData.append("stock", String(input.stock));
    formData.append("categoryId", input.categoryId);
    if (input.images) Array.from(input.images).forEach((file) => formData.append("images", file));

    const { data } = await api.post<ApiEnvelope<Product>>("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
}

export async function updateProduct(id: string, input: Omit<ProductFormInput, "images">): Promise<Product> {
    const { data } = await api.patch<ApiEnvelope<Product>>(`/products/${id}`, input);
    return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
}