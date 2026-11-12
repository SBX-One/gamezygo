import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  type WishlistQueryParams,
} from "@/services/wishlist.service";

export const WISHLIST_KEYS = {
  all: ["wishlist"] as const,
  list: (params?: WishlistQueryParams) => [...WISHLIST_KEYS.all, "list", params] as const,
};

/**
 * Hook to fetch user's wishlist
 */
export function useWishlist(
  params?: WishlistQueryParams,
  options?: { enabled?: boolean }
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: WISHLIST_KEYS.list(params),
    queryFn: () => fetchWishlist(params),
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Hook to add a product to wishlist
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
    },
  });
}

/**
 * Hook to remove a product from wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
    },
  });
}
