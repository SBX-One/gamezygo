import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  WishlistItem,
} from "@/types";

export interface WishlistQueryParams {
  search?: string;
  genre_categories?: string[];
  page?: number;
}

/**
 * Fetch user wishlisted games
 * Endpoint: GET /api/v1/user/profile/wishlists/?search=&genre_categories[...]&page=
 */
export async function fetchWishlist(
  params?: WishlistQueryParams
): Promise<ApiPaginatedResponse<WishlistItem>> {
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
    return await apiGet<ApiPaginatedResponse<WishlistItem>>(
    `/user/profile/wishlists${queryString}`
    );
  } catch {
    return {
      success: true,
      message: "Wishlist is empty",
      data: [],
      meta: {
        current_page: 1,
        from: 0,
        last_page: 1,
        per_page: 15,
        to: 0,
        total: 0,
      },
    };
  }
}

/**
 * Add a product to user wishlist
 * Endpoint: POST /api/v1/user/profile/wishlists
 */
export async function addToWishlist(
  productId: number
): Promise<ApiResponse<{ id: number; product_id: number; created_at: string }>> {
  return apiPost<
    ApiResponse<{ id: number; product_id: number; created_at: string }>,
    { product_id: number }
  >("/user/profile/wishlists", { product_id: productId });
}

/**
 * Remove a product from user wishlist
 * Endpoint: DELETE /api/v1/user/profile/wishlists/:product_id
 */
export async function removeFromWishlist(
  productId: number
): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>(`/user/profile/wishlists/${productId}`);
}
