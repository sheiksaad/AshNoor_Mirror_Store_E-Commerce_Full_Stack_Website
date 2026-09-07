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
        <div className="flex min-h-screen bg-background">
            <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-primary-container py-stack-md z-40">
                <div className="px-6 mb-stack-lg">
                    <h1 className="text-secondary-fixed font-headline-md text-headline-md">Ashnoor</h1>
                </div>
                <div className="px-6 mb-stack-md flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center font-label-md text-label-md text-on-secondary-fixed">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-on-primary-fixed font-label-md text-label-md">{user?.name}</p>
                        <p className="text-on-primary-container font-caption text-caption">Customer Account</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-1 px-4">
                    {TABS.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) =>
                                `rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 font-label-md text-label-md transition-colors ${isActive ? "bg-secondary-fixed text-on-secondary-fixed" : "text-on-primary-container hover:bg-white/10"
                                }`
                            }
                        >
                            <Icon name={tab.icon} />
                            {tab.label}
                        </NavLink>
                    ))}
                </div>
                <div className="px-6 mt-auto">
                    <button onClick={handleLogout} className="w-full border border-outline text-on-primary-container py-2 rounded font-label-md text-label-md hover:text-on-primary-fixed hover:border-on-primary-fixed transition-colors flex items-center justify-center gap-2">
                        <Icon name="logout" className="text-sm" />
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pt-24 md:pt-margin-desktop">
                <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant pb-stack-sm">
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Welcome back, {user?.name}</h2>
                </div>
                <Outlet />
            </main>
        </div>
    );
}