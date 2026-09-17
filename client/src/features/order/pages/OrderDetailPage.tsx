import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "../api/order.api";
import type { JSX } from "react"
import { Icon } from "@/components/Icon";

export function OrderDetailPage(): JSX.Element {
    const { orderId } = useParams<{ orderId: string }>();
    const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrders });
    const order = orders?.find((o) => o.id === orderId);

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
        </div>
    );
    if (!order) return <p className="font-body-md text-error text-center py-12">Order not found.</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-6 border-b border-champagne-300/40">
                <div>
                    <h2 className="font-headline-md text-2xl text-primary font-bold">Order #{order.id.slice(-8)}</h2>
                    <p className="font-caption text-xs text-on-surface-variant uppercase tracking-wider mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Link to="/account/orders" className="font-label-md text-xs text-champagne-700 hover:text-primary uppercase tracking-wider font-bold flex items-center gap-1">
                    <Icon name="arrow_back" className="text-sm" /> Back to Orders
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-champagne-300/45 shadow-premium space-y-4">
                <h3 className="font-label-md text-sm text-primary uppercase tracking-wider font-bold">Ordered Items</h3>
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-champagne-100/30 border border-champagne-300/30">
                            <img src={item.product.images[0]?.url} alt={item.product.name} className="h-16 w-16 object-cover rounded-lg border border-champagne-300/50 shadow-sm" />
                            <div className="flex-1">
                                <p className="font-label-md text-sm text-primary font-semibold">{item.product.name}</p>
                                <p className="font-caption text-xs text-on-surface-variant mt-0.5">{item.quantity} × Rs. {Number(item.price).toLocaleString()}</p>
                            </div>
                            <span className="font-label-md text-sm text-primary font-bold">Rs. {(item.quantity * Number(item.price)).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-champagne-300/45 shadow-premium space-y-3 font-body-md text-sm">
                <h3 className="font-label-md text-sm text-primary uppercase tracking-wider font-bold pb-2 border-b border-champagne-300/30">Payment Information</h3>
                <div className="flex justify-between text-on-surface-variant"><span>Payment Method</span><span className="font-semibold text-primary uppercase">Cash on Delivery (COD)</span></div>
                <div className="flex justify-between text-on-surface-variant"><span>Payment Status</span><span className="font-semibold text-champagne-700 uppercase">{order.paymentStatus}</span></div>
                <div className="flex justify-between text-on-surface-variant"><span>Order Status</span><span className="font-semibold text-primary uppercase">{order.status}</span></div>
                <div className="flex justify-between font-bold text-base pt-3 border-t border-champagne-300/30 text-primary"><span>Total Amount</span><span>Rs. {Number(order.totalAmount).toLocaleString()}</span></div>
            </div>
        </div>
    );
}
