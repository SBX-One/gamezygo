import { useQuery } from "@tanstack/react-query";
import {
  fetchBlogs,
  fetchBlogDetail,
  type FetchBlogsParams,
} from "@/services/blogs.service";

export const BLOG_KEYS = {
  all: ["blogs"] as const,
  lists: () => [...BLOG_KEYS.all, "list"] as const,
  list: (params?: FetchBlogsParams) => [...BLOG_KEYS.lists(), params] as const,
  details: () => [...BLOG_KEYS.all, "detail"] as const,
  detail: (slug: string) => [...BLOG_KEYS.details(), slug] as const,
};

/**
 * Hook to fetch blogs list with optional filters
 */
export function useBlogs(params?: FetchBlogsParams) {
  return useQuery({
    queryKey: BLOG_KEYS.list(params),
    queryFn: () => fetchBlogs(params),
  });
}

/**
 * Hook to fetch single blog details
 */
export function useBlogDetail(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: BLOG_KEYS.detail(slug),
    queryFn: () => fetchBlogDetail(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
  });
}
