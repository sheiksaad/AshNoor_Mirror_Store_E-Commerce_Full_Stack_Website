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

    if (isLoading) return <p className="pt-32 px-margin-mobile font-body-md text-on-surface-variant">Loading...</p>;

    if (!cart || cart.items.length === 0) {
        return (
            <main className="max-w-container-max mx-auto px-margin-mobile pt-20 pb-stack-xl flex flex-col items-center text-center">
                <h2 className="font-headline-md text-headline-md text-primary mb-2">Your bag is empty</h2>
                <Link to="/shop" className="mt-4 bg-primary text-on-primary px-8 py-3 font-label-md text-label-md">Shop Mirrors</Link>
            </main>
        );
    }

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-stack-xl">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Shopping Bag</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">{cart.items.length} items in your bag</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-8 flex flex-col gap-stack-md">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-stack-md pb-stack-md border-b border-outline-variant/30">
                            <div className="w-32 aspect-[4/5] bg-surface-container-high overflow-hidden flex-shrink-0">
                                <img src={item.product.images[0]?.url} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col flex-grow justify-between py-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-headline-md text-[22px] text-primary">{item.product.name}</h3>
                                    <button onClick={() => removeMutation.mutate(item.id)} className="text-outline hover:text-error"><Icon name="close" /></button>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center gap-4 border border-outline-variant/50 rounded-full px-4 py-2">
                                        <button onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}><Icon name="remove" className="text-[18px]" /></button>
                                        <span className="font-body-md text-body-md min-w-[20px] text-center">{item.quantity}</span>
                                        <button onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}><Icon name="add" className="text-[18px]" /></button>
                                    </div>
                                    <span className="font-label-md text-label-md text-primary">Rs. {item.product.discountPrice ?? item.product.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-surface-variant p-stack-md rounded-xl sticky top-32">
                        <h2 className="font-headline-lg text-[28px] text-primary mb-stack-md border-b border-outline-variant/20 pb-4">Order Summary</h2>
                        <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-stack-md">
                            <span>Subtotal</span>
                            <span>Rs. {cart.total.toFixed(2)}</span>
                        </div>
                        <div className="bg-surface-container-low p-4 border border-outline-variant/20 mb-stack-md flex flex-col gap-2">
                            <div className="flex justify-between text-secondary">
                                <span className="font-label-md text-label-md uppercase">Advance (30%)</span>
                                <span className="font-label-md text-label-md">Rs. {(cart.total * 0.3).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-on-surface-variant text-sm">
                                <span>Remaining COD</span>
                                <span>Rs. {(cart.total * 0.7).toFixed(2)}</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-full hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all flex justify-center items-center gap-2">
                            Proceed to Checkout
                            <Icon name="arrow_forward" className="text-[18px]" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}