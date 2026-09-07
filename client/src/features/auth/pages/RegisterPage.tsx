import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { registerRequest } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-runtime";

export function RegisterPage(): JSX.Element {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

    const mutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: (user) => {
            setUser(user);
            toast.success("Account created successfully");
            navigate("/");
        },
        onError: () => toast.error("Registration failed. Try a different email."),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-margin-mobile pt-20">
            <div className="w-full max-w-md py-stack-xl">
                <div className="text-center mb-stack-xl">
                    <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight mb-stack-sm">Ashnoor</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Create your account.</p>
                </div>
                <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-stack-md">
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-2">Full Name</label>
                        <input {...register("name")} placeholder="Your name" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                        {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-2">Email</label>
                        <input {...register("email")} type="email" placeholder="your@email.com" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                        {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-2">Password</label>
                        <input {...register("password")} type="password" placeholder="••••••••" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                        {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
                    </div>
                    <button type="submit" disabled={mutation.isPending} className="w-full bg-primary text-on-primary py-4 font-label-md text-label-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all disabled:opacity-50">
                        {mutation.isPending ? "Creating account..." : "Create Account"}
                    </button>
                </form>
                <p className="mt-stack-lg text-center font-caption text-caption text-on-surface-variant">
                    Already have an account? <Link to="/login" className="text-primary font-label-md text-label-md hover:underline ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    );
}