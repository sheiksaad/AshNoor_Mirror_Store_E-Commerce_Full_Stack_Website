import type { Request, Response } from "express";
import { createCouponSchema } from "./coupon.validation.js";
import * as couponService from "./coupon.service.js";
import { sendResponse } from "../../utils/apiResponse.js";

export async function postCoupon(req: Request, res: Response): Promise<void> {
    const input = createCouponSchema.parse(req.body);
    const coupon = await couponService.createCoupon(input);
    sendResponse(res, 201, "Coupon created", coupon);
}

export async function getCoupons(_req: Request, res: Response): Promise<void> {
    const coupons = await couponService.listCoupons();
    sendResponse(res, 200, "Coupons fetched", coupons);
}

export async function patchDeactivateCoupon(req: Request, res: Response): Promise<void> {
    const coupon = await couponService.deactivateCoupon(req.params.id as string);
    sendResponse(res, 200, "Coupon deactivated", coupon);
}