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
  return apiGet<ApiPaginatedResponse<ReviewItem>>(`/reviews${qs}`);
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
    headers: { "Content-Type": "multipart/form-data" },
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
      headers: { "Content-Type": "multipart/form-data" },
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
