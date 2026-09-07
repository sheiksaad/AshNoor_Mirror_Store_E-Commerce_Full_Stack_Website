import type { JSX } from "react/jsx-runtime";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props): JSX.Element | null {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded border px-3 py-1 text-sm disabled:opacity-40"
            >
                Previous
            </button>
            <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded border px-3 py-1 text-sm disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
}