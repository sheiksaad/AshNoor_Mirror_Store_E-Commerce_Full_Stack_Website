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
        <div className="min-h-screen bg-surface text-on-surface">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        className="w-full h-full object-cover object-center scale-105 animate-fade-in filter brightness-95"
                        src="https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1800&q=85"
                        alt="Luxury interior with designer mirror"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/60 to-transparent" />
                </div>
                <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
                    <div className="md:col-span-8 lg:col-span-7 flex flex-col items-start justify-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-100 text-primary font-label-md text-xs uppercase tracking-widest mb-5 border border-champagne-300 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-champagne-600 animate-pulse" />
                            Handcrafted Luxury Mirrors
                        </div>
                        <h1 className="text-3xl md:text-5xl text-primary font-bold mb-5 leading-[1.15] tracking-tight">
                            Reflect Your Style with Timeless Elegance
                        </h1>
                        <p className="font-body-md md:font-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                            Discover masterfully crafted statement mirrors designed to elevate your living spaces with unmatched luminosity, depth, and sophistication.
                        </p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link to="/shop" className="bg-gradient-gold text-charcoal-900 font-label-md text-sm uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md hover:opacity-95 transition-all transform hover:-translate-y-0.5 font-bold">
                                Explore Collection
                            </Link>
                            <Link to="/shop?category=wall-mirrors" className="bg-white/80 backdrop-blur-md border border-champagne-300 text-primary font-label-md text-sm uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-champagne-100 transition-all shadow-sm font-semibold">
                                View Wall Mirrors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            {categories && categories.length > 0 && (
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <span className="font-caption text-xs text-champagne-700 uppercase tracking-widest block mb-2 font-bold">Curated Categories</span>
                            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Explore by Style</h2>
                        </div>
                        <Link to="/shop" className="mt-4 md:mt-0 text-primary font-label-md text-sm uppercase tracking-wider flex items-center gap-1 hover:text-champagne-700 transition-colors font-semibold">
                            All Collections <Icon name="arrow_forward" className="text-lg" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/shop?category=${cat.slug}`}
                                className="group relative overflow-hidden rounded-2xl bg-white border border-champagne-300/40 p-8 text-center hover:border-champagne-500 transition-all duration-300 hover:shadow-xl flex flex-col items-center justify-center min-h-[160px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-champagne-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="font-headline-md text-xl text-primary group-hover:scale-105 transition-transform font-bold">{cat.name}</p>
                                <span className="font-caption text-xs text-on-surface-variant uppercase tracking-widest mt-2 opacity-80 group-hover:opacity-100">Browse Mirrors</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 bg-white rounded-3xl my-10 border border-champagne-300/30 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 px-6 md:px-10">
                    <div>
                        <span className="font-caption text-xs text-champagne-700 uppercase tracking-widest block mb-2 font-bold">Handcrafted Excellence</span>
                        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Featured Products</h2>
                    </div>
                    <Link to="/shop" className="mt-4 md:mt-0 text-primary font-label-md text-sm uppercase tracking-wider flex items-center gap-1 hover:text-champagne-700 transition-colors font-semibold">
                        View All Products <Icon name="arrow_forward" className="text-lg" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-10">
                    {featured?.items.map((product) => {
                        const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                        return (
                            <Link
                                key={product.id}
                                to={`/product/${product.slug}`}
                                className="group flex flex-col border border-champagne-300/40 rounded-2xl overflow-hidden bg-white hover:shadow-[0_20px_50px_rgba(205,164,111,0.15)] hover:-translate-y-1.5 transition-all duration-300"
                            >
                                <div className="aspect-[4/5] overflow-hidden relative bg-surface-variant">
                                    <img
                                        src={product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url}
                                        alt={product.name}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        aria-label="Add to wishlist"
                                        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-champagne-100 text-primary"
                                    >
                                        <Icon name="favorite" className="text-[18px]" />
                                    </button>
                                    {product.stock === 0 && (
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-charcoal-900 text-white font-caption text-xs uppercase tracking-widest font-bold rounded-md">
                                            Out of Stock
                                        </div>
                                    )}
                                    {hasDiscount && (
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-gold text-charcoal-900 font-caption text-xs uppercase tracking-widest font-bold rounded-md">
                                            Sale
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-1 bg-white">
                                    <p className="font-caption text-xs text-champagne-700 uppercase tracking-widest mb-1.5 font-semibold">{product.category.name}</p>
                                    <h3 className="font-body-lg text-primary font-semibold mb-3 group-hover:text-champagne-700 transition-colors">{product.name}</h3>
                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-champagne-300/30">
                                        <div className="flex items-center gap-2">
                                            <span className="font-label-md text-primary font-bold text-base">
                                                Rs. {hasDiscount ? product.discountPrice : product.price}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-xs text-gray-400 line-through">Rs. {product.price}</span>
                                            )}
                                        </div>
                                        <span className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
                                            <Icon name="arrow_forward" className="text-sm" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-surface">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="font-caption text-xs text-champagne-700 uppercase tracking-widest block mb-2 font-bold">The Ashnoor Promise</span>
                        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4 font-bold">Why Choose Us</h2>
                        <p className="font-body-md text-on-surface-variant">We combine uncompromising craftsmanship with dedicated local service to give your home the reflection it deserves.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "verified", title: "Authentic Craft", desc: "Handmade pieces, meticulously inspected before dispatch." },
                            { icon: "local_shipping", title: "Only Delivery in Karachi", desc: "Safe home delivery with COD available (small advance payment)." },
                            { icon: "security", title: "Secure Checkout", desc: "Every transaction and order is fully encrypted and protected." },
                        ].map((item) => (
                            <div key={item.title} className="bg-white p-8 text-center rounded-2xl border border-champagne-300/40 shadow-sm hover:shadow-lg transition-all">
                                <div className="w-16 h-16 rounded-2xl bg-champagne-100 flex items-center justify-center mx-auto mb-6 text-primary shadow-xs border border-champagne-300/40">
                                    <Icon name={item.icon} className="text-[32px] text-champagne-700" />
                                </div>
                                <h3 className="font-label-md text-primary text-lg mb-2 font-bold">{item.title}</h3>
                                <p className="font-body-md text-on-surface-variant leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full px-margin-desktop py-16 flex flex-col items-center space-y-6 bg-charcoal-900 text-white border-t border-champagne-500/20">
                <div className="font-headline-lg text-champagne-500 text-3xl font-bold tracking-widest uppercase">Ashnoor</div>
                <p className="text-sm text-gray-300 max-w-md text-center">Refining interior spaces across Karachi with exquisite handmade luxury mirrors.</p>
                <div className="flex flex-wrap justify-center gap-8">
                    <Link to="/shop" className="font-body-md text-gray-300 hover:text-champagne-500 transition-colors">Collections</Link>
                    <Link to="/about" className="font-body-md text-gray-300 hover:text-champagne-500 transition-colors">Our Story</Link>
                    <Link to="/contact" className="font-body-md text-gray-300 hover:text-champagne-500 transition-colors">Contact Us</Link>
                </div>
                <div className="w-full max-w-xs h-px bg-champagne-500/20 my-4" />
                <div className="font-caption text-xs text-gray-400">© 2026 Ashnoor Luxury Mirrors. All Rights Reserved.</div>
            </footer>
        </div>
    );
}
