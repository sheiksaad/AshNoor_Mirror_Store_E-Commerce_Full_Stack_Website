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

    if (isLoading) return <p className="font-body-md text-on-surface-variant">Loading...</p>;

    return (
        <div>
            {addresses && addresses.length > 0 && (
                <div className="mb-stack-md space-y-3">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="flex items-start justify-between border border-outline-variant/30 p-4">
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">
                                    {addr.fullName} {addr.isDefault && <span className="text-secondary ml-1 text-xs">(Default)</span>}
                                </p>
                                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{addr.phone}</p>
                                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{addr.street}, {addr.city}, {addr.province}</p>
                            </div>
                            <button onClick={() => deleteMutation.mutate(addr.id)} className="text-error"><Icon name="delete" className="text-[18px]" /></button>
                        </div>
                    ))}
                </div>
            )}

            {showForm ? (
                <AddressForm onSubmit={(v) => createMutation.mutate(v)} isSubmitting={createMutation.isPending} />
            ) : (
                <button onClick={() => setShowForm(true)} className="border border-outline-variant px-6 py-3 font-label-md text-label-md text-primary hover:border-primary transition-colors">
                    + Add New Address
                </button>
            )}
        </div>
    );
}