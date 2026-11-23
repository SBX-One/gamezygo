import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/use-auth-store";
import { MOCK_TOKEN } from "@/lib/mock/data";

export const getBaseUrl = (): string => {
  const envUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  // Di browser (client-side): jika tidak diset atau mengarah ke localhost/relatif, gunakan /api/v1
  if (typeof window !== "undefined") {
    if (!envUrl || envUrl.includes("localhost:8000") || envUrl.startsWith("/")) {
      return "/api/v1";
    }
    return envUrl;
  }

  // Di server (SSR Node.js): gunakan URL backend internal absolut
  const serverBackendUrl =
    process.env.BACKEND_INTERNAL_URL ||
    (envUrl && !envUrl.startsWith("/") ? envUrl : "http://localhost:8000");

  return serverBackendUrl.endsWith("/api/v1")
    ? serverBackendUrl
    : `${serverBackendUrl}/api/v1`;
};

export const API_BASE_URL = getBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Append Authorization Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attempt retrieving token from Zustand store
    let token = useAuthStore.getState().token;

    // Direct fallback from localStorage if Zustand has not yet hydrated into memory
    if (!token && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("gamezygo-auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.state?.token || null;
        }
        if (!token) {
          token = localStorage.getItem("gamezygo-admin-token");
        }
      } catch {
        // ignore JSON parse errors
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle global errors (401 with Silent Refresh / Login Redirect)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const { token, refreshToken, setToken, logout, role } = useAuthStore.getState();

      // If user/admin is operating with a mock/offline token, DO NOT wipe session on backend 401
      if (!token || token === MOCK_TOKEN || token.startsWith("mock-")) {
        return Promise.reject(error);
      }

      const isAdminRequest =
        Boolean(originalRequest?.url?.includes("/admin/")) &&
        !originalRequest?.url?.includes("/admin/login");

      // -----------------------------------------------------------------
      // Admin Token Refresh Flow
      // -----------------------------------------------------------------
      if (isAdminRequest || (role === "admin" && originalRequest?.url?.includes("/admin/"))) {
        // If refresh endpoint itself failed or retry already attempted, invalidate session
        if (originalRequest?._retry || originalRequest?.url?.includes("/admin/refresh")) {
          logout();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${redirectPath}`;
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/admin/refresh`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const newToken =
            refreshResponse.data?.data?.token ||
            refreshResponse.data?.token ||
            refreshResponse.data?.data?.access_token;

          if (newToken) {
            setToken(newToken);
            processQueue(null, newToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          } else {
            processQueue(new Error("No new admin token returned"), null);
            logout();
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
              const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
              window.location.href = `/login?redirect=${redirectPath}`;
            }
            return Promise.reject(error);
          }
        } catch (adminRefreshErr) {
          processQueue(adminRefreshErr, null);
          logout();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${redirectPath}`;
          }
          return Promise.reject(adminRefreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      // -----------------------------------------------------------------
      // User / Customer Token Refresh Flow
      // -----------------------------------------------------------------
      if (!originalRequest?._retry) {
        // If already on the refresh endpoint, refresh failed - logout
        if (originalRequest?.url?.includes("/auth/refresh")) {
          logout();
          return Promise.reject(error);
        }

        // If no refresh token is available (e.g. Laravel Sanctum bearer tokens without refresh endpoint)
        if (!refreshToken) {
          const isCoreAuthCheck =
            originalRequest?.url?.includes("/user/profile") ||
            originalRequest?.url?.includes("/auth/me");

          if (isCoreAuthCheck) {
            logout();
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newToken =
            refreshResponse.data?.data?.token ||
            refreshResponse.data?.token ||
            refreshResponse.data?.data?.access_token;

          if (newToken) {
            setToken(newToken);
            processQueue(null, newToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          } else {
            processQueue(new Error("No new token returned"), null);
            logout();
            return Promise.reject(error);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          logout();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
  * Type-safe HTTP request wrappers returning response.data
  */
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function apiPost<T, B = unknown>(
  url: string,
  data?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T, B = unknown>(
  url: string,
  data?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function apiPatch<T, B = unknown>(
  url: string,
  data?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

export default apiClient;
