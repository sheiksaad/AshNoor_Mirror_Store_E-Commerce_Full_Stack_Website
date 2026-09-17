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
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-20 animate-fade-in">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <span className="font-caption text-xs uppercase tracking-[0.2em] text-champagne-700 mb-2 block">Exquisite Selection</span>
                <h1 className="font-headline-lg text-4xl text-primary font-bold">Curated Mirrors</h1>
                <p className="font-body-md text-on-surface-variant mt-3 text-base">Explore our handcrafted masterpieces designed for refined interiors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <aside className="hidden md:block col-span-3 pr-6 border-r border-champagne-300/30">
                    <div className="pb-8 mb-8 border-b border-champagne-300/30">
                        <h3 className="font-label-md text-sm text-primary uppercase mb-4 tracking-widest font-bold">Categories</h3>
                        <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                            <li>
                                <button onClick={() => setFilters((f) => ({ ...f, category: undefined, page: 1 }))} className={`transition-colors text-left w-full py-1 ${!filters.category ? "text-champagne-700 font-bold" : "hover:text-primary"}`}>
                                    All Categories
                                </button>
                            </li>
                            {categories?.map((cat) => (
                                <li key={cat.id}>
                                    <button onClick={() => setFilters((f) => ({ ...f, category: cat.slug, page: 1 }))} className={`transition-colors text-left w-full py-1 ${filters.category === cat.slug ? "text-champagne-700 font-bold" : "hover:text-primary"}`}>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-label-md text-sm text-primary uppercase mb-4 tracking-widest font-bold">Sort By</h3>
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split("-") as [ProductListParams["sortBy"], ProductListParams["sortOrder"]];
                                setFilters((f) => ({ ...f, sortBy, sortOrder, page: 1 }));
                            }}
                            className="w-full bg-white border border-champagne-300/50 rounded-xl p-3 font-body-md text-sm focus:outline-none focus:border-champagne-500 shadow-sm"
                        >
                            <option value="createdAt-desc">Newest Arrivals</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </aside>

                <div className="col-span-1 md:col-span-9">
                    {isLoading && (
                        <div className="p-16 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne-500" />
                        </div>
                    )}
                    {data && data.items.length === 0 && (
                        <div className="flex flex-col items-center text-center py-20 bg-white rounded-2xl border border-champagne-300/40">
                            <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mb-6 text-champagne-700">
                                <Icon name="search_off" className="text-3xl" />
                            </div>
                            <h2 className="font-headline-md text-2xl text-primary mb-2">No Designs Found</h2>
                            <p className="font-body-md text-on-surface-variant">Try adjusting your filters or search criteria.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.items.map((product) => {
                            const hasDiscount = product.discountPrice !== null;
                            const discountPercent = hasDiscount ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100) : 0;
                            return (
                                <div
                                    key={product.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-champagne-300/40 bg-white shadow-premium hover:shadow-luxury-glow transition-all duration-500 hover:-translate-y-1.5"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!user) { toast.error("Please login to use wishlist"); return; }
                                            wishlistMutation.mutate(product.id);
                                        }}
                                        aria-label="Add to wishlist"
                                        className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:text-champagne-700"
                                    >
                                        <Icon name="favorite" className="text-[18px]" />
                                    </button>

                                    {hasDiscount && (
                                        <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-gold text-charcoal-900 px-3 py-1 font-label-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                            -{discountPercent}% OFF
                                        </span>
                                    )}

                                    {product.stock === 0 && (
                                        <span className="absolute left-3 bottom-3 z-10 rounded-lg bg-charcoal-900 text-white px-3 py-1 font-caption text-[10px] uppercase tracking-widest backdrop-blur-md">
                                            Out of Stock
                                        </span>
                                    )}

                                    <Link to={`/product/${product.slug}`} className="flex flex-col flex-1">
                                        <div className="aspect-square overflow-hidden relative bg-surface-container-high">
                                            <img
                                                src={product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url}
                                                alt={product.name}
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                                            <div>
                                                <p className="font-caption text-[11px] text-champagne-700 uppercase tracking-[0.15em] font-semibold mb-1">{product.category.name}</p>
                                                <h3 className="font-headline-md text-lg text-primary group-hover:text-champagne-700 transition-colors line-clamp-1">{product.name}</h3>
                                            </div>
                                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-champagne-300/30">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-label-md text-base text-primary font-bold">Rs. {hasDiscount ? product.discountPrice : product.price}</span>
                                                    {hasDiscount && <span className="font-caption text-xs text-on-surface-variant/50 line-through">Rs. {product.price}</span>}
                                                </div>
                                                <span className="flex items-center gap-1 font-label-md text-xs text-champagne-700 group-hover:translate-x-1 transition-all uppercase tracking-wider font-semibold">
                                                    View <Icon name="arrow_forward" className="text-[14px]" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {data && data.pagination.totalPages > 1 && (
                        <div className="mt-16 flex justify-center border-t border-champagne-300/30 pt-8">
                            <nav className="flex items-center gap-3 font-label-md">
                                <button
                                    onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
                                    disabled={data.pagination.page <= 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-champagne-300 text-primary hover:bg-champagne-100 disabled:opacity-30 transition-colors"
                                >
                                    <Icon name="chevron_left" />
                                </button>
                                <span className="px-4 py-2 text-primary font-bold border-b-2 border-champagne-500">{data.pagination.page}</span>
                                <button
                                    onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                                    disabled={data.pagination.page >= data.pagination.totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-champagne-300 text-primary hover:bg-champagne-100 disabled:opacity-30 transition-colors"
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
