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
            <nav className="fixed top-0 w-full z-50 h-20 flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white/75 backdrop-blur-xl border-b border-champagne-300/40 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-10">
                    <Link to="/" className="font-headline-md text-[24px] md:text-[28px] leading-tight tracking-tight text-primary hover:opacity-90 transition-opacity flex flex-col">
                        <span>Ashnoor Mirror Store</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/shop" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md tracking-widest uppercase">Collections</Link>
                    <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md tracking-widest uppercase">About</Link>
                    <Link to="/contact" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md tracking-widest uppercase">Contact</Link>
                </div>

                <div className="flex items-center gap-3">
                    {user?.role === "ADMIN" ? (
                        <Link to="/admin/dashboard" className="bg-champagne-100/80 text-primary border border-champagne-300 px-3.5 py-2 rounded-xl font-label-md text-xs uppercase tracking-wider font-bold hidden md:flex items-center gap-1.5 hover:bg-champagne-200 transition-all shadow-sm" title="Go to Admin Panel">
                            <Icon name="admin_panel_settings" className="text-lg text-champagne-700" /> Admin Panel
                        </Link>
                    ) : user ? (
                        <Link to="/account" className="bg-champagne-100/80 text-primary border border-champagne-300 px-3.5 py-2 rounded-xl font-label-md text-xs uppercase tracking-wider font-bold hidden md:flex items-center gap-1.5 hover:bg-champagne-200 transition-all shadow-sm" title="Ashnoor Customer Portal">
                            <Icon name="dashboard" className="text-lg text-champagne-700" /> Customer Portal
                        </Link>
                    ) : null}
                    <Link to="/account/wishlist" className="text-primary hover:bg-champagne-100/60 transition-all duration-300 p-2.5 rounded-full" aria-label="Wishlist">
                        <Icon name="favorite" className="text-xl" />
                    </Link>
                    <Link to={user ? "/cart" : "/login"} className="relative text-primary hover:bg-champagne-100/60 transition-all duration-300 p-2.5 rounded-full" aria-label="Cart">
                        <Icon name="shopping_bag" className="text-xl" />
                        {cart && cart.itemCount > 0 && (
                            <span className="absolute top-1 right-1 bg-champagne-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                {cart.itemCount}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <button onClick={handleLogout} className="text-primary hover:bg-champagne-100/60 transition-all duration-300 p-2.5 rounded-full hidden md:flex items-center justify-center" aria-label="Logout" title="Logout">
                            <Icon name="logout" className="text-xl" />
                        </button>
                    ) : (
                        <Link to="/login" className="text-primary hover:bg-champagne-100/60 transition-all duration-300 p-2.5 rounded-full hidden md:flex items-center justify-center" aria-label="Account">
                            <Icon name="account_circle" className="text-xl" />
                        </Link>
                    )}
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-primary p-2 hover:bg-champagne-100/60 rounded-full transition-colors" aria-label="Menu">
                        <Icon name="menu" className="text-2xl" />
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
                    <div className="relative h-full w-80 bg-surface p-8 flex flex-col gap-4 shadow-2xl border-l border-champagne-300/40">
                        <div className="flex items-center justify-between pb-4 border-b border-champagne-300/30">
                            <span className="font-headline-md text-xl text-primary font-bold">Ashnoor Mirror Store</span>
                            <button onClick={() => setMobileOpen(false)} className="text-primary p-2 hover:bg-champagne-100/80 rounded-full transition-colors" aria-label="Close">
                                <Icon name="close" className="text-xl" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {user?.role === "ADMIN" ? (
                                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-xl font-label-md text-xs text-primary bg-champagne-100/80 hover:bg-champagne-200 transition-colors uppercase tracking-widest font-bold flex items-center gap-2 mb-2 border border-champagne-300">
                                    <Icon name="admin_panel_settings" className="text-lg text-champagne-700" /> Admin Panel
                                </Link>
                            ) : user ? (
                                <Link to="/account" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-xl font-label-md text-xs text-primary bg-champagne-100/80 hover:bg-champagne-200 transition-colors uppercase tracking-widest font-bold flex items-center gap-2 mb-2 border border-champagne-300">
                                    <Icon name="dashboard" className="text-lg text-champagne-700" /> Customer Portal
                                </Link>
                            ) : null}
                            <Link to="/shop" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface hover:bg-champagne-100/60 transition-colors uppercase tracking-widest">Collections</Link>
                            <Link to="/about" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface hover:bg-champagne-100/60 transition-colors uppercase tracking-widest">About</Link>
                            <Link to="/contact" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface hover:bg-champagne-100/60 transition-colors uppercase tracking-widest">Contact</Link>
                            <Link to="/account/wishlist" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface hover:bg-champagne-100/60 transition-colors uppercase tracking-widest">Wishlist</Link>
                            {user ? (
                                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="py-3 px-4 rounded-lg text-left font-label-md text-label-md text-error hover:bg-error/10 transition-colors uppercase tracking-widest">Logout</button>
                            ) : (
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface hover:bg-champagne-100/60 transition-colors uppercase tracking-widest">Login / Register</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
