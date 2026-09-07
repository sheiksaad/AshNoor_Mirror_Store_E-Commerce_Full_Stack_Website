import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "../api/order.api";
import type { JSX } from "react"


export function OrderDetailPage(): JSX.Element {
    const { orderId } = useParams<{ orderId: string }>();
    const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrders });
    const order = orders?.find((o) => o.id === orderId);

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading...</p>;
    if (!order) return <p className="font-body-md text-error">Order not found.</p>;

    return (
        <div>
            <h2 className="mb-4 font-headline-md text-headline-md text-primary">Order #{order.id.slice(-8)}</h2>
            <div className="mb-4 space-y-2">
                {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-surface-variant pb-2">
                        <img src={item.product.images[0]?.url} alt={item.product.name} className="h-14 w-14 object-cover" />
                        <div className="flex-1">
                            <p className="font-label-md text-label-md text-primary">{item.product.name}</p>
                            <p className="font-caption text-caption text-on-surface-variant">{item.quantity} × Rs. {item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-1 border border-outline-variant p-4 font-body-md text-body-md">
                <div className="flex justify-between"><span>Advance Paid</span><span>Rs. {order.advanceAmount}</span></div>
                <div className="flex justify-between"><span>Due on Delivery</span><span>Rs. {order.remainingAmount}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>Rs. {order.totalAmount}</span></div>
            </div>
        </div>
    );
}