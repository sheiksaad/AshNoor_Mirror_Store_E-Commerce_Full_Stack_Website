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
            toast.success("Coupon created");
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
        <div>
            <header className="flex justify-between items-center mb-stack-lg">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Coupons</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">Manage discount codes.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md px-6 py-2 rounded shadow-[0_10px_30px_rgba(255,224,136,0.2)] hover:bg-secondary-fixed-dim transition-colors flex items-center gap-2">
                    <Icon name="add" className="text-sm" /> New Coupon
                </button>
            </header>

            <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl border border-outline-variant/20 overflow-hidden">
                {isLoading && <p className="p-6 font-body-md text-on-surface-variant">Loading...</p>}
                {coupons && coupons.length > 0 && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant/20 bg-surface/50">
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Code</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Discount</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Usage</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Expires</th>
                                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-surface-container-low/50">
                                    <td className="py-4 px-6 font-mono font-label-md text-label-md text-on-surface">{coupon.code}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md">{coupon.discountPercent}%</td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{coupon.usedCount} / {coupon.maxUses}</td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${coupon.isActive ? "bg-secondary-fixed/20 text-secondary" : "bg-surface-variant text-on-surface-variant"}`}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {coupon.isActive && (
                                            <button onClick={() => deactivateMutation.mutate(coupon.id)} className="text-on-surface-variant hover:text-error"><Icon name="block" className="text-[18px]" /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && <CouponFormModal onSubmit={(v) => createMutation.mutate(v)} onClose={() => setShowModal(false)} isSubmitting={createMutation.isPending} />}
        </div>
    );
}