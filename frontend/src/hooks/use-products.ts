import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductDetail,
  fetchProductFilters,
  fetchCustomSections,
  type FetchProductsParams,
} from "@/services/products.service";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params?: FetchProductsParams) => [...PRODUCT_KEYS.lists(), params] as const,
  infinite: (params?: Omit<FetchProductsParams, "page">) =>
    [...PRODUCT_KEYS.lists(), "infinite", params] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (slug: string) => [...PRODUCT_KEYS.details(), slug] as const,
  filters: () => [...PRODUCT_KEYS.all, "filters"] as const,
  sections: () => ["custom-sections"] as const,
};

/**
 * Hook to fetch paginated products with query filters
 */
export function useProducts(params?: FetchProductsParams) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => fetchProducts(params),
  });
}

/**
 * Hook to fetch products incrementally for infinite scroll
 */
export function useInfiniteProducts(
  params?: Omit<FetchProductsParams, "page">
) {
  return useInfiniteQuery({
    queryKey: PRODUCT_KEYS.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ ...params, page: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (meta && meta.current_page < meta.last_page) {
        return meta.current_page + 1;
      }
      return undefined;
    },
  });
}

/**
 * Hook to fetch single product details by slug or ID
 */
export function useProductDetail(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => fetchProductDetail(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
  });
}

/**
 * Hook to fetch product filter metadata (categories, launchers, price range, sort options)
 */
export function useProductFilters() {
  return useQuery({
    queryKey: PRODUCT_KEYS.filters(),
    queryFn: () => fetchProductFilters(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
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
