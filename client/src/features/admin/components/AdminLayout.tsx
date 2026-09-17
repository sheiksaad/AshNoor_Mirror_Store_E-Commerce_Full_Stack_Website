import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { logoutRequest } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"

const NAV = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/admin/products", label: "Products", icon: "hevc" },
    { to: "/admin/orders", label: "Orders", icon: "shopping_cart" },
    { to: "/admin/customers", label: "Customers", icon: "group" },
    { to: "/admin/coupons", label: "Coupons", icon: "sell" },
    { to: "/admin/analytics", label: "Analytics", icon: "monitoring" },
];

function Sidebar({ onNav }: { onNav?: () => void }): JSX.Element {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    async function handleLogout(): Promise<void> {
        await logoutRequest();
        setUser(null);
        toast.success("Logged out successfully.");
        navigate("/login", { replace: true });
    }

    return (
        <div className="flex flex-col h-full bg-charcoal-900 text-white py-6 border-r border-champagne-500/20">
            <div className="px-6 pb-8 border-b border-champagne-500/20 mb-6 flex flex-col items-center">
                <h1 className="text-champagne-500 font-headline-md text-2xl tracking-widest uppercase">Ashnoor</h1>
                <p className="font-caption text-xs text-gray-400 mt-1 tracking-wider uppercase">Management Portal</p>
            </div>
            <div className="flex-1 overflow-y-auto px-3 space-y-1">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNav}
                        className={({ isActive }) =>
                            `rounded-xl mx-2 px-4 py-3 flex items-center gap-3 font-label-md text-sm transition-all duration-300 ${isActive ? "bg-gradient-gold text-charcoal-900 font-bold shadow-luxury-glow" : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        <Icon name={item.icon} className="text-xl" />
                        {item.label}
                    </NavLink>
                ))}
            </div>
            <div className="px-4 mt-auto pt-6 border-t border-champagne-500/20">
                <div className="flex items-center gap-3 px-2 mb-4 bg-white/5 p-3 rounded-xl border border-champagne-500/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center font-bold text-charcoal-900 shadow-sm">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-label-md text-sm text-white truncate">{user?.name}</p>
                        <p className="font-caption text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full bg-white/10 text-white font-label-md text-sm py-3 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center gap-2 border border-white/10">
                    <Icon name="logout" className="text-lg" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export function AdminLayout(): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-surface">
            <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 z-40 shadow-xl">
                <Sidebar />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 h-full">
                        <Sidebar onNav={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-champagne-300/40 sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between shadow-sm">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-primary p-2 hover:bg-champagne-100 rounded-full" aria-label="Menu">
                        <Icon name="menu" className="text-2xl" />
                    </button>
                    <h2 className="font-headline-md text-2xl text-primary font-semibold">Admin Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 border border-champagne-300">
                            <Icon name="notifications" className="text-xl" />
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-10 max-w-container-max mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
