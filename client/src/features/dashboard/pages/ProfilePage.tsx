import { useAuth } from "@/features/auth/context/AuthContext";
import type { JSX } from "react/jsx-runtime";


export function ProfilePage(): JSX.Element {
    const { user } = useAuth();

    return (
        <div className="max-w-md space-y-stack-md">
            <div>
                <label className="block font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1">Name</label>
                <p className="font-body-lg text-body-lg text-primary">{user?.name}</p>
            </div>
            <div>
                <label className="block font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
                <p className="font-body-lg text-body-lg text-primary">{user?.email}</p>
            </div>
            <p className="font-caption text-caption text-on-surface-variant">Editing profile details coming soon.</p>
        </div>
    );
}