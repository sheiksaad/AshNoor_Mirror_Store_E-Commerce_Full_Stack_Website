import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "@/features/product/api/product.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react";

export function HomePage(): JSX.Element {
    const { data: featured } = useQuery({
        queryKey: ["products", { limit: 4 }],
        queryFn: () => fetchProducts({ limit: 4, sortBy: "createdAt", sortOrder: "desc" }),
    });
    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

    return (
        <div>
            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        className="w-full h-full object-cover opacity-90"
                        src="https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1600&q=80"
                        alt="Luxury mirror interior"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-transparent" />
                </div>
                <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    <div className="md:col-span-7 flex flex-col items-start justify-center">
                        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-md leading-tight">
                            Reflect Your Style
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-stack-lg">
                            Premium mirrors designed to bring elegance, light and character to every space.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:opacity-90 transition-opacity">
                                Shop Mirrors
                            </Link>
                            <Link to="/shop" className="border border-outline text-primary font-label-md text-label-md px-8 py-4 rounded-full hover:bg-surface-container-low transition-colors">
                                Explore Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories && categories.length > 0 && (
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
                    <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-md">Featured Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="bg-surface-container-low border border-outline-variant/30 p-8 text-center hover:border-primary transition-colors">
                                <p className="font-label-md text-label-md text-primary">{cat.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-md">Featured Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {featured?.items.map((product) => {
                        const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                        return (
                        <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            className="group flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="aspect-square overflow-hidden relative bg-surface-variant">
                                <img
                                    src={product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url}
                                    alt={product.name}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                />
                                <button
                                    onClick={(e) => e.preventDefault()}
                                    aria-label="Add to wishlist"
                                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Icon name="favorite" className="text-[18px] text-primary" />
                                </button>
                                {product.stock === 0 && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-on-primary font-caption text-caption uppercase tracking-widest text-[9px]">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest text-[10px] mb-1">{product.category.name}</p>
                                <h3 className="font-body-lg text-body-lg text-primary mb-2">{product.name}</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-label-md text-label-md text-primary">Rs. {hasDiscount ? product.discountPrice : product.price}</span>
                                    <Icon name="arrow_forward" className="text-[16px] text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    );
                    })}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-surface-container-low py-stack-xl">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg text-center">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                        {[
                            { icon: "verified", title: "Authentic Craft", desc: "Handmade pieces, inspected before dispatch." },
                            { icon: "local_shipping", title: "Only Delivery in Karachi", desc: "COD available with a small advance payment." },
                            { icon: "security", title: "Secure Checkout", desc: "Every order is encrypted and protected." },
                        ].map((item) => (
                            <div key={item.title} className="bg-white p-stack-md text-center rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                                <Icon name={item.icon} className="text-secondary text-[32px] mb-3" />
                                <p className="font-label-md text-label-md text-primary mb-2">{item.title}</p>
                                <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full px-margin-desktop py-stack-xl flex flex-col items-center space-y-stack-md bg-primary-container border-t border-outline-variant mt-stack-xl">
                <div className="font-headline-lg text-secondary-fixed mb-stack-md">Ashnoor</div>
                <div className="flex flex-wrap justify-center gap-8 mb-stack-lg">
                    <Link to="/about" className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors">Our Story</Link>
                    <Link to="/contact" className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors">Contact Us</Link>
                </div>
                <div className="font-caption text-caption text-on-primary-fixed">© 2026 Ashnoor Luxury Mirrors. All Rights Reserved.</div>
            </footer>
        </div>
    );
}