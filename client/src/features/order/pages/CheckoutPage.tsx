import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAddresses } from "@/features/address/api/address.api";
import { fetchCart } from "@/features/cart/api/cart.api";
import { api } from "@/lib/axios";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"

interface OrderResponse {
    data: { order: { id: string }; payment: { transactionId: string } };
}

export function CheckoutPage(): JSX.Element {
    const navigate = useNavigate();
    const [addressId, setAddressId] = useState("");

    const { data: addresses } = useQuery({ queryKey: ["addresses"], queryFn: fetchAddresses });
    const { data: cart } = useQuery({ queryKey: ["cart"], queryFn: fetchCart });

    const placeOrderMutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.post<OrderResponse>("/orders", { addressId });
            await api.post(`/orders/${data.data.order.id}/confirm-payment`, { transactionId: data.data.payment.transactionId });
            return data.data.order.id;
        },
        onSuccess: (orderId) => {
            toast.success("Order placed successfully");
            navigate(`/account/orders/${orderId}`);
        },
        onError: () => toast.error("Could not place order"),
    });

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-20">
            <div className="mb-10">
                <h1 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-4xl text-primary font-bold mb-2">Checkout</h1>
                <p className="font-body-lg text-on-surface-variant text-base">Complete your order details below</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 flex flex-col space-y-8">
                    <section className="bg-white p-8 rounded-3xl border border-champagne-300/40 shadow-premium">
                        <h2 className="font-headline-md text-2xl text-primary mb-6 flex items-center font-bold">
                            <span className="w-8 h-8 rounded-full bg-champagne-100 text-champagne-700 flex items-center justify-center font-label-md text-sm mr-3 border border-champagne-300">1</span>
                            Delivery Address
                        </h2>
                        <div>
                            {addresses && addresses.length === 0 && (
                                <div className="flex items-center justify-between border border-dashed border-champagne-300 p-6 rounded-2xl bg-surface-container-low/50">
                                    <span className="font-body-md text-on-surface-variant">No saved address yet.</span>
                                    <Link to="/account/addresses" className="bg-gradient-gold text-charcoal-900 px-6 py-3 rounded-xl font-label-md text-xs uppercase tracking-wider font-bold shadow-sm">Add Address</Link>
                                </div>
                            )}
                            {addresses?.map((addr) => (
                                <label key={addr.id} className="relative flex items-start p-6 border border-champagne-300/40 rounded-2xl cursor-pointer mb-3 hover:border-champagne-500 transition-all has-[:checked]:border-champagne-600 has-[:checked]:bg-champagne-100/30">
                                    <input type="radio" name="address" checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} className="mt-1 mr-4 accent-champagne-600" />
                                    <div>
                                        <p className="font-label-md text-primary font-bold">{addr.fullName}</p>
                                        <p className="font-body-md text-on-surface-variant text-sm mt-1">{addr.street}, {addr.city}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-champagne-300/40 shadow-premium">
                        <h2 className="font-headline-md text-2xl text-primary mb-6 flex items-center font-bold">
                            <span className="w-8 h-8 rounded-full bg-champagne-100 text-champagne-700 flex items-center justify-center font-label-md text-sm mr-3 border border-champagne-300">2</span>
                            Payment Method
                        </h2>
                        <div>
                            <label className="relative flex items-start p-6 border border-champagne-600 rounded-2xl bg-champagne-100/30 cursor-pointer">
                                <input checked readOnly type="radio" name="payment" className="mt-1 mr-4 accent-champagne-600" />
                                <div>
                                    <span className="font-label-md text-primary font-bold uppercase tracking-wider">Cash on Delivery (COD)</span>
                                    <p className="font-body-md text-on-surface-variant text-sm mt-1">Pay with cash upon delivery at your doorstep.</p>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-5 sticky top-28">
                    <div className="bg-white border border-champagne-300/50 p-8 rounded-3xl shadow-premium">
                        <h3 className="font-headline-lg text-2xl text-primary mb-6 pb-4 border-b border-champagne-300/30 font-bold">Order Summary</h3>
                        {cart && (
                            <div className="space-y-4 mb-8 font-body-md text-on-surface-variant text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-primary">Rs. {Number(cart.total).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping (Karachi)</span>
                                    <span className="font-semibold text-champagne-700">Free</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-champagne-300/30 text-lg font-bold text-primary">
                                    <span>Total Amount</span>
                                    <span>Rs. {Number(cart.total).toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => placeOrderMutation.mutate()}
                            disabled={!addressId || placeOrderMutation.isPending}
                            className="w-full bg-gradient-gold text-charcoal-900 font-label-md text-sm uppercase tracking-widest py-4 rounded-xl shadow-md hover:shadow-luxury-glow transition-all disabled:opacity-40 flex items-center justify-center gap-2 font-bold"
                        >
                            {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                            <Icon name="arrow_forward" className="text-lg" />
                        </button>
                        <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant">
                            <Icon name="lock" className="text-base text-champagne-700" />
                            <span className="font-caption text-xs">Secure Checkout Guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
