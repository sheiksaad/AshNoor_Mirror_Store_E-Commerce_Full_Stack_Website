import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllOrders, updateOrderStatus } from "../api/admin-orders.api";
import type { OrderStatus } from "@/features/order/api/order.api";
import type { JSX } from "react/jsx-runtime";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    CONFIRMED: "SHIPPED",
    SHIPPED: "DELIVERED",
};

export function AdminOrdersPage(): JSX.Element {
    const queryClient = useQueryClient();
    const { data: orders, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });

    const mutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            toast.success("Order status updated");
        },
        onError: () => toast.error("Could not update order status"),
    });

    return (
        <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-lg">Orders</h2>
            <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl border border-outline-variant/20 overflow-hidden">
                {isLoading && <p className="p-6 font-body-md text-on-surface-variant">Loading...</p>}
                {orders && orders.length > 0 && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant/20 bg-surface/50">
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Order</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Customer</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Amount</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {orders.map((order) => {
                                const nextStatus = NEXT_STATUS[order.status];
                                return (
                                    <tr key={order.id} className="hover:bg-surface-container-low/50">
                                        <td className="py-4 px-6 font-label-md text-label-md">#{order.id.slice(-8)}</td>
                                        <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{order.address.fullName}</td>
                                        <td className="py-4 px-6 font-body-md text-body-md">Rs. {order.totalAmount}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-secondary-fixed/20 text-secondary">{order.status}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {nextStatus && (
                                                <button onClick={() => mutation.mutate({ orderId: order.id, status: nextStatus })} disabled={mutation.isPending} className="border border-outline-variant px-3 py-1.5 font-caption text-caption uppercase tracking-wide hover:border-primary transition-colors disabled:opacity-40">
                                                    Mark as {nextStatus}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}