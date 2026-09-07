import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import type { JSX } from "react/jsx-runtime";

interface Props {
    icon: LucideIcon;
    title: string;
    description: string;
    ctaLabel?: string;
    ctaTo?: string;
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaTo }: Props): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-charcoal-100 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700/60">
                <Icon size={26} />
            </div>
            <h3 className="mb-1 font-medium text-charcoal-900">{title}</h3>
            <p className="mb-4 max-w-xs text-sm text-charcoal-700/60">{description}</p>
            {ctaLabel && ctaTo && (
                <Link to={ctaTo} className="rounded-lg bg-gradient-primary px-5 py-2 text-sm text-cream">
                    {ctaLabel}
                </Link>
            )}
        </div>
    );
}