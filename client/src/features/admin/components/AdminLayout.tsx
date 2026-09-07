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
        <div className="flex flex-col h-full bg-primary-container text-on-primary-fixed py-stack-md">
            <div className="px-6 pb-8 border-b border-outline-variant/20 mb-4 flex flex-col items-center">
                <h1 className="text-secondary-fixed font-headline-md text-headline-md">Ashnoor</h1>
                <p className="font-caption text-caption text-on-primary-container mt-1">Management Portal</p>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNav}
                        className={({ isActive }) =>
                            `rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 font-label-md text-label-md transition-colors ${isActive ? "bg-secondary-fixed text-on-secondary-fixed" : "text-on-primary-container hover:bg-white/10"
                            }`
                        }
                    >
                        <Icon name={item.icon} />
                        {item.label}
                    </NavLink>
                ))}
            </div>
            <div className="px-4 mt-auto pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-label-md text-label-md text-on-secondary-fixed">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-label-md text-label-md text-on-primary-fixed">{user?.name}</p>
                        <p className="font-caption text-caption text-on-primary-container">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full bg-secondary-fixed text-primary font-label-md text-label-md py-3 rounded-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Icon name="logout" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export function AdminLayout(): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 z-40">
                <Sidebar />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 h-full">
                        <Sidebar onNav={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 md:ml-64">
                <header className="h-20 bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-variant sticky top-0 z-30 px-gutter flex items-center justify-between">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-primary"><Icon name="menu" /></button>
                    <h2 className="font-headline-md text-headline-md text-primary hidden md:block">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button className="text-on-surface-variant hover:text-primary"><Icon name="notifications" /></button>
                    </div>
                </header>
                <div className="p-gutter md:p-margin-desktop max-w-container-max mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}