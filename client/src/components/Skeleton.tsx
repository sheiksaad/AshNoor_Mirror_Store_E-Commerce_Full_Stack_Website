import { cn } from "@/lib/cn";
import type { JSX } from "react/jsx-runtime";

export function Skeleton({ className }: { className?: string }): JSX.Element {
    return <div className={cn("animate-pulse rounded-lg bg-charcoal-100", className)} />;
}

export function ProductCardSkeleton(): JSX.Element {
    return (
        <div className="overflow-hidden rounded-xl2 border border-charcoal-100">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    );
}