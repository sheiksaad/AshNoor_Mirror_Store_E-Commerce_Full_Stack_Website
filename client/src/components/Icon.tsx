import type { JSX } from "react";

export function Icon({ name, filled = false, className = "" }: { name: string; filled?: boolean; className?: string }): JSX.Element {
    return (
        <span className={`material-symbols-outlined ${filled ? "fill-icon" : ""} ${className}`}>
            {name}
        </span>
    );
}