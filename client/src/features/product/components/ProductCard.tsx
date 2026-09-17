import { memo } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import { toggleWishlist } from "@/features/wishlist/api/wishlist.api";
import type { Product } from "../api/product.api";
import type { JSX } from "react/jsx-runtime";

export const ProductCard = memo(function ProductCard({ product }: { product: Product }): JSX.Element {
    const queryClient = useQueryClient();
    const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
    const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)
        : 0;

    const wishlistMutation = useMutation({
        mutationFn: () => toggleWishlist(product.id),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
        },
        onError: () => {
            toast.error("Please login to use wishlist");
        },
    });

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-champagne-300/40 bg-surface-container-lowest shadow-premium hover:shadow-luxury-glow transition-all duration-500 hover:-translate-y-1.5">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    wishlistMutation.mutate();
                }}
                disabled={wishlistMutation.isPending}
                aria-label="Toggle wishlist"
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:text-champagne-700 active:scale-95 disabled:opacity-50"
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
                <div className="aspect-square overflow-hidden bg-surface-container-high relative flex items-center justify-center p-2">
                    {primaryImage ? (
                        <img
                            src={primaryImage.url}
                            alt={product.name}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-on-surface-variant font-caption text-caption">
                            No Image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
                    <div>
                        <p className="mb-1 font-caption text-[11px] uppercase tracking-[0.15em] text-champagne-700 font-semibold">
                            {product.category?.name ?? "Mirror"}
                        </p>
                        <h3 className="font-headline-md text-[18px] leading-snug text-primary group-hover:text-champagne-700 transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-champagne-300/30">
                        <div className="flex items-baseline gap-2">
                            <span className="font-label-md text-label-md text-primary font-bold text-base">
                                Rs. {hasDiscount ? product.discountPrice : product.price}
                            </span>
                            {hasDiscount && (
                                <span className="font-caption text-caption text-on-surface-variant/50 line-through text-xs">
                                    Rs. {product.price}
                                </span>
                            )}
                        </div>

                        <span className="flex items-center gap-1 font-label-md text-[11px] text-champagne-700 group-hover:translate-x-1 transition-all uppercase tracking-wider font-semibold">
                            View <Icon name="arrow_forward" className="text-[14px]" />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
});
