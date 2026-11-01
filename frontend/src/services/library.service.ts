import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ProductListItem,
  GameCredentialsItem,
} from "@/types";

export interface LibraryQueryParams {
  search?: string;
  genre_categories?: string[];
  page?: number;
}

/**
 * Fetch user game library (purchased games)
 * Primary Endpoint (Postman user > profile > game library):
 *   GET /api/v1/user/profile/products/?search=&genre_categories[...]
 * Fallback Endpoint:
 *   GET /api/v1/user/profile/game-library/
 */
export async function fetchUserGameLibrary(
  params?: LibraryQueryParams
): Promise<ApiPaginatedResponse<ProductListItem>> {
  const queryParts: string[] = [];

  if (params?.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }

  if (params?.genre_categories && params.genre_categories.length > 0) {
    params.genre_categories.forEach((cat, idx) => {
      queryParts.push(`genre_categories[${idx}]=${encodeURIComponent(cat)}`);
    });
  }

  if (params?.page) {
    queryParts.push(`page=${params.page}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  try {
    return await apiGet<ApiPaginatedResponse<ProductListItem>>(
      `/user/profile/products/${queryString}`
    );
  } catch {
    return apiGet<ApiPaginatedResponse<ProductListItem>>(
      `/user/profile/game-library/${queryString}`
    );
  }
}

/**
 * Fetch game credentials for a purchased product
 * Endpoint: GET /api/v1/user/products/:slug/credentials
 * Returns 403 / 404 if user has not purchased this game or credentials not found.
 */
export async function fetchGameCredentials(
  slug: string
): Promise<ApiResponse<GameCredentialsItem>> {
  return apiGet<ApiResponse<GameCredentialsItem>>(
    `/user/products/${slug}/credentials`
  );
}
