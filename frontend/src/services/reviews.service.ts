import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type { ApiResponse, ReviewItem } from "@/types";

/**
 * Fetch approved customer reviews
 * Endpoint: GET /api/v1/user/reviews/
 */
export async function fetchReviews(): Promise<ApiResponse<ReviewItem[]>> {
  return apiGet<ApiResponse<ReviewItem[]>>("/user/reviews/");
}

/**
 * Submit a new game review
 * Endpoint: POST /api/v1/user/reviews
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
