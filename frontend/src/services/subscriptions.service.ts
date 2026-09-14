import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  SubscriptionPlan,
  UserActiveSubscription,
  SubscriptionProductItem,
} from "@/types";

/**
 * Fetch available subscription plans
 * Endpoint: GET /api/v1/user/subscriptions/
 */
export async function fetchSubscriptionPlans(): Promise<
  ApiResponse<SubscriptionPlan[]>
> {
  return apiGet<ApiResponse<SubscriptionPlan[]>>("/user/subscriptions/");
}

/**
 * Fetch user's currently active subscription
 * Endpoint: GET /api/v1/user/subscription
 */
export async function fetchUserSubscription(): Promise<
  ApiResponse<UserActiveSubscription | null>
> {
  return apiGet<ApiResponse<UserActiveSubscription | null>>("/user/subscription");
}

/**
 * Fetch products included in subscription bundle
 * Endpoint: GET /api/v1/user/subscription/product
 */
export async function fetchSubscriptionProducts(
  page?: number
): Promise<ApiPaginatedResponse<SubscriptionProductItem>> {
  const query = page ? `?page=${page}` : "";
  return apiGet<ApiPaginatedResponse<SubscriptionProductItem>>(
    `/user/subscription/product${query}`
  );
}
