import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminCatalogService,
  type AdminCatalogQueryParams,
  type AdminCatalogListResponse,
} from "@/services/admin-catalog.service";
import type { AdminCatalogItem } from "@/features/admin/types/admin-catalog.types";

import { resolveImageUrl } from "@/utils/image-url";

export const ADMIN_CATALOG_KEYS = {
  all: ["admin-catalog"] as const,
  list: (params?: AdminCatalogQueryParams) =>
    [...ADMIN_CATALOG_KEYS.all, "list", params] as const,
  filters: () => [...ADMIN_CATALOG_KEYS.all, "filters"] as const,
  detail: (id: string | number) => [...ADMIN_CATALOG_KEYS.all, "detail", String(id)] as const,
  archived: () => [...ADMIN_CATALOG_KEYS.all, "archived"] as const,
};

function normalizeCatalogCategory(name?: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "sports" || lower === "sport" || lower === "racing") {
    return "Sport-Racing";
  }
  return trimmed;
}

export function useAdminCatalog(params?: AdminCatalogQueryParams) {
  const query = useQuery({
    queryKey: ADMIN_CATALOG_KEYS.list(params),
    queryFn: () => adminCatalogService.getCatalog(params),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawData: AdminCatalogListResponse["data"] | undefined = query.data;

  const items: AdminCatalogItem[] = React.useMemo(() => {
    if (!rawData?.products) return [];

    return rawData.products.map((p) => {
      const isPreOrder = Boolean(p.is_preorder || p.status === "pre-order");
      const isArchived = Boolean(p.status === "archive");
      const isActive = Boolean(p.is_active || p.status === "listing");

      return {
        id: String(p.id),
        name: p.name,
        imageSrc: resolveImageUrl(p.image_url),
        categories: p.categories
          ? Array.from(
              new Set(
                p.categories
                  .map((c) => normalizeCatalogCategory(c.name))
                  .filter(Boolean)
              )
            )
          : [],
        price: p.price,
        isActive: isActive,
        isPreOrder: isPreOrder,
        isDraft: Boolean(p.is_draft),
        isUnlisted: isArchived,
        createdAt: p.created_at || undefined,
      };
    });
  }, [rawData?.products]);

  const totalProducts = rawData?.total_products ?? items.length;

  return {
    ...query,
    items,
    totalProducts,
    meta: rawData?.meta,
  };
}

export function useAdminCatalogFilters() {
  return useQuery({
    queryKey: ADMIN_CATALOG_KEYS.filters(),
    queryFn: () => adminCatalogService.getFilters(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminProductDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: ADMIN_CATALOG_KEYS.detail(id || ""),
    queryFn: () => adminCatalogService.getProduct(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isActive }: { productId: string | number; isActive: boolean }) =>
      adminCatalogService.toggleArchiveStatus(productId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useBatchArchiveStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, isActive }: { ids: Array<string | number>; isActive: boolean }) =>
      adminCatalogService.batchArchiveStatus(ids, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useAdminArchivedCatalog() {
  const query = useQuery({
    queryKey: ADMIN_CATALOG_KEYS.archived(),
    queryFn: () => adminCatalogService.getArchived(),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawData = query.data;

  const items: AdminCatalogItem[] = React.useMemo(() => {
    if (!rawData?.products) return [];

    return rawData.products.map((p) => {
      return {
        id: String(p.id),
        name: p.name,
        imageSrc: resolveImageUrl(p.image_url),
        categories: p.categories
          ? Array.from(
              new Set(
                p.categories
                  .map((c) => normalizeCatalogCategory(c.name))
                  .filter(Boolean)
              )
            )
          : [],
        price: p.price,
        isActive: false,
        isPreOrder: Boolean(p.is_preorder || p.status === "pre-order"),
        isDraft: Boolean(p.is_draft),
        isUnlisted: true,
        createdAt: p.created_at || undefined,
      };
    });
  }, [rawData?.products]);

  const totalArchived = rawData?.total_archived ?? items.length;

  return {
    ...query,
    items,
    totalArchived,
  };
}

export function useDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: Array<string | number>) => adminCatalogService.deleteProducts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Record<string, unknown>) =>
      adminCatalogService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: FormData | Record<string, unknown>;
    }) => adminCatalogService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ADMIN_CATALOG_KEYS.detail(variables.id),
      });
    },
  });
}
