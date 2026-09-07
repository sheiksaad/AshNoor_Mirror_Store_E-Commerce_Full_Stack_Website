import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/features/product/api/product.api";
import { EmptyState } from "@/components/EmptyState";
import { Tags } from "lucide-react";
import type { JSX } from "react/jsx-runtime";

export function CategoriesPage(): JSX.Element {
    const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-semibold text-charcoal-900">Categories</h1>
            {isLoading && <p className="text-charcoal-700/60">Loading...</p>}
            {categories && categories.length === 0 && (
                <EmptyState icon={Tags} title="No categories yet" description="Check back soon for new collections." />
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {categories?.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/shop?category=${cat.slug}`}
                        className="rounded-xl2 border border-charcoal-100 bg-gradient-card p-8 text-center shadow-premium transition hover:shadow-premium-hover"
                    >
                        <p className="font-medium text-charcoal-900">{cat.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}