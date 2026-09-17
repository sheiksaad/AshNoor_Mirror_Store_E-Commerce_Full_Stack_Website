import { api, setAccessToken } from "@/lib/axios";
import type { RegisterFormValues, LoginFormValues, ForgotPasswordFormValues } from "../schemas/auth.schema";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
}

interface AuthResponseData {
    user: AuthUser;
    accessToken: string;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function registerRequest(input: RegisterFormValues): Promise<AuthUser> {
    const { data } = await api.post<ApiEnvelope<AuthResponseData>>("/auth/register", input);
    setAccessToken(data.data.accessToken);
    return data.data.user;
}

export async function loginRequest(input: LoginFormValues): Promise<AuthUser> {
    const { data } = await api.post<ApiEnvelope<AuthResponseData>>("/auth/login", input);
    setAccessToken(data.data.accessToken);
    return data.data.user;
}

export async function logoutRequest(): Promise<void> {
    await api.post("/auth/logout");
    setAccessToken(null);
}

export async function forgotPasswordRequest(input: ForgotPasswordFormValues): Promise<void> {
    await api.post("/auth/forgot-password", input);
}

export async function googleAuthRequest(idToken: string): Promise<AuthUser> {
    const { data } = await api.post<ApiEnvelope<AuthResponseData>>("/auth/google", { idToken });
    setAccessToken(data.data.accessToken);
    return data.data.user;
}