
import type { JSX } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { fetchProductReviews } from "../api/review.api";
import { Icon } from "@/components/Icon";

export function ReviewList({ productId }: { productId: string }): JSX.Element {
    const { data: reviews, isLoading } = useQuery({ queryKey: ["reviews", productId], queryFn: () => fetchProductReviews(productId) });

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading reviews...</p>;
    if (!reviews || reviews.length === 0) return <p className="font-body-md text-on-surface-variant">No reviews yet.</p>;

    return (
        <div className="space-y-stack-sm">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-outline-variant/30 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="font-label-md text-label-md text-primary">{review.user.name}</span>
                        <div className="flex text-secondary-fixed">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Icon key={i} name="star" filled={i < review.rating} className="text-[14px]" />
                            ))}
                        </div>
                    </div>
                    {review.comment && <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{review.comment}</p>}
                </div>
            ))}
        </div>
    );
}