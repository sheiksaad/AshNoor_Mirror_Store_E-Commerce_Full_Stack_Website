import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllOrders, updateOrderStatus } from "../api/admin-orders.api";
import type { OrderStatus, Order } from "@/features/order/api/order.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react/jsx-runtime";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    CONFIRMED: "SHIPPED",
    SHIPPED: "DELIVERED",
};

export function AdminOrdersPage(): JSX.Element {
    const queryClient = useQueryClient();
    const { data: orders, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const mutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            toast.success("Order status updated successfully");
        },
        onError: () => toast.error("Could not update order status"),
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="font-headline-lg text-3xl text-primary font-bold">Orders Management</h2>
                <p className="text-on-surface-variant font-body-md text-sm mt-1">Review and fulfill customer orders with complete address and phone details.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium overflow-hidden">
                {isLoading && (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
                    </div>
                )}
                {orders && orders.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-champagne-300/30 bg-surface-container-low/50">
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Order ID</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Customer & Phone</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Delivery Address</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Amount</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-right font-caption text-xs text-on-surface-variant uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-champagne-300/20">
                                {orders.map((order) => {
                                    const nextStatus = NEXT_STATUS[order.status];
                                    return (
                                        <tr key={order.id} className="hover:bg-champagne-100/40 transition-colors">
                                            <td className="py-4 px-6 font-label-md text-sm text-primary font-bold">#{order.id.slice(-8)}</td>
                                            <td className="py-4 px-6">
                                                <p className="font-label-md text-sm text-primary font-bold">{order.address?.fullName}</p>
                                                <p className="font-caption text-xs text-champagne-700 font-semibold">{order.address?.phone || "No phone"}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-body-md text-xs text-primary font-medium">{order.address?.street}</p>
                                                <p className="font-caption text-[11px] text-on-surface-variant">{order.address?.city}, {order.address?.province}</p>
                                            </td>
                                            <td className="py-4 px-6 font-label-md text-sm text-primary font-bold">Rs. {Number(order.totalAmount).toLocaleString()}</td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-champagne-100 text-champagne-700 border border-champagne-300">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-surface-container-high text-primary hover:bg-champagne-200 px-3 py-2 rounded-xl font-label-md text-xs uppercase tracking-wider transition-colors shadow-sm"
                                                >
                                                    Details
                                                </button>
                                                {nextStatus && (
                                                    <button 
                                                        onClick={() => mutation.mutate({ orderId: order.id, status: nextStatus })} 
                                                        disabled={mutation.isPending} 
                                                        className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label-md text-xs uppercase tracking-wider hover:bg-champagne-700 transition-colors disabled:opacity-40 shadow-sm"
                                                    >
                                                        Mark {nextStatus}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-champagne-300 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center text-primary hover:bg-champagne-200 transition-colors"
                        >
                            <Icon name="close" className="text-xl" />
                        </button>

                        <h3 className="font-headline-md text-2xl text-primary font-bold mb-6">Order Details #{selectedOrder.id.slice(-8)}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-surface-container-low/50 p-6 rounded-2xl border border-champagne-300/40">
                            <div>
                                <h4 className="font-label-md text-xs text-champagne-700 uppercase tracking-wider font-bold mb-2">Customer & Contact</h4>
                                <p className="font-body-md font-bold text-primary text-sm">{selectedOrder.address?.fullName}</p>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">Phone: <span className="font-semibold text-primary">{selectedOrder.address?.phone}</span></p>
                            </div>
                            <div>
                                <h4 className="font-label-md text-xs text-champagne-700 uppercase tracking-wider font-bold mb-2">Shipping Address</h4>
                                <p className="font-body-md text-xs text-primary font-medium">{selectedOrder.address?.street}</p>
                                <p className="font-body-md text-xs text-on-surface-variant">{selectedOrder.address?.city}, {selectedOrder.address?.province} {selectedOrder.address?.postalCode}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-3">Ordered Items</h4>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-champagne-300/40">
                                        <div className="w-14 h-14 bg-surface-container-high rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                            <img src={item.product.images[0]?.url} alt="" className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-label-md text-sm text-primary font-bold">{item.product.name}</p>
                                            <p className="font-caption text-xs text-on-surface-variant">Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}</p>
                                        </div>
                                        <span className="font-label-md text-sm text-primary font-bold">Rs. {(item.quantity * Number(item.price)).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-champagne-300/40 text-base font-bold text-primary">
                            <span>Total Amount (COD)</span>
                            <span className="text-xl text-champagne-700">Rs. {Number(selectedOrder.totalAmount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
