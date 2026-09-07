import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, setAccessToken, getRefreshPromise } from "@/lib/axios";
import type { AuthUser } from "../api/auth.api";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface MeResponse {
  data: AuthUser;
}

export function AuthProvider({ children }: { children: ReactNode }): React.ReactNode {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession(): Promise<void> {
      try {
        await getRefreshPromise(); // shared lock — StrictMode's double effect call reuses the same in-flight promise
        const meRes = await api.get<MeResponse>("/auth/me");
        setUser(meRes.data.data);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}