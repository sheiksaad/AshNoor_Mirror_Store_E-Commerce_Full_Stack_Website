import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchWishlist, toggleWishlist } from "../api/wishlist.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react/jsx-runtime";

export function WishlistPage(): JSX.Element {
    const queryClient = useQueryClient();
    const { data: items, isLoading } = useQuery({ queryKey: ["wishlist"], queryFn: fetchWishlist });

    const removeMutation = useMutation({
        mutationFn: (productId: string) => toggleWishlist(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success("Removed from wishlist");
        },
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
        </div>
    );

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center text-center py-20 bg-white rounded-3xl border border-champagne-300/40 shadow-premium">
                <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mb-6 text-champagne-700">
                    <Icon name="favorite_border" className="text-3xl" />
                </div>
                <h2 className="font-headline-md text-2xl text-primary mb-2 font-bold">Your wishlist is empty</h2>
                <p className="font-body-md text-on-surface-variant mb-6 text-sm">Save your favorite mirror designs to review later.</p>
                <Link to="/shop" className="bg-gradient-gold text-charcoal-900 px-8 py-3.5 rounded-xl font-label-md text-sm uppercase tracking-widest shadow-md hover:shadow-luxury-glow transition-all font-bold">
                    Explore Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {items.map((item) => {
                const hasDiscount = item.product.discountPrice !== null;
                return (
                    <div key={item.id} className="group relative bg-white rounded-2xl border border-champagne-300/40 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-luxury-glow">
                        <Link to={`/product/${item.product.slug}`} className="block">
                            <div className="aspect-square bg-surface-container-high overflow-hidden relative">
                                <img src={item.product.images[0]?.url} alt={item.product.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-5">
                                <p className="font-headline-md text-lg text-primary font-bold group-hover:text-champagne-700 transition-colors line-clamp-1 mb-2">{item.product.name}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-label-md text-base text-primary font-bold">Rs. {hasDiscount ? item.product.discountPrice?.toLocaleString() : item.product.price.toLocaleString()}</span>
                                    {hasDiscount && <span className="font-caption text-xs text-on-surface-variant/50 line-through">Rs. {item.product.price.toLocaleString()}</span>}
                                </div>
                            </div>
                        </Link>
                        <button
                            onClick={() => removeMutation.mutate(item.product.id)}
                            aria-label="Remove from wishlist"
                            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-error shadow-md backdrop-blur-md hover:scale-110 transition-transform"
                        >
                            <Icon name="favorite" filled className="text-xl" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
