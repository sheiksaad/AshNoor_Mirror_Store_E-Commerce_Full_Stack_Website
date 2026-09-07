import slugify from "slugify";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import type { CreateProductInput, UpdateProductInput, ListProductsQuery } from "./product.validation.js";

export async function listProducts(query: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (query.category) where.category = { slug: query.category };
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.minPrice || query.maxPrice) {
        where.price = {};
        if (query.minPrice) where.price.gte = query.minPrice;
        if (query.maxPrice) where.price.lte = query.maxPrice;
    }

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { images: true, category: true },
            orderBy: { [query.sortBy]: query.sortOrder },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        }),
        prisma.product.count({ where }),
    ]);

    return {
        items,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        },
    };
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: true,
            category: true,
            reviews: { include: { user: { select: { name: true } } } },
        },
    });
    if (!product || !product.isActive) throw new ApiError(404, "Product not found");

    const avgRating =
        product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 0;

    return { ...product, avgRating: Math.round(avgRating * 10) / 10, reviewCount: product.reviews.length };
}

export async function createProduct(input: CreateProductInput, files: Express.Multer.File[]) {
    const slug = slugify(input.name, { lower: true, strict: true });

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) throw new ApiError(409, "A product with this name already exists");

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new ApiError(400, "Invalid category");

    const uploads = await Promise.all(
        files.map((file) => uploadBufferToCloudinary(file.buffer, "mirror-store/products")),
    );

    return prisma.product.create({
        data: {
            name: input.name,
            slug,
            description: input.description,
            price: input.price,
            discountPrice: input.discountPrice,
            stock: input.stock,
            categoryId: input.categoryId,
            images: {
                create: uploads.map((u, i) => ({ url: u.url, publicId: u.publicId, isPrimary: i === 0 })),
            },
        },
        include: { images: true },
    });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ApiError(404, "Product not found");

    const data: Prisma.ProductUpdateInput = { ...input };
    if (input.name) data.slug = slugify(input.name, { lower: true, strict: true });

    return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string): Promise<void> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ApiError(404, "Product not found");

    // Soft delete — never hard-delete a product that might be referenced by past orders
    await prisma.product.update({ where: { id }, data: { isActive: false } });
}