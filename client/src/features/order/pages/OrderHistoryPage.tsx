import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "../api/order.api";
import type { JSX } from "react"

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800 border border-amber-200",
    ADVANCE_PAID: "bg-champagne-100 text-champagne-700 border border-champagne-300",
    CONFIRMED: "bg-champagne-100 text-champagne-700 border border-champagne-300",
    SHIPPED: "bg-blue-50 text-blue-700 border border-blue-200",
    DELIVERED: "bg-green-50 text-green-700 border border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border border-red-200",
};

export function OrderHistoryPage(): JSX.Element {
    const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrders });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
        </div>
    );
    if (!orders || orders.length === 0) return <p className="font-body-md text-on-surface-variant text-center py-12">No orders placed yet.</p>;

    return (
        <div className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-champagne-300/30 bg-surface-container-low/50">
                            <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Order ID</th>
                            <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Total Amount</th>
                            <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                            <th className="py-4 px-6 text-right font-caption text-xs text-on-surface-variant uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-champagne-300/20 font-body-md text-sm text-primary">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-champagne-100/40 transition-colors group">
                                <td className="py-5 px-6 font-bold">#{order.id.slice(-8)}</td>
                                <td className="py-5 px-6 font-bold">Rs. {order.totalAmount.toLocaleString()}</td>
                                <td className="py-5 px-6">
                                    <span className={`inline-block px-3 py-1 font-caption text-[10px] font-bold uppercase tracking-wider rounded-full ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <Link to={`/account/orders/${order.id}`} className="font-label-md text-xs text-champagne-700 hover:text-primary transition-colors uppercase tracking-wider font-bold">
                                        View Details &rarr;
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
