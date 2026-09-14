import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductDetail,
  fetchCustomSections,
  type FetchProductsParams,
} from "@/services/products.service";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params?: FetchProductsParams) => [...PRODUCT_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (slug: string) => [...PRODUCT_KEYS.details(), slug] as const,
  sections: () => ["custom-sections"] as const,
};

/**
 * Hook to fetch paginated products with search and genre filtering
 */
export function useProducts(params?: FetchProductsParams) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => fetchProducts(params),
  });
}

/**
 * Hook to fetch single product details by slug
 */
export function useProductDetail(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => fetchProductDetail(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
  });
}

/**
 * Hook to fetch custom promo sections
 */
export function useCustomSections() {
  return useQuery({
    queryKey: PRODUCT_KEYS.sections(),
    queryFn: () => fetchCustomSections(),
  });
}
