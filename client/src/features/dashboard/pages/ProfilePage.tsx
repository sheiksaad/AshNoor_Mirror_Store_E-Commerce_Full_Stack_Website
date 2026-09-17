import { useAuth } from "@/features/auth/context/AuthContext";
import type { JSX } from "react/jsx-runtime";
import { Icon } from "@/components/Icon";

export function ProfilePage(): JSX.Element {
    const { user } = useAuth();

    return (
        <div className="max-w-xl bg-white p-8 rounded-3xl border border-champagne-300/45 shadow-premium space-y-6 animate-fade-in">
            <h3 className="font-label-md text-base text-primary uppercase tracking-widest font-bold pb-4 border-b border-champagne-300/30">Personal Information</h3>
            <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-champagne-100/30 border border-champagne-300/30">
                    <label className="block font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Full Name</label>
                    <p className="font-body-lg text-lg text-primary font-medium">{user?.name}</p>
                </div>
                <div className="p-4 rounded-2xl bg-champagne-100/30 border border-champagne-300/30">
                    <label className="block font-caption text-xs text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Email Address</label>
                    <p className="font-body-lg text-lg text-primary font-medium">{user?.email}</p>
                </div>
            </div>
            <p className="font-caption text-xs text-on-surface-variant italic pt-2 flex items-center gap-2">
                <Icon name="info" className="text-base text-champagne-700" /> Profile editing and preference controls are managed securely.
            </p>
        </div>
    );
}
