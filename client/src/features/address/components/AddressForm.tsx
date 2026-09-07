import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AddressInput } from "../api/address.api";
import type { JSX } from "react/jsx-runtime";

const addressSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Enter a valid phone number"),
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    province: z.string().min(2, "Province is required"),
    postalCode: z.string().optional().transform((val) => val ?? null),
    isDefault: z.boolean(),
});

type AddressFormValues = z.input<typeof addressSchema>;

interface Props {
    onSubmit: (values: AddressInput) => void;
    isSubmitting: boolean;
}

export function AddressForm({ onSubmit, isSubmitting }: Props): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<AddressFormValues, any, AddressInput>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            street: "",
            city: "",
            province: "",
            postalCode: "",
            isDefault: false,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm max-w-xl border border-outline-variant/30 p-6">
            <div className="md:col-span-2">
                <input {...register("fullName")} placeholder="Full name" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                {errors.fullName && <p className="text-sm text-error">{errors.fullName.message}</p>}
            </div>
            <div className="md:col-span-2">
                <input {...register("phone")} placeholder="Phone (03XXXXXXXXX)" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                {errors.phone && <p className="text-sm text-error">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
                <input {...register("street")} placeholder="Street address" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                {errors.street && <p className="text-sm text-error">{errors.street.message}</p>}
            </div>
            <input {...register("city")} placeholder="City" className="border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
            <input {...register("province")} placeholder="Province" className="border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
            <div className="md:col-span-2">
                <input {...register("postalCode")} placeholder="Postal code (optional)" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
            </div>
            <label className="md:col-span-2 flex items-center gap-2 font-caption text-caption text-on-surface-variant">
                <input type="checkbox" {...register("isDefault")} /> Set as default address
            </label>
            <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-primary text-on-primary py-3 font-label-md text-label-md disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save Address"}
            </button>
        </form>
    );
}