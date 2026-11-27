import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type { ApiResponse, ApiPaginatedResponse, ReviewItem } from "@/types";

/**
 * Fetch approved customer reviews (Guest & Public)
 * Endpoint (user.php): GET /api/v1/reviews
 */
export async function fetchReviews(
  params?: { page?: number }
): Promise<ApiPaginatedResponse<ReviewItem>> {
  const qs = params?.page ? `?page=${params.page}` : "";
  const raw = await apiGet<unknown>(`/reviews${qs}`);
  const r = raw as {
    success?: boolean;
    message?: string;
    data?: ReviewItem[] | { data?: ReviewItem[]; reviews?: ReviewItem[]; meta?: ApiPaginatedResponse<ReviewItem>["meta"] };
    meta?: ApiPaginatedResponse<ReviewItem>["meta"];
  };

  let items: ReviewItem[] = [];
  let meta = r?.meta;
  if (Array.isArray(r?.data)) {
    items = r.data;
  } else if (r?.data && typeof r.data === "object") {
    if (Array.isArray(r.data.data)) {
      items = r.data.data;
    } else if (Array.isArray(r.data.reviews)) {
      items = r.data.reviews;
    }
    meta = meta || r.data.meta;
  }

  return {
    success: r?.success ?? true,
    message: r?.message ?? "",
    data: items,
    meta: meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: items.length || 10,
      total: items.length,
      from: items.length > 0 ? 1 : 0,
      to: items.length,
    },
  };
}

/**
 * Fetch authenticated user's own reviews
 * Endpoint (user.php): GET /api/v1/user/reviews
 */
export async function fetchUserReviews(): Promise<ApiResponse<ReviewItem[]>> {
  return apiGet<ApiResponse<ReviewItem[]>>("/user/reviews");
}

/**
 * Submit a new game review
 * Endpoint: POST /api/v1/user/reviews
 * FormData fields per Postman: rating, review, images[]
 */
export async function createReview(
  formData: FormData
): Promise<ApiResponse<ReviewItem>> {
  return apiPost<ApiResponse<ReviewItem>, FormData>("/user/reviews", formData, {
    headers: { "Content-Type": undefined },
  });
}

/**
 * Update an existing review
 * Endpoint: PUT /api/v1/user/reviews/:reviewId
 */
export async function updateReview(
  reviewId: number | string,
  formData: FormData
): Promise<ApiResponse<ReviewItem>> {
  return apiPut<ApiResponse<ReviewItem>, FormData>(
    `/user/reviews/${reviewId}`,
    formData,
    {
      headers: { "Content-Type": undefined },
    }
  );
}

/**
 * Delete a review
 * Endpoint: DELETE /api/v1/user/reviews/:reviewId
 */
export async function deleteReview(
  reviewId: number | string
): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>(`/user/reviews/${reviewId}`);
}
