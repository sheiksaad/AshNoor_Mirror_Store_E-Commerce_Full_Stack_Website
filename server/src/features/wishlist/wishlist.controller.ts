import type { Request, Response } from "express";
import * as wishlistService from "./wishlist.service.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

function requireUserId(req: Request): string {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    return req.user.userId;
}

export async function getWishlist(req: Request, res: Response): Promise<void> {
    const items = await wishlistService.listWishlist(requireUserId(req));
    sendResponse(res, 200, "Wishlist fetched", items);
}

export async function postToggleWishlist(req: Request, res: Response): Promise<void> {
    const { productId } = req.body as { productId: string };
    const result = await wishlistService.toggleWishlist(requireUserId(req), productId);
    sendResponse(res, 200, result.added ? "Added to wishlist" : "Removed from wishlist", result);
}