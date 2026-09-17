import { useState, type JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAddresses, createAddress, deleteAddress } from "@/features/address/api/address.api";
import { AddressForm } from "@/features/address/components/AddressForm";
import { Icon } from "@/components/Icon";

export function AddressBookPage(): JSX.Element {
    const [showForm, setShowForm] = useState(false);
    const queryClient = useQueryClient();
    const { data: addresses, isLoading } = useQuery({ queryKey: ["addresses"], queryFn: fetchAddresses });

    const createMutation = useMutation({
        mutationFn: createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            setShowForm(false);
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-champagne-500" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in max-w-3xl">
            {addresses && addresses.length > 0 && (
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="flex items-start justify-between bg-white p-6 rounded-2xl border border-champagne-300/45 shadow-premium">
                            <div>
                                <p className="font-label-md text-base text-primary font-bold flex items-center gap-2">
                                    {addr.fullName} 
                                    {addr.isDefault && <span className="bg-champagne-100 text-champagne-700 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-champagne-300">Default</span>}
                                </p>
                                <p className="font-body-md text-sm text-on-surface-variant mt-1">{addr.phone}</p>
                                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">{addr.street}, {addr.city}, {addr.province}</p>
                            </div>
                            <button 
                                onClick={() => deleteMutation.mutate(addr.id)} 
                                className="p-2 text-gray-400 hover:text-error rounded-full hover:bg-error/10 transition-colors"
                                title="Delete Address"
                            >
                                <Icon name="delete" className="text-xl" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm ? (
                <div className="bg-white p-8 rounded-3xl border border-champagne-300/45 shadow-premium">
                    <h3 className="font-label-md text-base text-primary uppercase tracking-widest font-bold mb-6">Add New Delivery Address</h3>
                    <AddressForm onSubmit={(v) => createMutation.mutate(v)} isSubmitting={createMutation.isPending} />
                </div>
            ) : (
                <button 
                    onClick={() => setShowForm(true)} 
                    className="bg-gradient-gold text-charcoal-900 px-8 py-3.5 rounded-xl font-label-md text-sm uppercase tracking-widest shadow-md hover:shadow-luxury-glow transition-all font-bold flex items-center gap-2"
                >
                    <Icon name="add" className="text-lg" /> Add New Address
                </button>
            )}
        </div>
    );
}
