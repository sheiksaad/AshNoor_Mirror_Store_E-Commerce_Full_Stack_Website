import { api } from "@/lib/axios";

export interface Address {
    id: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string | null;
    isDefault: boolean;
}

export type AddressInput = Omit<Address, "id">;

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchAddresses(): Promise<Address[]> {
    const { data } = await api.get<ApiEnvelope<Address[]>>("/addresses");
    return data.data;
}

export async function createAddress(input: AddressInput): Promise<Address> {
    const { data } = await api.post<ApiEnvelope<Address>>("/addresses", input);
    return data.data;
}

export async function deleteAddress(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
}