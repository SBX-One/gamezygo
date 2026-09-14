import { useQuery } from "@tanstack/react-query";
import {
  fetchSubscriptionPlans,
  fetchUserSubscription,
  fetchSubscriptionProducts,
} from "@/services/subscriptions.service";

export const SUBSCRIPTION_KEYS = {
  all: ["subscriptions"] as const,
  plans: () => [...SUBSCRIPTION_KEYS.all, "plans"] as const,
  active: () => [...SUBSCRIPTION_KEYS.all, "active"] as const,
  products: (page?: number) => [...SUBSCRIPTION_KEYS.all, "products", page] as const,
};

/**
 * Hook to fetch subscription plans
 */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.plans(),
    queryFn: () => fetchSubscriptionPlans(),
  });
}

/**
 * Hook to fetch user's active subscription
 */
export function useUserSubscription() {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.active(),
    queryFn: () => fetchUserSubscription(),
  });
}

/**
 * Hook to fetch games included in subscription
 */
export function useSubscriptionProducts(page?: number) {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.products(page),
    queryFn: () => fetchSubscriptionProducts(page),
  });
}
