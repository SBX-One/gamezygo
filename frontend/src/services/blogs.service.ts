import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
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
 * Endpoint (user.php): GET /api/v1/blogs
 */
export async function fetchBlogs(
  params?: FetchBlogsParams
): Promise<ApiPaginatedResponse<BlogListItem>> {
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
  const url = queryString ? `/blogs?${queryString}` : "/blogs";

  return apiGet<ApiPaginatedResponse<BlogListItem>>(url);
}

/**
 * Fetch single blog details by slug
 * Endpoint (user.php): GET /api/v1/blogs/:slug
 */
export async function fetchBlogDetail(
  slug: string
): Promise<ApiResponse<BlogDetailItem>> {
  return apiGet<ApiResponse<BlogDetailItem>>(`/blogs/${slug}`);
}
