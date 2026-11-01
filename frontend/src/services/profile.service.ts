import { apiGet, apiPatch, apiPut } from "@/lib/api-client";
import type {
  ApiResponse,
  UserProfileResponse,
  ChangePasswordPayload,
} from "@/types";

/**
 * Fetch current user profile
 * Endpoint: GET /api/v1/user/profile/
 */
export async function fetchUserProfile(): Promise<
  ApiResponse<UserProfileResponse>
> {
  return apiGet<ApiResponse<UserProfileResponse>>("/user/profile");
}

/**
 * Update user profile
 * Primary Endpoint (Postman user > profile > update): PATCH /api/v1/user/profile
 * Fallback Endpoint: PUT /api/v1/user/profile
 */
export async function updateUserProfile(
  payload: Partial<UserProfileResponse>
): Promise<ApiResponse<UserProfileResponse>> {
  try {
    return await apiPatch<
      ApiResponse<UserProfileResponse>,
      Partial<UserProfileResponse>
    >("/user/profile", payload);
  } catch {
    return apiPut<
      ApiResponse<UserProfileResponse>,
      Partial<UserProfileResponse>
    >("/user/profile", payload);
  }
}

/**
 * Change user password
 * Endpoint (Postman user > profile > change password):
 *   PATCH /api/v1/user/profile/change-password
 */
export async function changeUserPassword(
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> {
  return apiPatch<ApiResponse<null>, ChangePasswordPayload>(
    "/user/profile/change-password",
    payload
  );
}
