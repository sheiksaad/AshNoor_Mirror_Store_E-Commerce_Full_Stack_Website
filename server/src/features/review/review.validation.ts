import { z } from "zod";

export const createReviewSchema = z.object({
    productId: z.string().min(1),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;