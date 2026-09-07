import type { JSX } from "react/jsx-runtime";
export function AboutPage(): JSX.Element {
    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-stack-xl">
            <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-xl">
                <div className="md:col-span-6 flex flex-col justify-center">
                    <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-md">Our Story</h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                        Ashnoor was born from a singular vision: to elevate the mirror from a functional necessity to a
                        centerpiece of art, bringing warmth and character to homes across Pakistan.
                    </p>
                </div>
                <div className="md:col-span-6">
                    <img
                        src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80"
                        alt="Mirror craftsmanship"
                        className="w-full aspect-[4/5] object-cover rounded-lg"
                    />
                </div>
            </section>
        </main>
    );
}