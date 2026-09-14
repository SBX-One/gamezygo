import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "@/types";
import { MOCK_USER, MOCK_TOKEN } from "@/lib/mock/data";

/**
 * Usage Example:
 * 
 * const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();
 * or for performance:
 * const user = useAuthUser();
 * const isAuthenticated = useIsAuthenticated();
 */

export interface AuthState {
  user: User | null;
  token: string | null;
  role: "guest" | "user" | "admin";
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: { email: string }) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        role: "guest",
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            // TODO: Integrate real Laravel API endpoint here.
            // Endpoint: POST /api/v1/auth/login or POST /api/v1/orders/checkout auth interceptor
            // Target API client in src/services/auth.ts
            // Currently utilizing temporary mock data from src/lib/mock/data.ts
            
            // Simulating API latency
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (!credentials.email) {
              throw new Error("Email is required");
            }

            const mappedRole: "guest" | "user" | "admin" = 
              MOCK_USER.role === "admin" ? "admin" : "user";

            set({
              user: MOCK_USER,
              token: MOCK_TOKEN,
              role: mappedRole,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to login";
            set({
              error: message,
              isLoading: false,
            });
            throw err;
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
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

        setUser: (user) => {
          set({
            user,
            role: user ? (user.role === "admin" ? "admin" : "user") : "guest",
            isAuthenticated: Boolean(user),
          });
        },

        updateUser: (updatedFields) => {
          set((state) => {
            const updatedUser = state.user ? { ...state.user, ...updatedFields } : null;
            const updatedRole = updatedUser 
              ? (updatedUser.role === "admin" ? "admin" : "user" as const)
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
        // Only persist serializable auth data
        partialize: (state) => ({
          user: state.user,
          token: state.token,
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
