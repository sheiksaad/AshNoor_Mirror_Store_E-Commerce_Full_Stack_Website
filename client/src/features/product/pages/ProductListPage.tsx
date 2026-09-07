import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchCategories, type ProductListParams } from "../api/product.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"
import { toggleWishlist } from "@/features/wishlist/api/wishlist.api";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";


const DEFAULT_FILTERS: ProductListParams = { page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc" };

export function ProductListPage(): JSX.Element {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<ProductListParams>({ ...DEFAULT_FILTERS, category: searchParams.get("category") ?? undefined });

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setFilters((f) => ({ ...f, category: cat, page: 1 }));
    }, [searchParams]);

    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
    const { data, isLoading } = useQuery({
        queryKey: ["products", filters],
        queryFn: () => fetchProducts(filters),
        placeholderData: keepPreviousData,
    });

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const wishlistMutation = useMutation({
        mutationFn: (productId: string) => toggleWishlist(productId),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
        },
        onError: () => toast.error("Please login to use wishlist"),
    });

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-stack-xl">
            <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">Curated Mirrors</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                <aside className="hidden md:block col-span-3 pr-8">
                    <div className="border-b border-surface-variant pb-6 mb-6">
                        <h3 className="font-label-md text-label-md text-primary uppercase mb-4">Category</h3>
                        <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                            <li>
                                <button onClick={() => setFilters((f) => ({ ...f, category: undefined, page: 1 }))} className={!filters.category ? "text-primary" : "hover:text-primary"}>
                                    All Categories
                                </button>
                            </li>
                            {categories?.map((cat) => (
                                <li key={cat.id}>
                                    <button onClick={() => setFilters((f) => ({ ...f, category: cat.slug, page: 1 }))} className={filters.category === cat.slug ? "text-primary" : "hover:text-primary"}>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-label-md text-label-md text-primary uppercase mb-4">Sort By</h3>
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split("-") as [ProductListParams["sortBy"], ProductListParams["sortOrder"]];
                                setFilters((f) => ({ ...f, sortBy, sortOrder, page: 1 }));
                            }}
                            className="w-full border-b border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary"
                        >
                            <option value="createdAt-desc">Newest Arrivals</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </aside>

                <div className="col-span-1 md:col-span-9">
                    {isLoading && <p className="font-body-md text-on-surface-variant">Loading...</p>}
                    {data && data.items.length === 0 && (
                        <div className="flex flex-col items-center text-center py-stack-xl">
                            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6">
                                <Icon name="search_off" className="text-[32px] text-on-surface-variant" />
                            </div>
                            <h2 className="font-headline-md text-headline-md text-primary mb-4">No Designs Found</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your filters.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-6">
                        {data?.items.map((product) => {
                            const hasDiscount = product.discountPrice !== null;
                            return (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.slug}`}
                                    className="group flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="aspect-square overflow-hidden relative bg-surface-variant">
                                        <img
                                            src={product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url}
                                            alt={product.name}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!user) { toast.error("Please login to use wishlist"); return; }
                                                wishlistMutation.mutate(product.id);
                                            }}
                                            aria-label="Add to wishlist"
                                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Icon name="favorite" className="text-[18px] text-primary" />
                                        </button>
                                        {product.stock === 0 && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-on-primary font-caption text-caption uppercase tracking-widest text-[9px]">
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest text-[10px] mb-1">{product.category.name}</p>
                                        <h3 className="font-body-lg text-body-lg text-primary mb-2">{product.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="font-label-md text-label-md text-primary">Rs. {hasDiscount ? product.discountPrice : product.price}</span>
                                            <Icon name="arrow_forward" className="text-[16px] text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {data && data.pagination.totalPages > 1 && (
                        <div className="mt-stack-xl flex justify-center border-t border-surface-variant pt-8">
                            <nav className="flex items-center gap-2 font-label-md text-label-md">
                                <button
                                    onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
                                    disabled={data.pagination.page <= 1}
                                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-30"
                                >
                                    <Icon name="chevron_left" />
                                </button>
                                <span className="w-10 h-10 flex items-center justify-center text-primary border-b border-primary">{data.pagination.page}</span>
                                <button
                                    onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                                    disabled={data.pagination.page >= data.pagination.totalPages}
                                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-30"
                                >
                                    <Icon name="chevron_right" />
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}