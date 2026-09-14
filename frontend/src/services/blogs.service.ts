import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  BlogListItem,
  BlogDetailItem,
} from "@/types";

export interface FetchBlogsParams {
  search?: string;
  categories?: string[];
  page?: number;
}

/**
 * Fetch blogs list with optional search and categories filters
 * Endpoint: GET /api/v1/user/blogs/
 */
export async function fetchBlogs(
  params?: FetchBlogsParams
): Promise<ApiResponse<BlogListItem[]>> {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.categories && params.categories.length > 0) {
    params.categories.forEach((category) => {
      queryParams.append("categories[]", category);
    });
  }

  if (params?.page) {
    queryParams.append("page", String(params.page));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/user/blogs/?${queryString}` : "/user/blogs/";

  return apiGet<ApiResponse<BlogListItem[]>>(url);
}

/**
 * Fetch single blog details by slug
 * Endpoint: GET /api/v1/user/blogs/:slug
 */
export async function fetchBlogDetail(
  slug: string
): Promise<ApiResponse<BlogDetailItem>> {
  return apiGet<ApiResponse<BlogDetailItem>>(`/user/blogs/${slug}`);
}
