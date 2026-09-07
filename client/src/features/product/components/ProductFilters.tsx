import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/product.api";
import type { ProductListParams } from "../api/product.api";
import type { JSX } from "react/jsx-runtime";

interface Props {
    filters: ProductListParams;
    onChange: (filters: ProductListParams) => void;
}

export function ProductFilters({ filters, onChange }: Props): JSX.Element {
    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
    const [searchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(searchInput, 400);

    useEffect(() => {
        onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) onChange({ ...filters, category: categoryFromUrl, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div className="space-y-4 md:border-r md:pr-4">
            <div>
                <label className="mb-1 block text-sm font-medium">Search</label>
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search mirrors..."
                    className="w-full rounded-lg border border-charcoal-100 px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                    value={filters.category ?? ""}
                    onChange={(e) => onChange({ ...filters, category: e.target.value || undefined, page: 1 })}
                    className="w-full rounded-lg border border-charcoal-100 px-3 py-2 text-sm"
                >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Sort By</label>
                <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split("-") as [ProductListParams["sortBy"], ProductListParams["sortOrder"]];
                        onChange({ ...filters, sortBy, sortOrder, page: 1 });
                    }}
                    className="w-full rounded-lg border border-charcoal-100 px-3 py-2 text-sm"
                >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                </select>
            </div>
        </div>
    );
}