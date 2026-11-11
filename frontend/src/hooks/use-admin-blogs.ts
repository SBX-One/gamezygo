import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminBlogService,
  type AdminBlogListResponse,
  type AdminBlogQueryParams,
  type AdminBlogSavePayload,
  type AdminBlogUpdatePayload,
} from "@/services/admin-blog.service";
import type { AdminArticle } from "@/features/admin/types/admin-article.types";
import {
  formatArticleLastEdited,
  formatArticlePublishedDate,
  mapBackendStatusToUi,
} from "@/features/admin/utils/article-content.utils";
import { resolveImageUrl } from "@/utils/image-url";

export const ADMIN_BLOGS_KEYS = {
  all: ["admin-blogs"] as const,
  list: (params?: AdminBlogQueryParams) =>
    [...ADMIN_BLOGS_KEYS.all, "list", params] as const,
  categories: () => [...ADMIN_BLOGS_KEYS.all, "categories"] as const,
  detail: (id: string | number) =>
    [...ADMIN_BLOGS_KEYS.all, "detail", String(id)] as const,
};

export function useAdminBlogs(params?: AdminBlogQueryParams) {
  const query = useQuery({
    queryKey: ADMIN_BLOGS_KEYS.list(params),
    queryFn: () => adminBlogService.getBlogs(params),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawData: AdminBlogListResponse["data"] | undefined = query.data;
  const rawBlogs = rawData?.blogs;

  const articles: AdminArticle[] = React.useMemo(() => {
    if (!rawBlogs) return [];

    return rawBlogs.map((item) => ({
      id: String(item.id),
      slug: item.slug,
      title: item.title,
      coverImage: resolveImageUrl(
        item.banner_file_url,
        "https://placehold.co/800x450/13151F/6366F1?text=No+Banner"
      ),
      status: mapBackendStatusToUi(item.status),
      publishedAt: formatArticlePublishedDate(item.published_at),
      lastEdited: formatArticleLastEdited(item.last_edit),
      views: Number(item.total_views ?? 0),
      category: item.category?.name,
      categoryId: item.category?.id ?? null,
    }));
  }, [rawBlogs]);

  const totalBlog =
    rawData?.meta?.total !== undefined
      ? rawData.meta.total
      : rawData?.total_blog !== undefined
      ? rawData.total_blog
      : articles.length;

  return {
    ...query,
    articles,
    totalBlog,
    overallTotal: rawData?.total_blog ?? totalBlog,
    meta: rawData?.meta,
    totalPages: Math.max(1, rawData?.meta?.last_page ?? 1),
  };
}

export function useAdminBlogCategories() {
  return useQuery({
    queryKey: ADMIN_BLOGS_KEYS.categories(),
    queryFn: () => adminBlogService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminBlogDetail(
  id: string | number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ADMIN_BLOGS_KEYS.detail(id || ""),
    queryFn: () => adminBlogService.getBlogDetail(id!),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
  });
}

export function useCreateAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminBlogSavePayload) =>
      adminBlogService.createBlog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useUpdateAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: AdminBlogUpdatePayload;
    }) => adminBlogService.updateBlog(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_BLOGS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function usePublishAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => adminBlogService.publishBlog(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_BLOGS_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useBulkPublishAdminBlogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: Array<number | string>) =>
      adminBlogService.bulkPublishBlogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useDeleteAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => adminBlogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useBulkDeleteAdminBlogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: Array<number | string>) =>
      adminBlogService.bulkDeleteBlogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

