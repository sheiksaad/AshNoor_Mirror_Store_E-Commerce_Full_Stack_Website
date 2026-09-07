import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import type { JSX } from "react/jsx-runtime";

interface Props {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong.", onRetry }: Props): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center rounded-xl2 border border-charcoal-100 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={26} />
            </div>
            <h3 className="mb-1 font-medium text-charcoal-900">{message}</h3>
            <p className="mb-4 text-sm text-charcoal-700/60">Please try again in a moment.</p>
            <div className="flex gap-2">
                {onRetry && (
                    <button onClick={onRetry} className="flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-2 text-sm text-cream">
                        <RotateCw size={15} /> Retry
                    </button>
                )}
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-lg border border-charcoal-100 px-4 py-2 text-sm">
                    <ArrowLeft size={15} /> Back
                </button>
            </div>
        </div>
    );
}