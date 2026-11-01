import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ProductListItem,
  ProductDetailItem,
  CustomSectionItem,
  ProductFiltersData,
} from "@/types";

export interface FetchProductsParams {
  search?: string;
  filter?: string;
  category?: string;
  launcher?: string;
  sort_by?: string;
  price_range?: string | number;
  page?: number;
  genre_categories?: string[];
}

/**
 * Fetch paginated products list with query filters
 * Primary Endpoint (Postman guest): GET /api/v1/products
 * Fallback Endpoint: GET /api/v1/user/products
 */
export async function fetchProducts(
  params?: FetchProductsParams
): Promise<ApiPaginatedResponse<ProductListItem>> {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.filter) {
    queryParams.append("filter", params.filter);
  }

  if (params?.category) {
    queryParams.append("category", params.category);
  }

  if (params?.launcher) {
    queryParams.append("launcher", params.launcher);
  }

  if (params?.sort_by) {
    queryParams.append("sort_by", params.sort_by);
  }

  if (params?.price_range !== undefined) {
    queryParams.append("price_range", String(params.price_range));
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
  const primaryUrl = queryString ? `/products?${queryString}` : "/products";
  const fallbackUrl = queryString ? `/user/products?${queryString}` : "/user/products";

  try {
    return await apiGet<ApiPaginatedResponse<ProductListItem>>(primaryUrl);
  } catch {
    return apiGet<ApiPaginatedResponse<ProductListItem>>(fallbackUrl);
  }
}

/**
 * Fetch single product details by slug or ID
 * Primary Endpoint (Postman guest): GET /api/v1/products/:slug
 * Fallback Endpoint: GET /api/v1/user/products/:slug
 */
export async function fetchProductDetail(
  slug: string
): Promise<ApiResponse<ProductDetailItem>> {
  try {
    return await apiGet<ApiResponse<ProductDetailItem>>(`/products/${slug}`);
  } catch {
    return apiGet<ApiResponse<ProductDetailItem>>(`/user/products/${slug}`);
  }
}

/**
 * Fetch product filter and sort options
 * Endpoint: GET /api/v1/products/filters
 */
export async function fetchProductFilters(): Promise<
  ApiResponse<ProductFiltersData>
> {
  return apiGet<ApiResponse<ProductFiltersData>>("/products/filters");
}

/**
 * Fetch custom promo sections for landing storefront
 * Primary Endpoint (Postman guest): GET /api/v1/custom-sections/
 * Fallback Endpoint: GET /api/v1/user/custom-sections/
 */
export async function fetchCustomSections(): Promise<
  ApiResponse<CustomSectionItem[]>
> {
  try {
    return await apiGet<ApiResponse<CustomSectionItem[]>>("/custom-sections/");
  } catch {
    return apiGet<ApiResponse<CustomSectionItem[]>>("/user/custom-sections/");
  }
}
