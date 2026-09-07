import { api } from "@/lib/axios";

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string };
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
    const { data } = await api.get<ApiEnvelope<Review[]>>(`/reviews/product/${productId}`);
    return data.data;
}

export async function submitReview(productId: string, rating: number, comment?: string): Promise<void> {
    await api.post("/reviews", { productId, rating, comment });
}