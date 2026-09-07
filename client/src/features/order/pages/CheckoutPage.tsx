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
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-stack-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                <div className="lg:col-span-7 flex flex-col space-y-stack-xl">
                    <section>
                        <h2 className="font-headline-md text-headline-md text-primary mb-stack-md flex items-center">
                            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-md text-label-md mr-4">1</span>
                            Delivery Address
                        </h2>
                        <div className="ml-0 md:ml-12">
                            {addresses && addresses.length === 0 && (
                                <div className="flex items-center justify-between border border-dashed border-outline-variant p-4">
                                    <span className="font-body-md text-body-md text-on-surface-variant">No saved address yet.</span>
                                    <Link to="/account/addresses" className="bg-primary text-on-primary px-4 py-2 font-label-md text-label-md text-xs">Add Address</Link>
                                </div>
                            )}
                            {addresses?.map((addr) => (
                                <label key={addr.id} className="relative flex items-start p-6 border border-outline-variant/50 cursor-pointer mb-3 has-[:checked]:border-secondary has-[:checked]:bg-surface-container-low">
                                    <input type="radio" name="address" checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} className="mt-1 mr-4" />
                                    <div>
                                        <p className="font-label-md text-label-md text-on-surface">{addr.fullName}</p>
                                        <p className="font-body-md text-body-md text-on-surface-variant text-sm">{addr.street}, {addr.city}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>
                    <hr className="border-outline-variant/30 ml-0 md:ml-12" />
                    <section>
                        <h2 className="font-headline-md text-headline-md text-primary mb-stack-md flex items-center">
                            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-md text-label-md mr-4">2</span>
                            Payment Method
                        </h2>
                        <div className="ml-0 md:ml-12">
                            <label className="relative flex items-start p-6 border border-secondary bg-surface-container-low cursor-pointer">
                                <input checked readOnly type="radio" name="payment" className="mt-1 mr-4" />
                                <div>
                                    <span className="font-label-md text-label-md uppercase tracking-widest">EasyPaisa Advance + COD</span>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Pay a 30% deposit now via EasyPaisa. The remaining balance is Cash on Delivery.</p>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-5 sticky top-32">
                    <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 p-stack-md shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                        <h3 className="font-headline-md text-headline-md text-primary mb-stack-md pb-stack-sm border-b border-outline-variant/30">Order Summary</h3>
                        {cart && (
                            <div className="flex flex-col space-y-3 mb-stack-md font-body-md text-body-md text-on-surface-variant">
                                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {cart.total.toFixed(2)}</span></div>
                            </div>
                        )}
                        <hr className="border-outline-variant/30 mb-stack-md" />
                        {cart && (
                            <div className="bg-surface-container-low p-4 border border-outline-variant/20 flex flex-col space-y-2 mb-stack-lg">
                                <div className="flex justify-between items-center text-on-surface">
                                    <span className="font-label-md text-label-md uppercase tracking-widest">Advance (30%)</span>
                                    <span className="font-label-md text-label-md">Rs. {(cart.total * 0.3).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-on-surface-variant text-sm">
                                    <span>Remaining on Delivery</span>
                                    <span>Rs. {(cart.total * 0.7).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => placeOrderMutation.mutate()}
                            disabled={!addressId || placeOrderMutation.isPending}
                            className="w-full bg-secondary-fixed text-on-secondary-fixed py-4 font-label-md text-label-md uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                            {placeOrderMutation.isPending ? "Placing Order..." : "Pay Advance & Place Order"}
                            <Icon name="arrow_forward" className="text-[18px]" />
                        </button>
                        <div className="mt-stack-md flex items-center justify-center gap-2 text-on-surface-variant">
                            <Icon name="lock" className="text-[16px]" />
                            <span className="font-caption text-caption">Secure Checkout Guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}