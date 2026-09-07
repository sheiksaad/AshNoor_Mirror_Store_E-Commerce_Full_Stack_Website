import { Construction } from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { Icon } from "@/components/Icon";

export function ComingSoonPage({ title }: { title: string }): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center border border-dashed border-outline-variant py-stack-xl text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                <Icon name="construction" className="text-[32px] text-on-surface-variant" />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">{title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">This section is coming soon.</p>
        </div>
    );
}