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

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading...</p>;

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center text-center py-stack-xl">
                <Icon name="favorite_border" className="text-[40px] text-on-surface-variant mb-4" />
                <h2 className="font-headline-md text-headline-md text-primary mb-2">Your wishlist is empty</h2>
                <Link to="/shop" className="mt-4 bg-primary text-on-primary px-8 py-3 font-label-md text-label-md">Shop Mirrors</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
                <div key={item.id} className="group relative">
                    <Link to={`/product/${item.product.slug}`} className="block">
                        <div className="aspect-square bg-surface-variant overflow-hidden mb-3">
                            <img src={item.product.images[0]?.url} alt={item.product.name} className="object-cover w-full h-full" />
                        </div>
                        <p className="font-body-lg text-body-lg text-primary">{item.product.name}</p>
                        <p className="font-body-md text-body-md text-on-surface-variant">Rs. {item.product.discountPrice ?? item.product.price}</p>
                    </Link>
                    <button
                        onClick={() => removeMutation.mutate(item.product.id)}
                        aria-label="Remove from wishlist"
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90"
                    >
                        <Icon name="favorite" filled className="text-[16px] text-error" />
                    </button>
                </div>
            ))}
        </div>
    );
}