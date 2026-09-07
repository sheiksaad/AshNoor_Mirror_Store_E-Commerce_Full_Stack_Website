import { z } from "zod";

export const createAddressSchema = z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    street: z.string().min(5),
    city: z.string().min(2),
    province: z.string().min(2),
    postalCode: z.string().optional(),
    isDefault: z.boolean().default(false),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;