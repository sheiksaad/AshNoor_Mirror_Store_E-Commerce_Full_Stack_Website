import { useState } from "react";
import { useParams } from "react-router";
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
      toast.success("Product added to cart");
    },
    onError: () => toast.error("Could not add to cart"),
  });

  if (isLoading) return <p className="pt-32 px-margin-mobile font-body-md text-on-surface-variant">Loading...</p>;
  if (!product) return <p className="pt-32 px-margin-mobile font-body-md text-error">Product not found.</p>;

  const hasDiscount = product.discountPrice !== null;
  const rating = product.avgRating ?? 0;

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-stack-xl">
      <div className="flex items-center gap-2 mb-stack-md text-on-surface-variant font-caption text-caption uppercase tracking-widest">
        <span>Home</span>
        <Icon name="chevron_right" className="text-[14px]" />
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-stack-xl">
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          {product.images.length > 1 && (
            <div className="hidden md:flex flex-col gap-3 w-20">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImage(i)} className={`w-full aspect-square border rounded-md overflow-hidden ${i === activeImage ? "border-secondary-fixed ring-1 ring-secondary-fixed" : "border-outline-variant/30 opacity-70"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="flex-1 aspect-square max-h-[480px] bg-surface-container-low overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.06)] mx-auto">
            <img src={product.images[activeImage]?.url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-secondary-fixed">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" filled={i < Math.round(rating)} className="text-[18px]" />
              ))}
            </div>
            <span className="font-caption text-caption text-on-surface-variant">
              {rating > 0 ? `(${product.reviewCount} Reviews)` : "No reviews yet"}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-4">{product.name}</h1>
          <div className="flex items-end gap-4 mb-8 pb-8 border-b border-outline-variant/30">
            <span className="font-headline-md text-headline-md text-primary">Rs. {hasDiscount ? product.discountPrice : product.price}</span>
            {hasDiscount && <span className="font-body-lg text-body-lg text-on-surface-variant line-through mb-1">Rs. {product.price}</span>}
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{product.description}</p>

          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-outline-variant/50 px-4">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-on-surface-variant hover:text-primary p-2"><Icon name="remove" className="text-[16px]" /></button>
              <span className="font-body-lg text-body-lg w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="text-on-surface-variant hover:text-primary p-2"><Icon name="add" className="text-[16px]" /></button>
            </div>
            <button
              disabled={product.stock === 0 || !user || addToCartMutation.isPending}
              onClick={() => addToCartMutation.mutate()}
              className="flex-1 bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md uppercase tracking-widest py-4 hover:bg-secondary-fixed-dim transition-colors disabled:opacity-40"
            >
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </button>
          </div>
          {!user && <p className="text-xs text-on-surface-variant mb-6">Login to add items to your cart.</p>}

          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-8">
            {[
              { icon: "local_shipping", title: "Cash on Delivery", desc: "Nationwide" },
              { icon: "payments", title: "COD Available", desc: "30% advance via EasyPaisa" },
              { icon: "verified", title: "Authentic Craft", desc: "Handmade pieces" },
              { icon: "security", title: "Secure Checkout", desc: "Encrypted payment" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <Icon name={b.icon} className="text-on-surface-variant" />
                <div>
                  <p className="font-label-md text-label-md text-primary">{b.title}</p>
                  <p className="font-caption text-caption text-on-surface-variant">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto border-t border-outline-variant/30 pt-stack-md">
        <h2 className="font-headline-md text-headline-md text-primary mb-6 text-center">Reviews</h2>
        {user && <ReviewForm productId={product.id} />}
        <ReviewList productId={product.id} />
      </div>
    </main>
  );
}