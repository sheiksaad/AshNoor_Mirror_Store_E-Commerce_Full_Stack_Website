import type { JSX } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/features/product/api/product.api";
import type { Product } from "@/features/product/api/product.api";
import type { ProductFormInput } from "../api/admin-products.api";

interface Props {
    initialData?: Product;
    onSubmit: (values: ProductFormInput) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

export function ProductFormModal({ initialData, onSubmit, onClose, isSubmitting }: Props): JSX.Element {
    const isEditMode = Boolean(initialData);
    const { register, handleSubmit } = useForm<ProductFormInput>({
        defaultValues: initialData
            ? { name: initialData.name, description: initialData.description, price: Number(initialData.price), stock: initialData.stock, categoryId: initialData.category.id }
            : undefined,
    });
    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                <h2 className="font-headline-md text-headline-md text-primary mb-stack-md">{isEditMode ? "Edit Product" : "New Product"}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input {...register("name", { required: true })} placeholder="Name" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                    <textarea {...register("description", { required: true })} placeholder="Description" className="w-full border border-outline-variant/50 p-2 font-body-md text-body-md focus:outline-none focus:border-secondary" />
                    <div className="flex gap-2">
                        <input {...register("price", { required: true, valueAsNumber: true })} type="number" placeholder="Price" className="w-1/2 border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                        <input {...register("stock", { required: true, valueAsNumber: true })} type="number" placeholder="Stock" className="w-1/2 border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                    </div>
                    <select {...register("categoryId", { required: true })} className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed">
                        <option value="">Select category</option>
                        {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    {!isEditMode && <input {...register("images", { required: true })} type="file" multiple accept="image/*" className="w-full font-body-md text-sm" />}
                    {isEditMode && <p className="font-caption text-caption text-on-surface-variant">Image editing isn't supported yet — only details will be updated.</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="border border-outline-variant px-4 py-2 font-label-md text-label-md">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-on-primary px-4 py-2 font-label-md text-label-md disabled:opacity-50">
                            {isSubmitting ? "Saving..." : isEditMode ? "Update Product" : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}