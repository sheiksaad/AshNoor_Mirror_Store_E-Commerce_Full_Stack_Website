import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../api/admin.api";
import type { JSX } from "react/jsx-runtime";

export function AdminCustomersPage(): JSX.Element {
    const { data: customers, isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: fetchCustomers });

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="font-headline-lg text-3xl text-primary font-bold">Customers Management</h2>
                <p className="text-on-surface-variant font-body-md text-sm mt-1">View registered customers and their order histories.</p>
            </div>

            <div className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium overflow-hidden">
                {isLoading && (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
                    </div>
                )}
                {customers && customers.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-champagne-300/30 bg-surface-container-low/50">
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Name</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Email</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Phone</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Orders</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-champagne-300/20">
                                {customers.map((c) => (
                                    <tr key={c.id} className="hover:bg-champagne-100/40 transition-colors">
                                        <td className="py-4 px-6 font-label-md text-sm text-primary font-bold">{c.name}</td>
                                        <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{c.email}</td>
                                        <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{c.phone ?? "—"}</td>
                                        <td className="py-4 px-6 font-body-md text-sm font-semibold">{c._count.orders}</td>
                                        <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
