import { apiGet, apiPut } from "@/lib/api-client";
import type { ApiResponse, UserProfileResponse } from "@/types";

/**
 * Fetch current user profile
 * Endpoint: GET /api/v1/user/profile/
 */
export async function fetchUserProfile(): Promise<
  ApiResponse<UserProfileResponse>
> {
  return apiGet<ApiResponse<UserProfileResponse>>("/user/profile/");
}

/**
 * Update user profile
 * Endpoint: PUT /api/v1/user/profile/
 */
export async function updateUserProfile(
  payload: Partial<UserProfileResponse>
): Promise<ApiResponse<UserProfileResponse>> {
  return apiPut<ApiResponse<UserProfileResponse>, Partial<UserProfileResponse>>(
    "/user/profile/",
    payload
  );
}
