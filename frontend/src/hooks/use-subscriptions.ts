import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchSubscriptionPlans,
  fetchUserSubscription,
  fetchSubscriptionProducts,
  type SubscriptionProductsParams,
} from "@/services/subscriptions.service";

export const SUBSCRIPTION_KEYS = {
  all: ["subscriptions"] as const,
  plans: () => [...SUBSCRIPTION_KEYS.all, "plans"] as const,
  active: () => [...SUBSCRIPTION_KEYS.all, "active"] as const,
  products: (params?: number | SubscriptionProductsParams) =>
    [...SUBSCRIPTION_KEYS.all, "products", params] as const,
  infiniteProducts: (params?: Omit<SubscriptionProductsParams, "page">) =>
    [...SUBSCRIPTION_KEYS.all, "products", "infinite", params] as const,
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
export function useSubscriptionProducts(
  params?: number | SubscriptionProductsParams
) {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.products(params),
    queryFn: () => fetchSubscriptionProducts(params),
  });
}

/**
 * Hook to fetch subscription games incrementally for infinite scroll
 */
export function useInfiniteSubscriptionProducts(
  params?: Omit<SubscriptionProductsParams, "page">
) {
  return useInfiniteQuery({
    queryKey: SUBSCRIPTION_KEYS.infiniteProducts(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchSubscriptionProducts({ ...params, page: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (meta && meta.current_page < meta.last_page) {
        return meta.current_page + 1;
      }
      return undefined;
    },
  });
}
