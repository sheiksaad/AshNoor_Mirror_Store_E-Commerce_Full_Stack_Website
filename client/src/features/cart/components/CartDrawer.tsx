import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { fetchCart, updateCartItem, removeCartItem } from "../api/cart.api";
import type { JSX } from "react/jsx-runtime";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: Props): JSX.Element | null {
    const queryClient = useQueryClient();

    const { data: cart } = useQuery({ queryKey: ["cart"], queryFn: fetchCart, enabled: isOpen });

    const updateMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            updateCartItem(itemId, quantity),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    });

    const removeMutation = useMutation({
        mutationFn: (itemId: string) => removeCartItem(itemId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div
                className="flex h-full w-full max-w-sm flex-col bg-white p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                    {cart?.items.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}

                    {cart?.items.map((item) => (
                        <div key={item.id} className="flex gap-3 border-b pb-3">
                            <img
                                src={item.product.images[0]?.url}
                                alt={item.product.name}
                                className="h-16 w-16 rounded object-cover"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                    Rs. {item.product.discountPrice ?? item.product.price}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })
                                        }
                                        className="rounded border px-2 text-sm"
                                    >
                                        −
                                    </button>
                                    <span className="text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                                        }
                                        className="rounded border px-2 text-sm"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeMutation.mutate(item.id)}
                                        className="ml-auto text-xs text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {cart && cart.items.length > 0 && (
                    <div className="border-t pt-4">
                        <div className="mb-3 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>Rs. {cart.total.toFixed(2)}</span>
                        </div>
                        <Link
                            to="/checkout"
                            onClick={onClose}
                            className="block w-full rounded bg-black py-2 text-center text-white"
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}