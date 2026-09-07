import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "../api/admin.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"


export function AdminOverviewPage(): JSX.Element {
    const { data: stats, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchDashboardStats });

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading...</p>;
    if (!stats) return <p className="font-body-md text-error">Failed to load.</p>;

    const cards = [
        { label: "Total Sales", value: `Rs. ${stats.totalRevenue}`, icon: "account_balance_wallet" },
        { label: "Total Orders", value: stats.totalOrders, icon: "shopping_bag" },
        { label: "Total Customers", value: stats.totalCustomers, icon: "group" },
        { label: "Active Products", value: stats.totalProducts, icon: "category" },
    ];

    return (
        <div className="space-y-stack-lg">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((c) => (
                    <div key={c.label} className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-2 bg-primary-container text-secondary-fixed rounded-lg w-fit mb-4">
                            <Icon name={c.icon} />
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant mb-1 uppercase tracking-wider">{c.label}</p>
                        <h3 className="font-headline-md text-headline-md text-primary">{c.value}</h3>
                    </div>
                ))}
            </section>

            <section className="bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden">
                <div className="p-6 border-b border-surface-variant">
                    <h3 className="font-label-md text-label-md text-primary">RECENT ORDERS</h3>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-surface-variant">
                            <th className="p-4 font-caption text-caption text-on-surface-variant">Customer</th>
                            <th className="p-4 font-caption text-caption text-on-surface-variant">Status</th>
                            <th className="p-4 font-caption text-caption text-on-surface-variant">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-variant/50">
                        {stats.recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-surface-container-low/50">
                                <td className="p-4 font-body-md text-body-md">{order.user.name}</td>
                                <td className="p-4">
                                    <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-secondary-fixed/20 text-secondary">{order.status}</span>
                                </td>
                                <td className="p-4 font-label-md text-label-md">Rs. {order.totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}