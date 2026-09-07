import { memo } from "react";
import { Link } from "react-router";
import { Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../api/product.api";
import type { JSX } from "react/jsx-runtime";

export const ProductCard = memo(function ProductCard({ product }: { product: Product }): JSX.Element {
    const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
    const hasDiscount = product.discountPrice !== null;
    const discountPercent = hasDiscount
        ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)
        : 0;

    return (
        <div className="group relative overflow-hidden rounded-xl2 border border-charcoal-100 bg-gradient-card shadow-premium transition hover:shadow-premium-hover">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    toast("Wishlist coming soon");
                }}
                aria-label="Add to wishlist"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal-700 shadow-premium transition hover:text-red-500"
            >
                <Heart size={16} />
            </button>

            {hasDiscount && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-gold px-2.5 py-1 text-xs font-medium text-charcoal-900">
                    -{discountPercent}%
                </span>
            )}

            <Link to={`/product/${product.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-charcoal-50">
                    {primaryImage && (
                        <img
                            src={primaryImage.url}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                    )}
                </div>

                <div className="p-4">
                    <p className="mb-1 text-xs uppercase tracking-wide text-champagne-700">{product.category.name}</p>
                    <h3 className="truncate font-medium text-charcoal-900">{product.name}</h3>

                    <div className="mt-2 flex items-center gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="font-semibold text-charcoal-900">Rs. {product.discountPrice}</span>
                                <span className="text-sm text-charcoal-700/40 line-through">Rs. {product.price}</span>
                            </>
                        ) : (
                            <span className="font-semibold text-charcoal-900">Rs. {product.price}</span>
                        )}
                    </div>

                    {product.stock === 0 && (
                        <span className="mt-1 inline-block text-xs text-red-600">Out of stock</span>
                    )}
                </div>
            </Link>

            <div className="flex gap-2 px-4 pb-4">
                <Link
                    to={`/product/${product.slug}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-charcoal-100 py-2 text-xs font-medium text-charcoal-700 transition hover:border-charcoal-900"
                >
                    <Eye size={14} /> View Details
                </Link>
            </div>
        </div>
    );
});