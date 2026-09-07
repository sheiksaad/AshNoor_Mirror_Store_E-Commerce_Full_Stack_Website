import { Mail, Phone, MapPin } from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { Icon } from "@/components/Icon";

export function ContactPage(): JSX.Element {
    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-lg">Contact Us</h1>
            <div className="space-y-4 max-w-md">
                <p className="flex items-center gap-3 font-body-md text-body-md text-on-surface-variant">
                    <Icon name="mail" /> support@ashnoormirrorstore.com
                </p>
                <p className="flex items-center gap-3 font-body-md text-body-md text-on-surface-variant">
                    <Icon name="call" /> +92 3XX XXXXXXX
                </p>
                <p className="flex items-center gap-3 font-body-md text-body-md text-on-surface-variant">
                    <Icon name="location_on" /> Karachi, Pakistan
                </p>
            </div>
        </main>
    );
}