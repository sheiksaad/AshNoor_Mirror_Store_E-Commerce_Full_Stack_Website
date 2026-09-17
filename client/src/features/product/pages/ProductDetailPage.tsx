import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchProductBySlug } from "../api/product.api";
import { addToCart } from "@/features/cart/api/cart.api";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Icon } from "@/components/Icon";
import { ReviewForm } from "@/features/review/components/ReviewForm";
import { ReviewList } from "@/features/review/components/ReviewList";
import type { JSX } from "react"

export function ProductDetailPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug as string),
    enabled: Boolean(slug),
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(product!.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product added to bag");
    },
    onError: () => toast.error("Could not add to bag"),
  });

  if (isLoading) return (
    <div className="pt-40 flex justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne-500" />
    </div>
  );

  if (!product) return (
    <div className="pt-40 text-center">
      <p className="font-body-md text-error text-lg">Product not found.</p>
      <Link to="/shop" className="mt-4 inline-block text-champagne-700 underline font-semibold">Back to Collections</Link>
    </div>
  );

  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const rating = product.avgRating ?? 0;

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-24 animate-fade-in">
      <div className="flex items-center gap-2 mb-8 text-on-surface-variant font-caption text-xs uppercase tracking-widest">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <Icon name="chevron_right" className="text-sm" />
        <Link to="/shop" className="hover:text-primary transition-colors">Collections</Link>
        <Icon name="chevron_right" className="text-sm" />
        <span className="text-primary font-bold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          {product.images.length > 1 && (
            <div className="hidden md:flex flex-col gap-3 w-24">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImage(i)} className={`w-full aspect-square border rounded-xl overflow-hidden transition-all ${i === activeImage ? "border-champagne-600 ring-2 ring-champagne-500/30" : "border-champagne-300/40 opacity-70 hover:opacity-100"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="flex-1 aspect-square max-h-[520px] bg-white overflow-hidden rounded-3xl border border-champagne-300/40 shadow-premium flex items-center justify-center p-2">
            <img src={product.images[activeImage]?.url} alt={product.name} className="w-full h-full object-contain rounded-2xl" />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col pt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-champagne-600">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" filled={i < Math.round(rating)} className="text-lg" />
              ))}
            </div>
            <span className="font-caption text-xs text-on-surface-variant">
              {rating > 0 ? `(${product.reviewCount} Reviews)` : "No reviews yet"}
            </span>
          </div>

          <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-champagne-300/30">
            <span className="font-headline-md text-2xl md:text-3xl text-primary font-bold">
              Rs. {Number(hasDiscount ? product.discountPrice : product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="font-body-lg text-gray-400 line-through">
                Rs. {Number(product.price).toLocaleString()}
              </span>
            )}
          </div>

          <p className="font-body-lg text-on-surface-variant text-base leading-relaxed mb-8">{product.description}</p>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center border border-champagne-300 rounded-xl px-4 py-3 bg-white shadow-xs">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-primary hover:text-champagne-700 transition-colors p-1"><Icon name="remove" className="text-base" /></button>
              <span className="font-body-md text-base w-10 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="text-primary hover:text-champagne-700 transition-colors p-1"><Icon name="add" className="text-base" /></button>
            </div>
            <button
              disabled={product.stock === 0 || !user || addToCartMutation.isPending}
              onClick={() => addToCartMutation.mutate()}
              className="flex-1 bg-gradient-gold text-charcoal-900 font-label-md text-sm uppercase tracking-widest py-4 rounded-xl shadow-md hover:shadow-luxury-glow transition-all disabled:opacity-40 flex items-center justify-center gap-2 font-bold"
            >
              <Icon name="shopping_bag" className="text-lg" />
              {addToCartMutation.isPending ? "Adding..." : "Add to Bag"}
            </button>
          </div>
          
          {!user && (
            <p className="text-xs text-champagne-700 mb-6 font-semibold">
              Please <Link to="/login" className="underline">login</Link> to add items to your bag.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-champagne-300/30 pt-8 mt-4 bg-white p-6 rounded-2xl border border-champagne-300/40 shadow-xs">
            {[
              { icon: "local_shipping", title: "Karachi Delivery", desc: "Fast & Secure" },
              { icon: "payments", title: "Flexible Payment", desc: "Cash on Delivery" },
              { icon: "verified", title: "Handcrafted", desc: "Master Artisan Built" },
              { icon: "security", title: "Secure Transit", desc: "Guaranteed Safe" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                  <Icon name={b.icon} className="text-xl" />
                </div>
                <div>
                  <p className="font-label-md text-primary font-bold text-xs uppercase tracking-wider">{b.title}</p>
                  <p className="font-caption text-xs text-on-surface-variant">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto border-t border-champagne-300/40 pt-16">
        <h2 className="font-headline-md text-2xl text-primary mb-8 text-center font-bold">Customer Reviews</h2>
        {user && <ReviewForm productId={product.id} />}
        <ReviewList productId={product.id} />
      </div>
    </main>
  );
}
