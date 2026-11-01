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
  const primaryUrl = queryString ? `/user/products?${queryString}` : "/user/products";
  const fallbackUrl = queryString ? `/products?${queryString}` : "/products";

  try {
    return await apiGet<ApiPaginatedResponse<ProductListItem>>(primaryUrl);
  } catch {
    return apiGet<ApiPaginatedResponse<ProductListItem>>(fallbackUrl);
  }
}

/**
 * Fetch single product details by slug or ID
 * Primary Endpoint: GET /api/v1/user/products/:slug
 * Fallback Endpoint: GET /api/v1/products/:slug
 */
export async function fetchProductDetail(
  slug: string
): Promise<ApiResponse<ProductDetailItem>> {
  try {
    return await apiGet<ApiResponse<ProductDetailItem>>(`/user/products/${slug}`);
  } catch {
    return apiGet<ApiResponse<ProductDetailItem>>(`/products/${slug}`);
  }
}

/**
 * Fetch product filter and sort options
 * Note: Backend does not provide a dedicated /filters route, so static filter options are returned.
 */
export async function fetchProductFilters(): Promise<
  ApiResponse<ProductFiltersData>
> {
  return {
    success: true,
    message: "Product filters retrieved successfully",
    data: {
      categories: [
        { id: 1, name: "Action", slug: "action" },
        { id: 2, name: "Adventure", slug: "adventure" },
        { id: 3, name: "Open World", slug: "open-world" },
        { id: 4, name: "Strategy", slug: "strategy" },
        { id: 5, name: "FPS", slug: "fps" },
        { id: 6, name: "RPG", slug: "rpg" },
      ],
      launcher: [
        { id: 1, name: "Steam", slug: "steam" },
        { id: 2, name: "Epic Games", slug: "epic-games" },
      ],
      statuses: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
      price_range: {
        min: 0,
        max: 1500000,
      },
      sort_options: [
        { label: "Terbaru", value: "latest" },
        { label: "Terlama", value: "oldest" },
        { label: "Nama A-Z", value: "a_z" },
        { label: "Nama Z-A", value: "z_a" },
      ],
    },
  };
}

/**
 * Fetch custom promo sections for landing storefront
 * Primary Endpoint: GET /api/v1/user/custom-sections/
 * Fallback Endpoint: GET /api/v1/custom-sections/
 */
export async function fetchCustomSections(): Promise<
  ApiResponse<CustomSectionItem[]>
> {
  try {
    return await apiGet<ApiResponse<CustomSectionItem[]>>("/user/custom-sections");
  } catch {
    return apiGet<ApiResponse<CustomSectionItem[]>>("/custom-sections");
  }
}
