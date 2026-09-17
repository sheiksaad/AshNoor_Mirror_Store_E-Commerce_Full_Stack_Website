import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart, updateCartItem, removeCartItem } from "../api/cart.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"

export function CartPage(): JSX.Element {
    const queryClient = useQueryClient();
    const { data: cart, isLoading } = useQuery({ queryKey: ["cart"], queryFn: fetchCart });

    const updateMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => updateCartItem(itemId, quantity),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    });
    const removeMutation = useMutation({
        mutationFn: (itemId: string) => removeCartItem(itemId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    });

    if (isLoading) return (
        <div className="pt-40 flex justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne-500" />
        </div>
    );

    if (!cart || cart.items.length === 0) {
        return (
            <main className="max-w-container-max mx-auto px-margin-mobile pt-32 pb-20 flex flex-col items-center text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-champagne-100 flex items-center justify-center mb-6 text-champagne-700 shadow-sm">
                    <Icon name="shopping_bag" className="text-4xl" />
                </div>
                <h2 className="font-headline-md text-3xl text-primary mb-3 font-bold">Your shopping bag is empty</h2>
                <p className="font-body-md text-on-surface-variant mb-8">Discover our exquisite mirror collections to elevate your space.</p>
                <Link to="/shop" className="bg-gradient-gold text-charcoal-900 px-8 py-4 rounded-xl font-label-md text-sm uppercase tracking-widest shadow-md hover:shadow-luxury-glow transition-all font-bold">
                    Explore Collections
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-24 animate-fade-in">
            <div className="mb-10">
                <h1 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-4xl text-primary font-bold mb-2">Shopping Bag</h1>
                <p className="font-body-lg text-on-surface-variant text-base">{cart.items.length} items curated in your bag</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white rounded-2xl border border-champagne-300/40 shadow-premium items-center">
                            <div className="w-28 aspect-square bg-surface-container-high overflow-hidden rounded-xl flex-shrink-0 border border-champagne-300/30 flex items-center justify-center p-1">
                                <img src={item.product.images[0]?.url} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex flex-col flex-grow justify-between py-1 gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-headline-md text-xl text-primary font-bold">{item.product.name}</h3>
                                    <button onClick={() => removeMutation.mutate(item.id)} className="text-gray-400 hover:text-error transition-colors p-2 rounded-full hover:bg-error/10">
                                        <Icon name="close" className="text-lg" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 border border-champagne-300 rounded-xl px-4 py-2 bg-surface-container-low/50">
                                        <button onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })} className="text-primary hover:text-champagne-700 transition-colors"><Icon name="remove" className="text-sm" /></button>
                                        <span className="font-body-md font-bold min-w-[20px] text-center">{item.quantity}</span>
                                        <button onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })} className="text-primary hover:text-champagne-700 transition-colors"><Icon name="add" className="text-sm" /></button>
                                    </div>
                                    <span className="font-label-md text-lg text-primary font-bold">Rs. {((Number(item.product.discountPrice ?? item.product.price)) * item.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4 sticky top-28">
                    <div className="bg-white border border-champagne-300/50 p-8 rounded-3xl shadow-premium">
                        <h2 className="font-headline-lg text-2xl text-primary mb-6 pb-4 border-b border-champagne-300/30 font-bold">Order Summary</h2>
                        <div className="space-y-4 mb-8 font-body-md text-on-surface-variant text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold text-primary">Rs. {Number(cart.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-semibold text-champagne-700">Free</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-champagne-300/30 text-lg font-bold text-primary">
                                <span>Total (COD)</span>
                                <span>Rs. {Number(cart.total).toLocaleString()}</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="w-full bg-gradient-gold text-charcoal-900 font-label-md text-sm uppercase tracking-widest py-4 rounded-xl shadow-md hover:shadow-luxury-glow transition-all flex justify-center items-center gap-2 font-bold">
                            Proceed to Checkout
                            <Icon name="arrow_forward" className="text-lg" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
