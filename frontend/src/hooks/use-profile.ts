import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "@/services/profile.service";
import type { UserProfileResponse, ChangePasswordPayload } from "@/types";

export const PROFILE_KEYS = {
  all: ["user-profile"] as const,
};

/**
 * Hook to fetch current user's profile
 */
export function useUserProfile(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: PROFILE_KEYS.all,
    queryFn: () => fetchUserProfile(),
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<UserProfileResponse> | FormData) =>
      updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

/**
 * Hook to change user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changeUserPassword(payload),
  });
}
