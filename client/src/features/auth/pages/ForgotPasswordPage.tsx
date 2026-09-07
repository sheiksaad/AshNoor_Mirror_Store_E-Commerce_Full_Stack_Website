import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/auth.schema";
import { forgotPasswordRequest } from "../api/auth.api";
import { Icon } from "@/components/Icon";
import type { JSX } from "react/jsx-runtime";


export function ForgotPasswordPage(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });
    const mutation = useMutation({ mutationFn: forgotPasswordRequest });

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-margin-mobile pt-20">
            <div className="w-full max-w-md py-stack-xl">
                <div className="text-center mb-stack-xl">
                    <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight mb-stack-sm">Ashnoor</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Reset your password.</p>
                </div>

                {mutation.isSuccess ? (
                    <div className="flex flex-col items-center text-center">
                        <Icon name="mark_email_read" className="text-[32px] text-secondary mb-4" />
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            If an account exists with that email, a reset code has been sent.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-stack-md">
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface mb-2">Email</label>
                            <input {...register("email")} type="email" placeholder="your@email.com" className="w-full border-0 border-b border-tertiary-fixed-dim bg-transparent py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-fixed" />
                            {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
                        </div>
                        <button type="submit" disabled={mutation.isPending} className="w-full bg-primary text-on-primary py-4 font-label-md text-label-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all disabled:opacity-50">
                            {mutation.isPending ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}