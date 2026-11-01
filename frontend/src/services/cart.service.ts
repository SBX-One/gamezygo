import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import type {
  ApiResponse,
  CartResponse,
  AddToCartResponse,
} from "@/types";

/**
 * Fetch current user cart items and total prices
 * Endpoint: GET /api/v1/user/cart/
 */
export async function fetchCart(): Promise<ApiResponse<CartResponse>> {
  return apiGet<ApiResponse<CartResponse>>("/user/cart/");
}

/**
 * Add a product to the user's cart
 * Endpoint: POST /api/v1/user/cart
 */
export async function addToCart(
  productId: number
): Promise<ApiResponse<AddToCartResponse>> {
  return apiPost<ApiResponse<AddToCartResponse>, { product_id: number }>(
    "/user/cart",
    { product_id: productId }
  );
}

/**
 * Remove an item from the cart
 * Endpoint: DELETE /api/v1/user/cart/:cartItemId
 */
export async function removeFromCart(
  cartItemId: number | string
): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>(`/user/cart/${cartItemId}`);
}

/**
 * Clear all items in the user's cart
 * Endpoint (Postman user > cart > clear): DELETE /api/v1/user/cart/clear
 */
export async function clearCartApi(): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>("/user/cart/clear");
}
