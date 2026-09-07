import { ShieldAlert } from "lucide-react";
import { Link } from "react-router";
import type { JSX } from "react/jsx-runtime";

export function UnauthorizedPage(): JSX.Element {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700/60">
                <ShieldAlert size={30} />
            </div>
            <h1 className="mb-1 text-xl font-semibold text-charcoal-900">Access Restricted</h1>
            <p className="mb-6 max-w-sm text-sm text-charcoal-700/60">
                You don't have permission to view this page.
            </p>
            <Link to="/" className="rounded-lg bg-gradient-primary px-5 py-2.5 text-sm text-cream">
                Back to Home
            </Link>
        </div>
    );
}