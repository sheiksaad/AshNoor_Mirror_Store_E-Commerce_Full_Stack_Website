import { api } from "@/lib/axios";

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    discountPrice: string | null;
    stock: number;
    images: ProductImage[];
    category: Category;
    avgRating?: number;
    reviewCount?: number;
}

export interface PaginatedProducts {
    items: Product[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ProductListParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "price" | "createdAt" | "name";
    sortOrder?: "asc" | "desc";
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchProducts(params: ProductListParams): Promise<PaginatedProducts> {
    const { data } = await api.get<ApiEnvelope<PaginatedProducts>>("/products", { params });
    return data.data;
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<ApiEnvelope<Product>>(`/products/${slug}`);
    return data.data;
}

export async function fetchCategories(): Promise<Category[]> {
    const { data } = await api.get<ApiEnvelope<Category[]>>("/categories");
    return data.data;
}