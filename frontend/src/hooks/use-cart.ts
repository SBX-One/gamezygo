import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  clearCartApi,
} from "@/services/cart.service";

export const CART_KEYS = {
  all: ["cart"] as const,
  detail: () => [...CART_KEYS.all, "detail"] as const,
};

/**
 * Hook to fetch current user's cart
 */
export function useCart(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: CART_KEYS.detail(),
    queryFn: () => fetchCart(),
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Hook to add a product to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

/**
 * Hook to remove an item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number | string) => removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

/**
 * Hook to clear all items from cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCartApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}
