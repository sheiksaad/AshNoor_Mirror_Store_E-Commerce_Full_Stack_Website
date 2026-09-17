import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "../api/admin.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"

export function AdminOverviewPage(): JSX.Element {
    const { data: stats, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchDashboardStats });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne-500" />
        </div>
    );
    if (!stats) return <p className="font-body-md text-error text-center py-12">Failed to load dashboard statistics.</p>;

    const cards = [
        { label: "Total Sales", value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: "account_balance_wallet" },
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: "shopping_bag" },
        { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), icon: "group" },
        { label: "Active Products", value: stats.totalProducts.toLocaleString(), icon: "category" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((c) => (
                    <div key={c.label} className="bg-white p-6 rounded-2xl border border-champagne-300/40 shadow-premium hover:shadow-luxury-glow hover:-translate-y-1 transition-all duration-300">
                        <div className="p-3 bg-gradient-gold text-charcoal-900 rounded-xl w-fit mb-4 shadow-sm">
                            <Icon name={c.icon} className="text-2xl" />
                        </div>
                        <p className="font-caption text-xs text-on-surface-variant mb-1 uppercase tracking-widest font-semibold">{c.label}</p>
                        <h3 className="font-headline-md text-2xl text-primary font-bold">{c.value}</h3>
                    </div>
                ))}
            </section>

            <section className="bg-white rounded-2xl border border-champagne-300/40 shadow-premium overflow-hidden">
                <div className="p-6 border-b border-champagne-300/30 flex items-center justify-between">
                    <h3 className="font-label-md text-base text-primary uppercase tracking-widest font-bold">Recent Orders</h3>
                    <span className="font-caption text-xs text-champagne-700 uppercase tracking-widest">Live Feed</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-champagne-300/30 bg-surface-container-low/50">
                                <th className="p-4 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Customer</th>
                                <th className="p-4 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                                <th className="p-4 font-caption text-xs text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-champagne-300/20">
                            {stats.recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-champagne-100/40 transition-colors">
                                    <td className="p-4 font-body-md text-sm text-primary font-medium">{order.user.name}</td>
                                    <td className="p-4">
                                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-champagne-100 text-champagne-700 border border-champagne-300">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-label-md text-sm text-primary font-bold text-right">Rs. {order.totalAmount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
