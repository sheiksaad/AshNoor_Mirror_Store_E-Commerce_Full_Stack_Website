import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { registerRequest, googleAuthRequest } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@/components/Icon";
import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from "@/config/google";
import type { JSX } from "react";

export function RegisterPage(): JSX.Element {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            const user = await registerRequest(values);
            setUser(user);
            toast.success("Account created successfully");
            navigate("/");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Registration failed. Try a different email.";
            toast.error(message);
        }
    };

    const handleGoogleCredential = async (credential: string) => {
        setIsGoogleLoading(true);
        try {
            const user = await googleAuthRequest(credential);
            setUser(user);
            toast.success(`Welcome, ${user.name}`);
            navigate("/");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Google sign in failed";
            toast.error(message);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    useEffect(() => {
        const win = window as any;
        if (win.google?.accounts?.id && isGoogleAuthConfigured()) {
            try {
                win.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (response: any) => {
                        if (response.credential) {
                            handleGoogleCredential(response.credential);
                        }
                    },
                });
            } catch (err) {
                console.error("Error initializing Google Identity Services:", err);
            }
        }
    }, []);

    const handleGoogleLogin = () => {
        if (!isGoogleAuthConfigured()) {
            toast.error("Google Client ID is missing or invalid. Please check VITE_GOOGLE_CLIENT_ID in your environment configuration.");
            return;
        }
        const win = window as any;
        if (win.google?.accounts?.id) {
            try {
                win.google.accounts.id.prompt();
            } catch (err: any) {
                toast.error("Could not trigger Google Sign-In prompt. Please try again.");
            }
        } else {
            toast.error("Google Sign-In is still loading or unavailable.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-16">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-champagne-300/50 shadow-premium">
                <div className="text-center mb-8">
                    <h1 className="font-display-lg text-3xl md:text-4xl text-primary font-bold tracking-tight mb-2">Ashnoor</h1>
                    <p className="font-body-md text-on-surface-variant text-sm">Create your gallery account.</p>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full flex items-center justify-center gap-3 border border-champagne-300 bg-white hover:bg-champagne-100/30 text-primary py-3.5 px-4 rounded-xl font-label-md text-sm font-semibold transition-all shadow-sm mb-6 disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.31 7.25 24 12 24z" />
                        <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7s.43 3.57 1.19 5.1l4.08-2.56z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.25 0 3.17 2.69 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-champagne-300/40"></div>
                    <span className="flex-shrink mx-4 text-on-surface-variant font-caption text-xs uppercase tracking-widest">or register with email</span>
                    <div className="flex-grow border-t border-champagne-300/40"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block font-label-md text-xs text-primary font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                        <input {...register("name")} placeholder="Your name" className="w-full border border-champagne-300/70 rounded-xl bg-surface-container-low/50 px-4 py-3 font-body-md text-sm focus:outline-none focus:border-champagne-500 focus:bg-white transition-all" />
                        {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block font-label-md text-xs text-primary font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                        <input {...register("email")} type="email" placeholder="your@email.com" className="w-full border border-champagne-300/70 rounded-xl bg-surface-container-low/50 px-4 py-3 font-body-md text-sm focus:outline-none focus:border-champagne-500 focus:bg-white transition-all" />
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block font-label-md text-xs text-primary font-bold uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input {...register("phone")} placeholder="03001234567" className="w-full border border-champagne-300/70 rounded-xl bg-surface-container-low/50 px-4 py-3 font-body-md text-sm focus:outline-none focus:border-champagne-500 focus:bg-white transition-all" />
                        {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block font-label-md text-xs text-primary font-bold uppercase tracking-wider mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full border border-champagne-300/70 rounded-xl bg-surface-container-low/50 px-4 py-3 pr-12 font-body-md text-sm focus:outline-none focus:border-champagne-500 focus:bg-white transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <Icon
                                    name={showPassword ? "visibility_off" : "visibility"}
                                    className="text-lg"
                                />
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-gold text-charcoal-900 py-4 rounded-xl font-label-md text-sm uppercase tracking-widest shadow-md hover:shadow-luxury-glow transition-all disabled:opacity-50 font-bold mt-2"
                    >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-8 text-center font-caption text-xs text-on-surface-variant">
                    Already have an account? <Link to="/login" className="text-champagne-700 font-bold hover:underline ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
