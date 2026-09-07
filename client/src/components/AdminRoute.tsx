import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { JSX } from "react/jsx-runtime";

export function AdminRoute({ children }: { children: ReactNode }): JSX.Element {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

    return <>{children}</>;
}