import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ProductListItem,
  ProductDetailItem,
  CustomSectionItem,
} from "@/types";

export interface FetchProductsParams {
  search?: string;
  genre_categories?: string[];
  page?: number;
}

/**
 * Fetch paginated products list with optional search and genre filters
 * Endpoint: GET /api/v1/user/products/
 */
export async function fetchProducts(
  params?: FetchProductsParams
): Promise<ApiPaginatedResponse<ProductListItem>> {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.genre_categories && params.genre_categories.length > 0) {
    params.genre_categories.forEach((genre, index) => {
      queryParams.append(`genre_categories[${index}]`, genre);
    });
  }

  if (params?.page) {
    queryParams.append("page", String(params.page));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/user/products/?${queryString}` : "/user/products/";

  return apiGet<ApiPaginatedResponse<ProductListItem>>(url);
}

/**
 * Fetch single product details by slug
 * Endpoint: GET /api/v1/user/products/:slug
 */
export async function fetchProductDetail(
  slug: string
): Promise<ApiResponse<ProductDetailItem>> {
  return apiGet<ApiResponse<ProductDetailItem>>(`/user/products/${slug}`);
}

/**
 * Fetch custom promo sections for landing storefront
 * Endpoint: GET /api/v1/user/sections/
 */
export async function fetchCustomSections(): Promise<
  ApiResponse<CustomSectionItem[]>
> {
  return apiGet<ApiResponse<CustomSectionItem[]>>("/user/sections/");
}
