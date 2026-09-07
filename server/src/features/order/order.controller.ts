import type { Request, Response } from "express";
import { createOrderSchema } from "./order.validation.js";
import * as orderService from "./order.service.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { updateOrderStatusSchema } from "./order.validation.js";

function requireUserId(req: Request): string {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    return req.user.userId;
}

export async function postOrder(req: Request, res: Response): Promise<void> {
    const input = createOrderSchema.parse(req.body);
    const result = await orderService.createOrder(requireUserId(req), input);
    sendResponse(res, 201, "Order created, advance payment initiated", result);
}

export async function postConfirmPayment(req: Request, res: Response): Promise<void> {
    const { transactionId } = req.body as { transactionId: string };
    const order = await orderService.confirmPayment(req.params.orderId as string, transactionId);
    sendResponse(res, 200, "Payment confirmed, order is now confirmed", order);
}

export async function getMyOrders(req: Request, res: Response): Promise<void> {
    const orders = await orderService.listUserOrders(requireUserId(req));
    sendResponse(res, 200, "Orders fetched", orders);
}

export async function getAllOrders(_req: Request, res: Response): Promise<void> {
    const orders = await orderService.listAllOrders();
    sendResponse(res, 200, "All orders fetched", orders);
}

export async function patchOrderStatus(req: Request, res: Response): Promise<void> {
    const input = updateOrderStatusSchema.parse(req.body);
    const order = await orderService.updateOrderStatus(req.params.orderId as string, input.status);
    sendResponse(res, 200, "Order status updated", order);
}