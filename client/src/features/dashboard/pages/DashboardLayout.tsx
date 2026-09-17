import { NavLink, Outlet } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { logoutRequest } from "@/features/auth/api/auth.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react"

const TABS = [
    { to: "/account/orders", label: "Orders", icon: "shopping_bag" },
    { to: "/account/addresses", label: "Addresses", icon: "location_on" },
    { to: "/account/profile", label: "Profile", icon: "settings" },
    { to: "/account/wishlist", label: "Wishlist", icon: "favorite" },
];

export function DashboardLayout(): JSX.Element {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    async function handleLogout(): Promise<void> {
        await logoutRequest();
        setUser(null);
        toast.success("Logged out successfully.");
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-charcoal-900 text-white py-8 z-40 border-r border-champagne-500/20 shadow-xl">
                <div className="px-6 mb-8 flex flex-col items-center">
                    <h1 className="text-champagne-500 font-headline-md text-2xl tracking-widest uppercase">Ashnoor</h1>
                    <p className="font-caption text-xs text-gray-400 mt-1 uppercase tracking-wider">Customer Portal</p>
                </div>
                <div className="px-6 mb-8 flex items-center gap-3 bg-white/5 p-3 mx-4 rounded-xl border border-champagne-500/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center font-bold text-charcoal-900 shadow-sm">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-label-md text-sm text-white truncate">{user?.name}</p>
                        <p className="font-caption text-xs text-gray-400 truncate">Customer Account</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-1 px-3">
                    {TABS.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) =>
                                `rounded-xl mx-2 px-4 py-3 flex items-center gap-3 font-label-md text-sm transition-all duration-300 ${isActive ? "bg-gradient-gold text-charcoal-900 font-bold shadow-luxury-glow" : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <Icon name={tab.icon} className="text-xl" />
                            {tab.label}
                        </NavLink>
                    ))}
                </div>
                <div className="px-4 mt-auto">
                    <button onClick={handleLogout} className="w-full bg-white/10 text-white font-label-md text-sm py-3 rounded-xl hover:bg-red-500/25 hover:text-red-300 transition-all flex items-center justify-center gap-2 border border-white/10">
                        <Icon name="logout" className="text-lg" />
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="flex-1 md:ml-64 p-6 md:p-12 max-w-container-max mx-auto w-full pt-28 md:pt-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-champagne-300/40 pb-6">
                    <div>
                        <span className="font-caption text-xs uppercase tracking-[0.2em] text-champagne-700 mb-1 block">Account Dashboard</span>
                        <h2 className="font-headline-lg text-3xl text-primary font-bold">Welcome back, {user?.name}</h2>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
}
