import type { Request, Response } from "express";
import { createReviewSchema } from "./review.validation.js";
import * as reviewService from "./review.service.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

export async function postReview(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const input = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.user.userId, input);
    sendResponse(res, 201, "Review submitted", review);
}

export async function getProductReviews(req: Request, res: Response): Promise<void> {
    const reviews = await reviewService.listProductReviews(req.params.productId as string);
    sendResponse(res, 200, "Reviews fetched", reviews);
}