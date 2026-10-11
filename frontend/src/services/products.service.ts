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
 * Endpoint: GET /api/v1/user/products?filter=&category=&launcher=&sort_by=&price_range=&page
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
  const url = queryString ? `/user/products?${queryString}` : "/user/products";

  return apiGet<ApiPaginatedResponse<ProductListItem>>(url);
}

/**
 * Fetch single product details by slug or ID
 * Endpoint: GET /api/v1/user/products/:slug
 */
export async function fetchProductDetail(
  slug: string
): Promise<ApiResponse<ProductDetailItem>> {
  return apiGet<ApiResponse<ProductDetailItem>>(`/user/products/${slug}`);
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
 * Endpoint: GET /api/v1/user/custom-sections/
 */
export async function fetchCustomSections(): Promise<
  ApiResponse<CustomSectionItem[]>
> {
  return apiGet<ApiResponse<CustomSectionItem[]>>("/user/custom-sections/");
}
