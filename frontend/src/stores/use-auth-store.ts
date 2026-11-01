import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import type { User } from "@/types";
import type { AuthLoginPayload, AuthRegisterPayload } from "@/types/api";
import { loginApi, registerApi, logoutApi } from "@/services/auth.service";
import { MOCK_USER, MOCK_TOKEN } from "@/lib/mock/data";

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: "guest" | "user" | "admin";
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: AuthLoginPayload) => Promise<void>;
  register: (payload: AuthRegisterPayload) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        refreshToken: null,
        role: "guest",
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            if (!credentials.email) {
              throw new Error("Email is required");
            }

            try {
              const res = await loginApi({
                email: credentials.email,
                password: credentials.password || "password",
              });

              const apiData = res?.data;
              const token =
                apiData?.token ||
                apiData?.access_token ||
                (res as unknown as { token?: string })?.token ||
                MOCK_TOKEN;
              const refreshToken = apiData?.refresh_token || null;
              const apiUser = apiData?.user;

              const mappedUser: User = apiUser
                ? {
                    id: String(apiUser.id),
                    name: apiUser.name || credentials.email.split("@")[0],
                    email: apiUser.email || credentials.email,
                    role: apiUser.role === "admin" ? "admin" : "customer",
                    avatarUrl: apiUser.avatar_url || MOCK_USER.avatarUrl,
                  }
                : {
                    ...MOCK_USER,
                    email: credentials.email,
                  };

              const mappedRole: "guest" | "user" | "admin" =
                mappedUser.role === "admin" ? "admin" : "user";

              set({
                user: mappedUser,
                token,
                refreshToken,
                role: mappedRole,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            } catch (apiErr) {
              // If backend returned explicit 401/422 validation error, surface it
              if (
                axios.isAxiosError(apiErr) &&
                apiErr.response &&
                (apiErr.response.status === 401 || apiErr.response.status === 422)
              ) {
                const msg =
                  (apiErr.response.data as { message?: string })?.message ||
                  "Email atau password tidak valid.";
                throw new Error(msg);
              }
              // Otherwise fallback gracefully to mock user when backend is offline
            }

            const mappedRole: "guest" | "user" | "admin" =
              MOCK_USER.role === "admin" ? "admin" : "user";

            set({
              user: {
                ...MOCK_USER,
                email: credentials.email,
              },
              token: MOCK_TOKEN,
              role: mappedRole,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Failed to login";
            set({
              error: message,
              isLoading: false,
            });
            throw err;
          }
        },

        register: async (payload) => {
          set({ isLoading: true, error: null });
          try {
            try {
              const res = await registerApi(payload);
              const apiData = res?.data;
              const token =
                apiData?.token ||
                apiData?.access_token ||
                (res as unknown as { token?: string })?.token ||
                MOCK_TOKEN;
              const refreshToken = apiData?.refresh_token || null;
              const apiUser = apiData?.user;

              const mappedUser: User = apiUser
                ? {
                    id: String(apiUser.id),
                    name: apiUser.name || payload.name,
                    email: apiUser.email || payload.email,
                    role: apiUser.role === "admin" ? "admin" : "customer",
                    avatarUrl: apiUser.avatar_url || MOCK_USER.avatarUrl,
                  }
                : {
                    ...MOCK_USER,
                    name: payload.name,
                    email: payload.email,
                  };

              const mappedRole: "guest" | "user" | "admin" =
                mappedUser.role === "admin" ? "admin" : "user";

              set({
                user: mappedUser,
                token,
                refreshToken,
                role: mappedRole,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            } catch (apiErr) {
              if (
                axios.isAxiosError(apiErr) &&
                apiErr.response &&
                apiErr.response.status === 422
              ) {
                const msg =
                  (apiErr.response.data as { message?: string })?.message ||
                  "Data pendaftaran tidak valid.";
                throw new Error(msg);
              }
            }

            // Fallback when backend is offline
            set({
              user: {
                ...MOCK_USER,
                name: payload.name,
                email: payload.email,
              },
              token: MOCK_TOKEN,
              role: "user",
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Failed to register";
            set({
              error: message,
              isLoading: false,
            });
            throw err;
          }
        },

        logout: () => {
          const currentToken = get().token;
          if (currentToken && currentToken !== MOCK_TOKEN) {
            logoutApi().catch(() => {
              // Ignore network/401 errors during logout cleanup
            });
          }
          set({
            user: null,
            token: null,
            refreshToken: null,
            role: "guest",
            isAuthenticated: false,
          });
        },

        setToken: (token) => {
          set({
            token,
            isAuthenticated: Boolean(token),
          });
        },

        setRefreshToken: (refreshToken) => {
          set({
            refreshToken,
          });
        },

        setUser: (user) => {
          set({
            user,
            role: user ? (user.role === "admin" ? "admin" : "user") : "guest",
            isAuthenticated: Boolean(user),
          });
        },

        updateUser: (updatedFields) => {
          set((state) => {
            const updatedUser = state.user
              ? { ...state.user, ...updatedFields }
              : null;
            const updatedRole = updatedUser
              ? updatedUser.role === "admin"
                ? ("admin" as const)
                : ("user" as const)
              : ("guest" as const);
            return {
              user: updatedUser,
              role: updatedRole,
            };
          });
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "gamezygo-auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          role: state.role,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);

// Performance-optimized selector hooks
export const useAuthUser = () => useAuthStore((s) => s.user);
export const useAuthToken = () => useAuthStore((s) => s.token);
export const useAuthRole = () => useAuthStore((s) => s.role);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);
export const useAuthError = () => useAuthStore((s) => s.error);
