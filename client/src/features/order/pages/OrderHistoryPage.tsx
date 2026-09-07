import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "../api/order.api";
import type { JSX } from "react"


const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-surface-variant text-on-surface-variant",
    ADVANCE_PAID: "bg-secondary-fixed/20 text-secondary",
    CONFIRMED: "bg-secondary-fixed/20 text-secondary",
    SHIPPED: "bg-surface-variant text-on-surface-variant",
    DELIVERED: "bg-surface-variant text-on-surface-variant",
    CANCELLED: "bg-error-container text-error",
};

export function OrderHistoryPage(): JSX.Element {
    const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrders });

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading...</p>;
    if (!orders || orders.length === 0) return <p className="font-body-md text-on-surface-variant">No orders yet.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-surface-variant">
                        <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Order #</th>
                        <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Total</th>
                        <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Status</th>
                        <th className="py-4 px-2 text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Action</th>
                    </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-primary">
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-surface-container-high hover:bg-surface-container-low transition-colors group">
                            <td className="py-5 px-2">#{order.id.slice(-8)}</td>
                            <td className="py-5 px-2">Rs. {order.totalAmount}</td>
                            <td className="py-5 px-2">
                                <span className={`inline-block px-3 py-1 font-caption text-caption uppercase tracking-wider rounded-sm ${STATUS_STYLE[order.status] ?? "bg-surface-variant"}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="py-5 px-2 text-right">
                                <Link to={`/account/orders/${order.id}`} className="font-label-md text-label-md text-on-surface-variant border-b border-transparent group-hover:border-primary transition-all">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}