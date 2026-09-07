import { z } from "zod";

export const createCouponSchema = z.object({
    code: z.string().min(3).toUpperCase(),
    discountPercent: z.coerce.number().int().min(1).max(90),
    maxUses: z.coerce.number().int().positive(),
    expiresAt: z.coerce.date(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;