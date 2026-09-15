import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  GameRequestItem,
} from "@/types";

export interface GameRequestQueryParams {
  scope?: "mine" | "all";
  page?: number;
}

export interface CreateGameRequestPayload {
  steam_url: string;
  name?: string;
  note?: string;
}

/**
 * Fetch game requests list
 * Endpoint: GET /api/v1/user/game-requests/?scope=mine|all
 */
export async function fetchGameRequests(
  params?: GameRequestQueryParams
): Promise<ApiPaginatedResponse<GameRequestItem>> {
  const queryParts: string[] = [];

  if (params?.scope) {
    queryParts.push(`scope=${encodeURIComponent(params.scope)}`);
  }

  if (params?.page) {
    queryParts.push(`page=${params.page}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  return apiGet<ApiPaginatedResponse<GameRequestItem>>(
    `/user/game-requests/${queryString}`
  );
}

/**
 * Submit a new game request
 * Endpoint: POST /api/v1/user/game-requests
 */
export async function createGameRequest(
  payload: CreateGameRequestPayload
): Promise<ApiResponse<GameRequestItem>> {
  return apiPost<ApiResponse<GameRequestItem>, CreateGameRequestPayload>(
    "/user/game-requests",
    payload
  );
}

/**
 * Delete a user game request
 * Endpoint: DELETE /api/v1/user/game-requests/:id
 */
export async function deleteGameRequest(
  requestId: number
): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>(`/user/game-requests/${requestId}`);
}

/**
 * Upvote a game request
 * Endpoint: POST /api/v1/user/game-requests/:id/vote
 */
export async function voteGameRequest(
  requestId: number
): Promise<ApiResponse<null>> {
  return apiPost<ApiResponse<null>>(`/user/game-requests/${requestId}/vote`);
}

/**
 * Cancel upvote / Unvote a game request
 * Endpoint: DELETE /api/v1/user/game-requests/:id/vote
 */
export async function unvoteGameRequest(
  requestId: number
): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>(`/user/game-requests/${requestId}/vote`);
}
