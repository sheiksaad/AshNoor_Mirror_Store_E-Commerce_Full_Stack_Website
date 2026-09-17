import type { JSX } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchCategories } from "@/features/product/api/product.api";
import { api } from "@/lib/axios";
import type { Product } from "@/features/product/api/product.api";
import type { ProductFormInput } from "../api/admin-products.api";
import { Icon } from "@/components/Icon";

interface Props {
    initialData?: Product;
    onSubmit: (values: ProductFormInput) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

export function ProductFormModal({ initialData, onSubmit, onClose, isSubmitting }: Props): JSX.Element {
    const isEditMode = Boolean(initialData);
    const { register, handleSubmit, setValue } = useForm<ProductFormInput>({
        defaultValues: initialData
            ? { name: initialData.name, description: initialData.description, price: Number(initialData.price), stock: initialData.stock, categoryId: initialData.category.id }
            : undefined,
    });
    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
    const queryClient = useQueryClient();

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    async function handleCreateCategory(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setIsCreatingCategory(true);
        try {
            const res = await api.post<{ data: { id: string; name: string } }>("/categories", { name: newCategoryName.trim() });
            await queryClient.invalidateQueries({ queryKey: ["categories"] });
            setValue("categoryId", res.data.data.id);
            setNewCategoryName("");
            setIsAddingCategory(false);
            toast.success("Category created and selected!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create category");
        } finally {
            setIsCreatingCategory(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl border border-champagne-300/40 my-8">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-champagne-300/30">
                    <h2 className="font-headline-md text-xl text-primary font-bold">{isEditMode ? "Edit Product" : "New Product"}</h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-primary p-1 rounded-full"><Icon name="close" className="text-xl" /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-1">Product Name</label>
                        <input {...register("name", { required: true })} placeholder="e.g. Royal Arch Wall Mirror" className="w-full border border-champagne-300/70 rounded-xl bg-champagne-100/20 px-3 py-2 font-body-md text-sm focus:outline-none focus:border-secondary" />
                    </div>

                    <div>
                        <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-1">Description</label>
                        <textarea {...register("description", { required: true })} rows={3} placeholder="Describe the mirror material and design..." className="w-full border border-champagne-300/70 rounded-xl bg-champagne-100/20 px-3 py-2 font-body-md text-sm focus:outline-none focus:border-secondary" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-1">Price (PKR)</label>
                            <input {...register("price", { required: true, valueAsNumber: true })} type="number" placeholder="15000" className="w-full border border-champagne-300/70 rounded-xl bg-champagne-100/20 px-3 py-2 font-body-md text-sm focus:outline-none focus:border-secondary" />
                        </div>
                        <div>
                            <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-1">Stock Quantity</label>
                            <input {...register("stock", { required: true, valueAsNumber: true })} type="number" placeholder="10" className="w-full border border-champagne-300/70 rounded-xl bg-champagne-100/20 px-3 py-2 font-body-md text-sm focus:outline-none focus:border-secondary" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold">Category</label>
                            <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)} className="text-champagne-700 hover:text-primary font-label-md text-xs font-semibold flex items-center gap-1">
                                <Icon name={isAddingCategory ? "remove" : "add"} className="text-sm" /> {isAddingCategory ? "Cancel" : "Add New Category"}
                            </button>
                        </div>

                        {isAddingCategory ? (
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="text"
                                    placeholder="New Category Name (e.g. Full Length)"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="flex-1 border border-champagne-300 rounded-xl px-3 py-2 text-sm bg-champagne-100/30 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    disabled={isCreatingCategory || !newCategoryName.trim()}
                                    className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-semibold uppercase disabled:opacity-50"
                                >
                                    {isCreatingCategory ? "Adding..." : "Save"}
                                </button>
                            </div>
                        ) : (
                            <select {...register("categoryId", { required: true })} className="w-full border border-champagne-300/70 rounded-xl bg-champagne-100/20 px-3 py-2 font-body-md text-sm focus:outline-none focus:border-secondary">
                                <option value="">Select category</option>
                                {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        )}
                    </div>

                    {!isEditMode && (
                        <div>
                            <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-1">Product Images</label>
                            <input {...register("images", { required: true })} type="file" multiple accept="image/*" className="w-full text-xs font-body-md text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-champagne-100 file:text-primary hover:file:bg-champagne-200" />
                        </div>
                    )}
                    {isEditMode && <p className="font-caption text-xs text-on-surface-variant italic">Image editing isn't supported yet — only details will be updated.</p>}

                    <div className="flex justify-end gap-3 pt-4 border-t border-champagne-300/30">
                        <button type="button" onClick={onClose} className="border border-outline-variant px-5 py-2.5 rounded-xl font-label-md text-xs uppercase tracking-wider">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-gradient-gold text-charcoal-900 px-6 py-2.5 rounded-xl font-label-md text-xs uppercase tracking-wider font-bold shadow-md disabled:opacity-50">
                            {isSubmitting ? "Saving..." : isEditMode ? "Update Product" : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
