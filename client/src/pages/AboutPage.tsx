import type { JSX } from "react/jsx-runtime";
import { Link } from "react-router";
import { Icon } from "@/components/Icon";

export function AboutPage(): JSX.Element {
    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-stack-xl animate-fade-in">
            {/* Hero Section */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
                <div className="md:col-span-6 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-300/40 border border-champagne-500/30 text-champagne-700 font-label-md text-xs tracking-widest uppercase mb-6 shadow-sm w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-champagne-500 animate-pulse" />
                        Our Story & Heritage
                    </span>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl text-primary mb-6 font-bold leading-tight">
                        Crafting Reflection Into <span className="text-gradient-gold">Art</span>
                    </h1>
                    <p className="font-body-lg text-on-surface-variant text-base md:text-lg mb-6 leading-relaxed">
                        Ashnoor Mirror Store was born from a singular passion: to transform the everyday mirror from a functional household utility into an exquisite centerpiece of interior architecture and fine art.
                    </p>
                    <p className="font-body-md text-on-surface-variant text-sm md:text-base mb-8 leading-relaxed">
                        Based in Karachi, Pakistan, our studio combines traditional artisanal craftsmanship with contemporary luxury aesthetics. Every mirror in our collection is carefully curated and handcrafted using premium silver glass, intricate woodwork, and durable metallic finishes.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/shop" className="bg-gradient-gold text-charcoal-900 font-label-md text-sm px-8 py-4 rounded-full shadow-md hover:shadow-luxury-glow transition-all uppercase tracking-widest font-bold">
                            Explore Collections
                        </Link>
                    </div>
                </div>
                <div className="md:col-span-6 relative">
                    <div className="absolute -inset-4 bg-champagne-300/25 rounded-3xl blur-xl -z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=1000&q=85"
                        alt="Ashnoor Mirror Craftsmanship"
                        className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl border border-champagne-300/50"
                    />
                </div>
            </section>

            {/* Values / Pillars */}
            <section className="py-20 bg-surface-container-low/60 rounded-3xl px-8 md:px-16 border border-champagne-300/40 mb-20">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="font-caption text-xs tracking-[0.2em] uppercase text-champagne-700 mb-2 block">Why Choose Ashnoor Mirror Store</span>
                    <h2 className="font-headline-lg text-3xl text-primary font-bold">The Pillars of Our Craft</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "diamond",
                            title: "Unrivaled Quality",
                            desc: "We use distortion-free high-definition silver mirrors and robust corrosion-resistant frames designed to stand the test of time.",
                        },
                        {
                            icon: "brush",
                            title: "Artisanal Precision",
                            desc: "Each mirror undergoes rigorous hand-polishing and detailing by master craftsmen dedicated to absolute perfection.",
                        },
                        {
                            icon: "local_shipping",
                            title: "Secure Karachi Delivery",
                            desc: "Specialized white-glove packaging and safe transit ensuring your exquisite mirror arrives pristine at your doorstep.",
                        },
                    ].map((pillar) => (
                        <div key={pillar.title} className="bg-white p-8 rounded-2xl border border-champagne-300/40 shadow-sm hover:shadow-md transition-all text-center">
                            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-champagne-100 text-champagne-700 flex items-center justify-center shadow-inner">
                                <Icon name={pillar.icon} className="text-2xl" />
                            </div>
                            <h3 className="font-headline-md text-xl text-primary mb-3 font-bold">{pillar.title}</h3>
                            <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Commitment CTA */}
            <section className="bg-primary text-on-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cda46f_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="font-headline-lg text-3xl md:text-4xl text-white mb-4 font-bold">Transform Your Space Today</h2>
                    <p className="font-body-md text-gray-300 mb-8 leading-relaxed">
                        Discover how our statement mirrors can redefine the light, elegance, and spaciousness of your home or office.
                    </p>
                    <Link to="/shop" className="inline-block bg-gradient-gold text-charcoal-900 font-label-md text-sm px-10 py-4 rounded-full shadow-lg hover:shadow-luxury-glow transition-all uppercase tracking-widest font-bold">
                        Browse Store
                    </Link>
                </div>
            </section>
        </main>
    );
}
