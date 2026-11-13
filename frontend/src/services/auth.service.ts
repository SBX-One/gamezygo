import { apiGet, apiPost, apiDelete, API_BASE_URL } from "@/lib/api-client";
import type {
  ApiResponse,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthResponseData,
  AdminAuthResponseData,
} from "@/types/api";

/**
 * POST /api/v1/auth/login
 * Authenticate user with email & password
 */
export async function loginApi(
  payload: AuthLoginPayload
): Promise<ApiResponse<AuthResponseData>> {
  return apiPost<ApiResponse<AuthResponseData>, AuthLoginPayload>(
    "/auth/login",
    payload
  );
}

/**
 * POST /api/v1/admin/login
 * Authenticate administrator with email & password
 */
export async function adminLoginApi(
  payload: AuthLoginPayload
): Promise<ApiResponse<AdminAuthResponseData>> {
  return apiPost<ApiResponse<AdminAuthResponseData>, AuthLoginPayload>(
    "/admin/login",
    payload
  );
}

/**
 * POST /api/v1/admin/logout
 * Invalidate current admin session token on the backend
 */
export async function adminLogoutApi(): Promise<ApiResponse<null>> {
  return apiPost<ApiResponse<null>>("/admin/logout");
}

/**
 * POST /api/v1/admin/refresh
 * Refresh current admin JWT token
 */
export async function adminRefreshTokenApi(): Promise<
  ApiResponse<{
    token: string;
    token_type?: string;
    expires_in?: number;
  }>
> {
  return apiPost<
    ApiResponse<{
      token: string;
      token_type?: string;
      expires_in?: number;
    }>
  >("/admin/refresh");
}

/**
 * POST /api/v1/auth/register
 * Register a new customer account
 */
export async function registerApi(
  payload: AuthRegisterPayload
): Promise<ApiResponse<AuthResponseData>> {
  return apiPost<ApiResponse<AuthResponseData>, AuthRegisterPayload>(
    "/auth/register",
    payload
  );
}

/**
 * DELETE /api/v1/auth/logout
 * Invalidate current user session token
 */
export async function logoutApi(): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>("/auth/logout");
}

/**
 * POST /api/v1/auth/google-login
 * Authenticate user with Google token (ID token or Access token) from frontend
 */
export async function googleLoginApi(
  token: string
): Promise<ApiResponse<AuthResponseData>> {
  return apiPost<ApiResponse<AuthResponseData>, { token: string }>(
    "/auth/google-login",
    { token }
  );
}

/**
 * GET /api/v1/auth/google/redirect
 * Fetch Google OAuth redirect URL or return direct endpoint URL
 */
export async function fetchGoogleAuthRedirect(): Promise<
  ApiResponse<{ url?: string; redirect_url?: string }>
> {
  return apiGet<ApiResponse<{ url?: string; redirect_url?: string }>>(
    "/auth/google/redirect"
  );
}

export function getGoogleOAuthUrl(): string {
  return `${API_BASE_URL}/auth/google/redirect`;
}

