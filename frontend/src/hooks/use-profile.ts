import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateUserProfile,
} from "@/services/profile.service";
import type { UserProfileResponse } from "@/types";

export const PROFILE_KEYS = {
  all: ["user-profile"] as const,
};

/**
 * Hook to fetch current user's profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: PROFILE_KEYS.all,
    queryFn: () => fetchUserProfile(),
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<UserProfileResponse>) =>
      updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}
