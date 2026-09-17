import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // sends the httpOnly refreshToken cookie
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
    accessToken = token;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
    const response = await axios.post<{ data: { accessToken: string } }>(
        "http://localhost:5000/api/auth/refresh",
        {},
        { withCredentials: true },
    );
    const newToken = response.data.data.accessToken;
    setAccessToken(newToken);
    return newToken;
}

export function getRefreshPromise(): Promise<string> {
    refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
    });
    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const url = originalRequest.url || "";
        const isAuthFormEndpoint = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/google");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthFormEndpoint) {
            originalRequest._retry = true;

            try {
                const newToken = await getRefreshPromise();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                setAccessToken(null);
                window.location.href = "/login";
                return Promise.reject(refreshError as Error);
            }
        }

        return Promise.reject(error);
    },
);