import { useState, type JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchCoupons, createCoupon, deactivateCoupon } from "../api/admin-coupons.api";
import { CouponFormModal } from "../components/CouponFormModal";
import { Icon } from "@/components/Icon";

export function AdminCouponsPage(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();
    const { data: coupons, isLoading } = useQuery({ queryKey: ["admin-coupons"], queryFn: fetchCoupons });

    const createMutation = useMutation({
        mutationFn: createCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            setShowModal(false);
            toast.success("Coupon created successfully");
        },
        onError: () => toast.error("Could not create coupon — code may already exist"),
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            toast.success("Coupon deactivated");
        },
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="font-headline-lg text-3xl text-primary font-bold">Coupons Management</h2>
                    <p className="font-body-md text-sm text-on-surface-variant mt-1">Create and monitor promotional discount codes.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="bg-gradient-gold text-charcoal-900 font-label-md text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-luxury-glow transition-all flex items-center gap-2 uppercase tracking-wider font-bold"
                >
                    <Icon name="add" className="text-lg" /> New Coupon
                </button>
            </header>

            <div className="bg-white rounded-2xl border border-champagne-300/45 shadow-premium overflow-hidden">
                {isLoading && (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
                    </div>
                )}
                {coupons && coupons.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-champagne-300/30 bg-surface-container-low/50">
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Code</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Discount</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Usage</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Expires</th>
                                    <th className="py-4 px-6 font-caption text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-right font-caption text-xs text-on-surface-variant uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-champagne-300/20">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-champagne-100/40 transition-colors">
                                        <td className="py-4 px-6 font-mono font-bold text-sm text-primary">{coupon.code}</td>
                                        <td className="py-4 px-6 font-label-md text-sm text-champagne-700 font-bold">{coupon.discountPercent}% OFF</td>
                                        <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{coupon.usedCount} / {coupon.maxUses}</td>
                                        <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${coupon.isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                                                {coupon.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {coupon.isActive && (
                                                <button 
                                                    onClick={() => deactivateMutation.mutate(coupon.id)} 
                                                    className="p-2 text-gray-400 hover:text-error rounded-full hover:bg-error/15 transition-colors"
                                                    title="Deactivate Coupon"
                                                >
                                                    <Icon name="block" className="text-xl" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && <CouponFormModal onSubmit={(v) => createMutation.mutate(v)} onClose={() => setShowModal(false)} isSubmitting={createMutation.isPending} />}
        </div>
    );
}
