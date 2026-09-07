import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.coerce.number().positive(),
    discountPrice: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().nonnegative(),
    categoryId: z.string().min(1),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    sortBy: z.enum(["price", "createdAt", "name"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;