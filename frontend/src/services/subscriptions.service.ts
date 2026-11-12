import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  SubscriptionPlan,
  UserActiveSubscription,
  SubscriptionProductItem,
} from "@/types";

export interface SubscriptionProductsParams {
  page?: number;
  search?: string;
  genre_categories?: string[];
}

/**
 * Fetch available subscription plans
 * Endpoint: GET /api/v1/subscriptions
 */
export async function fetchSubscriptionPlans(): Promise<
  ApiResponse<SubscriptionPlan[]>
> {
  return apiGet<ApiResponse<SubscriptionPlan[]>>("/subscriptions");
}

/**
 * Fetch user's currently active subscription
 * Endpoint: GET /api/v1/user/subscriptions
 */
export async function fetchUserSubscription(): Promise<
  ApiResponse<UserActiveSubscription | null>
> {
  return apiGet<ApiResponse<UserActiveSubscription | null>>(
    "/user/subscriptions"
  );
}

/**
 * Fetch products included in subscription bundle
 * Endpoint: GET /api/v1/user/subscriptions/products
 */
export async function fetchSubscriptionProducts(
  paramsOrPage?: number | SubscriptionProductsParams
): Promise<ApiPaginatedResponse<SubscriptionProductItem>> {
  const params: SubscriptionProductsParams =
    typeof paramsOrPage === "number"
      ? { page: paramsOrPage }
      : paramsOrPage || {};

  const queryParts: string[] = [];
  if (params.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }
  if (params.genre_categories && params.genre_categories.length > 0) {
    params.genre_categories.forEach((cat, idx) => {
      queryParts.push(`genre_categories[${idx}]=${encodeURIComponent(cat)}`);
    });
  }
  if (params.page) {
    queryParts.push(`page=${params.page}`);
  }

  const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  return apiGet<ApiPaginatedResponse<SubscriptionProductItem>>(
    `/user/subscriptions/products${query}`
  );
}
