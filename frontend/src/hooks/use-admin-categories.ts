import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCategoryService,
} from "@/services/admin-category.service";
import type {
  CategoryScope,
} from "@/features/admin/types/admin-category.types";

export const ADMIN_CATEGORIES_KEYS = {
  all: ["admin-categories"] as const,
  list: (search?: string) => [...ADMIN_CATEGORIES_KEYS.all, "list", search] as const,
  products: (search?: string) => [...ADMIN_CATEGORIES_KEYS.all, "products", search] as const,
  blogs: (search?: string) => [...ADMIN_CATEGORIES_KEYS.all, "blogs", search] as const,
};

export function useAdminCategories(search?: string) {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEYS.list(search),
    queryFn: () => adminCategoryService.getAllCategories(search),
    staleTime: 30 * 1000,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scope,
      data,
    }: {
      scope: CategoryScope;
      data: { title: string; description?: string; subCategories?: string[] };
    }) => adminCategoryService.createCategory(scope, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scope,
      id,
      data,
    }: {
      scope: CategoryScope;
      id: string | number;
      data: { title?: string; description?: string };
    }) => adminCategoryService.updateCategory(scope, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scope,
      id,
    }: {
      scope: CategoryScope;
      id: string | number;
    }) => adminCategoryService.deleteCategory(scope, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

export function useCreateAdminSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scope,
      categoryId,
      name,
    }: {
      scope: CategoryScope;
      categoryId: string | number;
      name: string;
    }) => adminCategoryService.createSubCategory(scope, categoryId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

export function useUpdateAdminSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scope,
      subId,
      name,
    }: {
      scope: CategoryScope;
      subId: string | number;
      name: string;
    }) => adminCategoryService.updateSubCategory(scope, subId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

export function useDeleteAdminSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scope,
      subId,
    }: {
      scope: CategoryScope;
      subId: string | number;
    }) => adminCategoryService.deleteSubCategory(scope, subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

