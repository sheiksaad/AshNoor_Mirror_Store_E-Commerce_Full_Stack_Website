import { useState, type JSX } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../api/review.api";
import { Icon } from "@/components/Icon";

export function ReviewForm({ productId }: { productId: string }): JSX.Element {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => submitReview(productId, rating, comment || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
            setComment("");
        },
    });

    return (
        <div className="mb-stack-md border border-outline-variant/30 p-6">
            <p className="mb-3 font-label-md text-label-md text-primary uppercase">Leave a Review</p>
            <div className="mb-3 flex gap-1 text-secondary-fixed">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setRating(n)}>
                        <Icon name="star" filled={n <= rating} className="text-[22px]" />
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)"
                className="mb-3 w-full border border-outline-variant/50 p-3 font-body-md text-body-md focus:outline-none focus:border-secondary"
            />
            {mutation.isError && <p className="mb-3 text-sm text-error">You can only review products you've purchased and received.</p>}
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-primary text-on-primary px-6 py-2 font-label-md text-label-md disabled:opacity-50">
                {mutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
        </div>
    );
}