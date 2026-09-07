import { Navigate } from "react-router";
import type { ReactNode, JSX } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}