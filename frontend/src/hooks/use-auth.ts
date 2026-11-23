import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  logoutApi,
  fetchGoogleAuthRedirect,
} from "@/services/auth.service";
import type { AuthLoginPayload, AuthRegisterPayload } from "@/types/api";
import { useAuthStore } from "@/stores/use-auth-store";
import { PROFILE_KEYS } from "./use-profile";
import { CART_KEYS } from "./use-cart";

export function useLogin() {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: AuthLoginPayload) => {
      await loginStore(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const registerStore = useAuthStore((s) => s.register);

  return useMutation({
    mutationFn: async (payload: AuthRegisterPayload) => {
      await registerStore(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await logoutApi();
      } catch {
        // Proceed with local state cleanup even if token already expired
      }
      logoutStore();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useGoogleAuthRedirect() {
  return useMutation({
    mutationFn: () => fetchGoogleAuthRedirect(),
  });
}

export { loginApi, registerApi, logoutApi };
