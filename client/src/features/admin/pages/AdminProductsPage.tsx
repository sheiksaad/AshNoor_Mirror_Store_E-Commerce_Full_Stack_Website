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
            toast.success("Product created");
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
        <div>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-lg gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Products</h2>
                    <p className="text-on-surface-variant font-body-md text-body-md mt-2">Manage your mirror inventory.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md px-6 py-2 rounded shadow-[0_10px_30px_rgba(255,224,136,0.2)] hover:bg-secondary-fixed-dim transition-colors flex items-center gap-2">
                    <Icon name="add" className="text-sm" /> Add Product
                </button>
            </header>

            <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl border border-outline-variant/20 overflow-hidden">
                {isLoading && <p className="p-6 font-body-md text-on-surface-variant">Loading...</p>}
                {products && products.length > 0 && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant/20 bg-surface/50">
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Product</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Price</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Stock</th>
                                <th className="py-4 px-6 text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <img src={product.images[0]?.url} alt="" className="w-12 h-16 object-cover rounded shadow-sm" />
                                            <p className="font-label-md text-label-md text-on-surface">{product.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{product.category.name}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface">Rs. {product.price}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md">{product.stock}</td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => deleteMutation.mutate(product.id)} className="p-2 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container/50" title="Delete">
                                                <Icon name="delete" className="text-[20px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <ProductFormModal onSubmit={(v) => createMutation.mutate(v)} onClose={() => setShowModal(false)} isSubmitting={createMutation.isPending} />
            )}
        </div>
    );
}