import type { JSX } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import type { CouponFormInput } from "../api/admin-coupons.api";

interface Props {
    onSubmit: (values: CouponFormInput) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

export function CouponFormModal({ onSubmit, onClose, isSubmitting }: Props): JSX.Element {
    const { register, handleSubmit } = useForm<CouponFormInput>();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                <h2 className="font-headline-md text-headline-md text-primary mb-stack-md">New Coupon</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input {...register("code", { required: true })} placeholder="Code (e.g. SAVE20)" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md uppercase focus:outline-none focus:border-secondary-fixed" />
                    <div className="flex gap-2">
                        <input {...register("discountPercent", { required: true, valueAsNumber: true })} type="number" placeholder="Discount %" className="w-1/2 border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                        <input {...register("maxUses", { required: true, valueAsNumber: true })} type="number" placeholder="Max uses" className="w-1/2 border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                    </div>
                    <div>
                        <label className="block font-caption text-caption text-on-surface-variant mb-1">Expires On</label>
                        <input {...register("expiresAt", { required: true })} type="date" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="border border-outline-variant px-4 py-2 font-label-md text-label-md">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-on-primary px-4 py-2 font-label-md text-label-md disabled:opacity-50">
                            {isSubmitting ? "Saving..." : "Create Coupon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}