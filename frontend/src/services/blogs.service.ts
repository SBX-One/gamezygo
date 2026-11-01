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
 * Primary Endpoint: GET /api/v1/blogs/
 * Fallback Endpoint: GET /api/v1/user/blogs/
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
  const primaryUrl = queryString ? `/blogs/?${queryString}` : "/blogs/";
  const fallbackUrl = queryString ? `/user/blogs/?${queryString}` : "/user/blogs/";

  try {
    return await apiGet<ApiResponse<BlogListItem[]>>(primaryUrl);
  } catch {
    return apiGet<ApiResponse<BlogListItem[]>>(fallbackUrl);
  }
}

/**
 * Fetch single blog details by slug
 * Primary Endpoint: GET /api/v1/blogs/:slug
 * Fallback Endpoint: GET /api/v1/user/blogs/:slug
 */
export async function fetchBlogDetail(
  slug: string
): Promise<ApiResponse<BlogDetailItem>> {
  try {
    return await apiGet<ApiResponse<BlogDetailItem>>(`/blogs/${slug}`);
  } catch {
    return apiGet<ApiResponse<BlogDetailItem>>(`/user/blogs/${slug}`);
  }
}
