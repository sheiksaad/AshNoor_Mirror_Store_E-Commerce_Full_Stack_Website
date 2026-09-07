import { z } from "zod";

export const createOrderSchema = z.object({
    addressId: z.string().min(1),
    couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;