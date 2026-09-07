import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../api/admin.api";
import type { JSX } from "react/jsx-runtime";

export function AdminCustomersPage(): JSX.Element {
    const { data: customers, isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: fetchCustomers });

    return (
        <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-lg">Customers</h2>
            <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl border border-outline-variant/20 overflow-hidden">
                {isLoading && <p className="p-6 font-body-md text-on-surface-variant">Loading...</p>}
                {customers && customers.length > 0 && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant/20 bg-surface/50">
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Phone</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Orders</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {customers.map((c) => (
                                <tr key={c.id} className="hover:bg-surface-container-low/50">
                                    <td className="py-4 px-6 font-label-md text-label-md text-on-surface">{c.name}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{c.email}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{c.phone ?? "—"}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md">{c._count.orders}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{new Date(c.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}