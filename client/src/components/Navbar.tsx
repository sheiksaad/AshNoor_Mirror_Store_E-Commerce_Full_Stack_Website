import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "./Icon";
import { useAuth } from "@/features/auth/context/AuthContext";
import { fetchCart } from "@/features/cart/api/cart.api";
import { logoutRequest } from "@/features/auth/api/auth.api";

export function Navbar(): React.ReactElement {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const { data: cart } = useQuery({ queryKey: ["cart"], queryFn: fetchCart, enabled: Boolean(user) });

    async function handleLogout(): Promise<void> {
        await logoutRequest();
        setUser(null);
        toast.success("Logged out successfully.");
        navigate("/login");
    }

    return (
        <>
            <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white/40 backdrop-blur-xl border-b border-outline-variant/30">
                <div className="flex items-center gap-8">
                    <Link to="/" className="font-headline-md text-[26px] leading-none tracking-tight text-primary">
                        Ashnoor
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/shop" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">Collections</Link>
                    <Link to="/shop?sort=new" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">New Arrivals</Link>
                    <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">About</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/account/wishlist" className="text-primary hover:bg-surface-container-low/50 transition-all duration-300 p-2 rounded-full" aria-label="Wishlist">
                        <Icon name="favorite" />
                    </Link>
                    <Link to={user ? "/cart" : "/login"} className="relative text-primary hover:bg-surface-container-low/50 transition-all duration-300 p-2 rounded-full" aria-label="Cart">
                        <Icon name="shopping_bag" />
                        {cart && cart.itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cart.itemCount}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <button onClick={handleLogout} className="text-primary hover:bg-surface-container-low/50 transition-all duration-300 p-2 rounded-full hidden md:block" aria-label="Account">
                            <Icon name="logout" />
                        </button>
                    ) : (
                        <Link to="/login" className="text-primary hover:bg-surface-container-low/50 transition-all duration-300 p-2 rounded-full hidden md:block" aria-label="Account">
                            <Icon name="account_circle" />
                        </Link>
                    )}
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-primary" aria-label="Menu">
                        <Icon name="menu" />
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex justify-end md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="relative h-full w-72 bg-surface p-6 flex flex-col gap-1">
                        <button onClick={() => setMobileOpen(false)} className="self-end mb-4 text-primary" aria-label="Close">
                            <Icon name="close" />
                        </button>
                        <Link to="/shop" onClick={() => setMobileOpen(false)} className="py-3 font-label-md text-label-md text-on-surface">Collections</Link>
                        <Link to="/about" onClick={() => setMobileOpen(false)} className="py-3 font-label-md text-label-md text-on-surface">About</Link>
                        {user ? (
                            <button onClick={handleLogout} className="py-3 text-left font-label-md text-label-md text-error">Logout</button>
                        ) : (
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="py-3 font-label-md text-label-md text-on-surface">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}