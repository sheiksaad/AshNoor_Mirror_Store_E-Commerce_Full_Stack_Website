import type { Request, Response } from "express";
import { createAddressSchema } from "./address.validation.js";
import * as addressService from "./address.service.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

function requireUserId(req: Request): string {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    return req.user.userId;
}

export async function getAddresses(req: Request, res: Response): Promise<void> {
    const addresses = await addressService.listAddresses(requireUserId(req));
    sendResponse(res, 200, "Addresses fetched", addresses);
}

export async function postAddress(req: Request, res: Response): Promise<void> {
    const input = createAddressSchema.parse(req.body);
    const address = await addressService.createAddress(requireUserId(req), input);
    sendResponse(res, 201, "Address created", address);
}

export async function removeAddress(req: Request, res: Response): Promise<void> {
    await addressService.deleteAddress(requireUserId(req), req.params.id as string);
    sendResponse(res, 200, "Address deleted", null);
}