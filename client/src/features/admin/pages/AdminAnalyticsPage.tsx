import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "../api/admin.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react/jsx-runtime";

export function AdminAnalyticsPage(): JSX.Element {
    const { data, isLoading } = useQuery({ queryKey: ["admin-analytics"], queryFn: fetchAnalytics });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
        </div>
    );
    if (!data) return <p className="font-body-md text-error text-center py-12">Failed to load analytics.</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <section className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium p-6">
                <h3 className="font-label-md text-base text-primary uppercase tracking-widest font-bold mb-6 pb-3 border-b border-champagne-300/30">Top Selling Products</h3>
                {data.topSelling.length === 0 && <p className="font-body-md text-sm text-on-surface-variant">No sales recorded yet.</p>}
                <div className="space-y-4">
                    {data.topSelling.map((p, i) => (
                        <div key={p.productId} className="flex justify-between items-center p-3 rounded-xl bg-champagne-100/30 border border-champagne-300/30">
                            <span className="text-primary font-medium text-sm">{i + 1}. {p.name}</span>
                            <span className="text-champagne-700 font-bold text-sm bg-white px-3 py-1 rounded-lg border border-champagne-300">{p.unitsSold} units sold</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium p-6">
                <h3 className="font-label-md text-base text-primary uppercase tracking-widest font-bold mb-6 pb-3 border-b border-champagne-300/30 flex items-center gap-2">
                    <Icon name="warning" className="text-xl text-error" /> Low Stock Inventory
                </h3>
                {data.lowStock.length === 0 && <p className="font-body-md text-sm text-on-surface-variant">All products are well-stocked.</p>}
                <div className="space-y-4">
                    {data.lowStock.map((p) => (
                        <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-red-50/50 border border-red-200/50">
                            <span className="text-primary font-medium text-sm">{p.name}</span>
                            <span className="text-error font-bold text-sm bg-white px-3 py-1 rounded-lg border border-red-200">{p.stock} left</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
