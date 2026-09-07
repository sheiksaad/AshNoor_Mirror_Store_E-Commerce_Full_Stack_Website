import slugify from "slugify";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.validation.js";

export function listCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(input: CreateCategoryInput) {
    const slug = slugify(input.name, { lower: true, strict: true });

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ApiError(409, "A category with this name already exists");

    return prisma.category.create({ data: { name: input.name, slug } });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new ApiError(404, "Category not found");

    const data: { name?: string; slug?: string } = {};
    if (input.name) {
        data.name = input.name;
        data.slug = slugify(input.name, { lower: true, strict: true });
    }

    return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string): Promise<void> {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
        throw new ApiError(409, "Cannot delete a category that has products assigned to it");
    }

    await prisma.category.delete({ where: { id } });
}