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
 * Primary Endpoint: GET /api/v1/subscriptions/
 * Fallback Endpoint: GET /api/v1/user/subscriptions/
 */
export async function fetchSubscriptionPlans(): Promise<
  ApiResponse<SubscriptionPlan[]>
> {
  try {
    return await apiGet<ApiResponse<SubscriptionPlan[]>>("/user/subscriptions");
  } catch {
    return apiGet<ApiResponse<SubscriptionPlan[]>>("/subscriptions");
  }
}

/**
 * Fetch user's currently active subscription
 * Primary Endpoint (Postman user): GET /api/v1/user/profile/subscriptions
 * Fallback Endpoints: GET /api/v1/user/subscriptions or GET /api/v1/user/subscription
 */
export async function fetchUserSubscription(): Promise<
  ApiResponse<UserActiveSubscription | null>
> {
  try {
    return await apiGet<ApiResponse<UserActiveSubscription | null>>(
      "/user/profile/subscriptions"
    );
  } catch {
    return apiGet<ApiResponse<UserActiveSubscription | null>>(
      "/user/subscription"
    );
  }
}

/**
 * Fetch products included in subscription bundle
 * Primary Endpoint (Postman user): GET /api/v1/user/profile/subscription/product
 * Fallback Endpoint: GET /api/v1/user/subscription/product
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

  try {
    return await apiGet<ApiPaginatedResponse<SubscriptionProductItem>>(
      `/user/profile/subscriptions/products${query}`
    );
  } catch {
    return apiGet<ApiPaginatedResponse<SubscriptionProductItem>>(
      `/user/subscriptions/products${query}`
    );
  }
}
