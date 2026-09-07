import type { Request, Response } from "express";
import { createCategorySchema, updateCategorySchema } from "./category.validation.js";
import * as categoryService from "./category.service.js";
import { sendResponse } from "../../utils/apiResponse.js";

export async function getCategories(_req: Request, res: Response): Promise<void> {
    const categories = await categoryService.listCategories();
    sendResponse(res, 200, "Categories fetched", categories);
}

export async function postCategory(req: Request, res: Response): Promise<void> {
    const input = createCategorySchema.parse(req.body);
    const category = await categoryService.createCategory(input);
    sendResponse(res, 201, "Category created", category);
}

export async function patchCategory(req: Request, res: Response): Promise<void> {
    const input = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(req.params.id as string, input);
    sendResponse(res, 200, "Category updated", category);
}

export async function removeCategory(req: Request, res: Response): Promise<void> {
    await categoryService.deleteCategory(req.params.id as string);
    sendResponse(res, 200, "Category deleted", null);
}