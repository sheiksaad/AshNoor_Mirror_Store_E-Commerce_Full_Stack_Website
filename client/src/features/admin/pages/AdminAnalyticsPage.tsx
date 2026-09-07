import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "../api/admin.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react/jsx-runtime";

export function AdminAnalyticsPage(): JSX.Element {
    const { data, isLoading } = useQuery({ queryKey: ["admin-analytics"], queryFn: fetchAnalytics });

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading...</p>;
    if (!data) return <p className="font-body-md text-error">Failed to load.</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <section className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6">
                <h3 className="font-label-md text-label-md text-primary mb-4">TOP SELLING PRODUCTS</h3>
                {data.topSelling.length === 0 && <p className="font-body-md text-on-surface-variant">No sales yet.</p>}
                <div className="space-y-3">
                    {data.topSelling.map((p, i) => (
                        <div key={p.productId} className="flex justify-between items-center font-body-md text-body-md">
                            <span className="text-primary">{i + 1}. {p.name}</span>
                            <span className="text-on-surface-variant">{p.unitsSold} sold</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6">
                <h3 className="font-label-md text-label-md text-primary mb-4 flex items-center gap-2">
                    <Icon name="warning" className="text-[18px] text-error" /> LOW STOCK PRODUCTS
                </h3>
                {data.lowStock.length === 0 && <p className="font-body-md text-on-surface-variant">All products well-stocked.</p>}
                <div className="space-y-3">
                    {data.lowStock.map((p) => (
                        <div key={p.id} className="flex justify-between items-center font-body-md text-body-md">
                            <span className="text-primary">{p.name}</span>
                            <span className="text-error font-label-md text-label-md">{p.stock} left</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}