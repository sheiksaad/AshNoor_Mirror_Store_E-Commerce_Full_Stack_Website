import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateAddressInput } from "./address.validation.js";

export function listAddresses(userId: string) {
    return prisma.address.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function createAddress(userId: string, input: CreateAddressInput) {
    if (input.isDefault) {
        await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return prisma.address.create({ data: { ...input, userId } });
}

export async function deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) throw new ApiError(404, "Address not found");

    await prisma.address.delete({ where: { id: addressId } });
}       