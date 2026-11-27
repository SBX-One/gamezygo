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

const HIDDEN_STOREFRONT_STATUSES = new Set([
  "archive",
  "archived",
  "unlisted",
  "delist",
  "draft",
]);

/**
 * Defensive frontend filter to ensure archived, de-listed, or draft products
 * never leak into public storefront listings or search results (BUG-013).
 */
export function isPubliclyVisibleProduct(product: unknown): boolean {
  if (!product || typeof product !== "object") return false;
  const p = product as Record<string, unknown>;
  const status = typeof p.status === "string" ? p.status.toLowerCase().trim() : "";
  if (status && HIDDEN_STOREFRONT_STATUSES.has(status)) return false;
  if (p.is_archived === true || p.is_draft === true || p.is_unlisted === true) {
    return false;
  }
  if (p.archived_at || p.deleted_at) return false;
  return true;
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
  const url = queryString ? `/products?${queryString}` : "/products";

  const res = await apiGet<ApiPaginatedResponse<ProductListItem>>(url);
  if (Array.isArray(res?.data)) {
    return {
      ...res,
      data: res.data.filter(isPubliclyVisibleProduct),
    };
  }
  return res;
}

/**
 * Fetch single product details by slug or ID
 * Endpoint: GET /api/v1/products/:slug
 */
export async function fetchProductDetail(
  slug: string
): Promise<ApiResponse<ProductDetailItem>> {
  return apiGet<ApiResponse<ProductDetailItem>>(`/products/${slug}`);
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
 * Endpoint: GET /api/v1/custom-sections
 */
export async function fetchCustomSections(): Promise<
  ApiResponse<CustomSectionItem[]>
> {
  const res = await apiGet<unknown>("/custom-sections");
  const r = res as {
    status?: string;
    success?: boolean;
    message?: string;
    data?: unknown;
  };
  const rawData = r?.data;
  const list = Array.isArray(rawData)
    ? (rawData as CustomSectionItem[])
    : Array.isArray((rawData as { data?: unknown[] })?.data)
    ? ((rawData as { data: CustomSectionItem[] }).data)
    : Array.isArray(r)
    ? (r as unknown as CustomSectionItem[])
    : [];

  const filteredList = list.map((section) => {
    const rawSection = section as CustomSectionItem & {
      products?: unknown[];
      items?: unknown[];
    };
    return {
      ...section,
      ...(Array.isArray(rawSection.products)
        ? { products: rawSection.products.filter(isPubliclyVisibleProduct) }
        : {}),
      ...(Array.isArray(rawSection.items)
        ? { items: rawSection.items.filter(isPubliclyVisibleProduct) }
        : {}),
    } as CustomSectionItem;
  });

  return {
    success: r?.success ?? true,
    message: r?.message ?? "",
    data: filteredList,
  };
}
