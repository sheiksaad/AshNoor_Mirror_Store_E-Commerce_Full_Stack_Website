import type { Request, Response } from "express";
import { addToCartSchema, updateCartItemSchema } from "./cart.validation.js";
import * as cartService from "./cart.service.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

function requireUserId(req: Request): string {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    return req.user.userId;
}

export async function getMyCart(req: Request, res: Response): Promise<void> {
    const cart = await cartService.getCart(requireUserId(req));
    sendResponse(res, 200, "Cart fetched", cart);
}

export async function postCartItem(req: Request, res: Response): Promise<void> {
    const input = addToCartSchema.parse(req.body);
    const item = await cartService.addToCart(requireUserId(req), input);
    sendResponse(res, 201, "Item added to cart", item);
}

export async function patchCartItem(req: Request, res: Response): Promise<void> {
    const input = updateCartItemSchema.parse(req.body);
    const item = await cartService.updateCartItem(requireUserId(req), req.params.itemId as string, input);
    sendResponse(res, 200, "Cart item updated", item);
}

export async function deleteCartItem(req: Request, res: Response): Promise<void> {
    await cartService.removeCartItem(requireUserId(req), req.params.itemId as string);
    sendResponse(res, 200, "Item removed from cart", null);
}

export async function deleteCart(req: Request, res: Response): Promise<void> {
    await cartService.clearCart(requireUserId(req));
    sendResponse(res, 200, "Cart cleared", null);
}