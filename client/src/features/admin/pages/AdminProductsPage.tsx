import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllProductsForAdmin, createProduct, deleteProduct } from "../api/admin-products.api";
import { ProductFormModal } from "../components/ProductFormModal";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"

export function AdminProductsPage(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: fetchAllProductsForAdmin });

    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            setShowModal(false);
            toast.success("Product created successfully");
        },
        onError: () => toast.error("Could not create product"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            toast.success("Product removed");
        },
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="font-headline-lg text-3xl text-primary font-bold">Products Management</h2>
                    <p className="text-on-surface-variant font-body-md text-sm mt-1">Manage inventory, prices, and stock of artisanal mirrors.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="bg-gradient-gold text-charcoal-900 font-label-md text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-luxury-glow transition-all flex items-center gap-2 uppercase tracking-wider font-bold"
                >
                    <Icon name="add" className="text-lg" /> Add Product
                </button>
            </header>

            <div className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium overflow-hidden">
                {isLoading && (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
                    </div>
                )}
                {products && products.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-champagne-300/30 bg-surface-container-low/50">
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Product</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Category</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Price</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Stock</th>
                                    <th className="py-4 px-6 text-right font-caption text-xs text-on-surface-variant uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-champagne-300/20">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-champagne-100/40 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <img src={product.images[0]?.url} alt="" className="w-12 h-16 object-cover rounded-lg shadow-sm border border-champagne-300/50" />
                                                <p className="font-label-md text-sm text-primary font-semibold">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{product.category.name}</td>
                                        <td className="py-4 px-6 font-label-md text-sm text-primary font-bold">Rs. {product.price.toLocaleString()}</td>
                                        <td className="py-4 px-6 font-body-md text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => deleteMutation.mutate(product.id)} 
                                                    className="p-2.5 text-gray-400 hover:text-error rounded-full hover:bg-error/15 transition-colors" 
                                                    title="Delete Product"
                                                >
                                                    <Icon name="delete" className="text-xl" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <ProductFormModal onSubmit={(v) => createMutation.mutate(v)} onClose={() => setShowModal(false)} isSubmitting={createMutation.isPending} />
            )}
        </div>
    );
}
