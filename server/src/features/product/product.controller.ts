import type { Request, Response } from "express";
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from "./product.validation.js";
import * as productService from "./product.service.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

export async function getProducts(req: Request, res: Response): Promise<void> {
    const query = listProductsQuerySchema.parse(req.query);
    const result = await productService.listProducts(query);
    sendResponse(res, 200, "Products fetched", result);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
    const product = await productService.getProductBySlug(req.params.slug as string);
    sendResponse(res, 200, "Product fetched", product);
}

export async function postProduct(req: Request, res: Response): Promise<void> {
    const input = createProductSchema.parse(req.body);
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length === 0) throw new ApiError(400, "At least one product image is required");

    const product = await productService.createProduct(input, files);
    sendResponse(res, 201, "Product created", product);
}

export async function patchProduct(req: Request, res: Response): Promise<void> {
    const input = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id as string, input);
    sendResponse(res, 200, "Product updated", product);
}

export async function removeProduct(req: Request, res: Response): Promise<void> {
    await productService.deleteProduct(req.params.id as string);
    sendResponse(res, 200, "Product deleted", null);
}