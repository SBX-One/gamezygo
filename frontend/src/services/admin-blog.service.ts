import { apiClient } from "@/lib/api-client";
import type {
  AdminBlogCategoryItem,
  BackendBlogStatus,
} from "@/features/admin/types/admin-article.types";

export interface AdminBlogServerCategory {
  id: number;
  name: string;
  slug: string;
}

export interface AdminBlogListServerItem {
  id: number;
  banner_file_url: string;
  title: string;
  slug: string;
  status: BackendBlogStatus | string;
  published_at: string | null;
  total_views: number;
  last_edit: string | null;
  category?: AdminBlogServerCategory | null;
}

export interface AdminBlogListMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface AdminBlogListResponse {
  success: boolean;
  message: string;
  data: {
    total_blog: number;
    blogs: AdminBlogListServerItem[];
    meta: AdminBlogListMeta;
  };
}

export interface AdminBlogDetailServerData {
  id: number;
  title: string;
  slug: string;
  banner_file_url: string;
  content: string;
  status: BackendBlogStatus | string;
  published_at: string | null;
  categories: AdminBlogServerCategory | null;
  author?: {
    id: number;
    name: string;
  } | null;
}

export interface AdminBlogDetailResponse {
  success: boolean;
  message: string;
  data: AdminBlogDetailServerData;
}

export interface AdminBlogCategoriesResponse {
  success: boolean;
  message: string;
  data: AdminBlogCategoryItem[];
}

export interface AdminBlogMutationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    slug: string;
    banner_file_url: string;
    status: BackendBlogStatus | string;
    published_at: string | null;
    categories?: AdminBlogServerCategory | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export interface AdminBlogQueryParams {
  search?: string;
  status?: BackendBlogStatus;
  statuses?: BackendBlogStatus[];
  category_id?: number;
  category_ids?: number[];
  sort_by?: "latest" | "name_asc";
  page?: number;
  per_page?: number;
}

export interface AdminBlogSavePayload {
  title: string;
  content: string;
  status?: BackendBlogStatus;
  category_id?: number | null;
  banner_file?: File | string | null;
}

export interface AdminBlogUpdatePayload {
  title?: string;
  content?: string;
  status?: BackendBlogStatus;
  category_id?: number | null;
  banner_file?: File | string | null;
}

function buildBlogFormData(
  payload: Partial<AdminBlogSavePayload>
): FormData {
  const formData = new FormData();

  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }
  if (payload.content !== undefined) {
    formData.append("content", payload.content);
  }
  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }
  if (payload.category_id !== undefined && payload.category_id !== null) {
    formData.append("category_id", String(payload.category_id));
    formData.append("category_ids[]", String(payload.category_id));
  }
  if (payload.banner_file instanceof File) {
    formData.append("banner_file", payload.banner_file);
  } else if (typeof payload.banner_file === "string" && payload.banner_file.trim()) {
    formData.append("banner_file", payload.banner_file.trim());
  }

  return formData;
}

export const adminBlogService = {
  /**
   * Fetch paginated admin blog list with search, status, category, and sorting filters.
   */
  async getBlogs(
    params?: AdminBlogQueryParams
  ): Promise<AdminBlogListResponse["data"]> {
    const response = await apiClient.get<AdminBlogListResponse>("/admin/blogs", {
      params: {
        search: params?.search?.trim() || undefined,
        status: params?.status || undefined,
        statuses: params?.statuses?.length ? params.statuses : undefined,
        category_id: params?.category_id || undefined,
        category_ids: params?.category_ids?.length ? params.category_ids : undefined,
        sort_by: params?.sort_by || "latest",
        page: params?.page || 1,
        per_page: params?.per_page || 9,
      },
    });
    return response.data.data;
  },

  /**
   * Fetch available blog categories from the database.
   */
  async getCategories(): Promise<AdminBlogCategoryItem[]> {
    const response = await apiClient.get<AdminBlogCategoriesResponse>(
      "/admin/blogs/categories"
    );
    return response.data.data ?? [];
  },

  /**
   * Fetch detailed single blog by numeric ID for preview or editing.
   */
  async getBlogDetail(id: number | string): Promise<AdminBlogDetailServerData> {
    const response = await apiClient.get<AdminBlogDetailResponse>(
      `/admin/blogs/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new blog post (draft or published). Uses multipart FormData when banner_file is a File.
   */
  async createBlog(
    payload: AdminBlogSavePayload
  ): Promise<AdminBlogMutationResponse["data"]> {
    const hasFile = payload.banner_file instanceof File;
    if (hasFile) {
      const formData = buildBlogFormData(payload);
      const response = await apiClient.post<AdminBlogMutationResponse>(
        "/admin/blogs",
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return response.data.data;
    }

    const body: Record<string, unknown> = {
      title: payload.title,
      content: payload.content,
      status: payload.status || "draft",
    };
    if (payload.category_id) {
      body.category_id = payload.category_id;
      body.category_ids = [payload.category_id];
    }
    if (typeof payload.banner_file === "string" && payload.banner_file.trim()) {
      body.banner_file = payload.banner_file.trim();
    }

    const response = await apiClient.post<AdminBlogMutationResponse>(
      "/admin/blogs",
      body
    );
    return response.data.data;
  },

  /**
   * Update an existing blog post. Uses POST with multipart FormData when banner_file is a File
   * (backend route explicitly accepts POST/PUT/PATCH).
   */
  async updateBlog(
    id: number | string,
    payload: AdminBlogUpdatePayload
  ): Promise<AdminBlogMutationResponse["data"]> {
    const hasFile = payload.banner_file instanceof File;
    if (hasFile) {
      const formData = buildBlogFormData(payload);
      const response = await apiClient.post<AdminBlogMutationResponse>(
        `/admin/blogs/${id}`,
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return response.data.data;
    }

    const body: Record<string, unknown> = {};
    if (payload.title !== undefined) body.title = payload.title;
    if (payload.content !== undefined) body.content = payload.content;
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.category_id !== undefined) {
      body.category_ids = payload.category_id ? [payload.category_id] : [];
    }
    if (payload.banner_file !== undefined) {
      body.banner_file =
        typeof payload.banner_file === "string" && payload.banner_file.trim()
          ? payload.banner_file.trim()
          : null;
    }

    const response = await apiClient.patch<AdminBlogMutationResponse>(
      `/admin/blogs/${id}`,
      body
    );
    return response.data.data;
  },

  /**
   * Publish a single blog post.
   */
  async publishBlog(id: number | string): Promise<unknown> {
    const response = await apiClient.post(`/admin/blogs/${id}/publish`, {});
    return response.data;
  },

  /**
   * Bulk publish multiple blog posts by ID.
   */
  async bulkPublishBlogs(ids: Array<number | string>): Promise<unknown> {
    const numericIds = ids.map((id) => Number(id)).filter((n) => !Number.isNaN(n));
    const response = await apiClient.post("/admin/blogs/publish", {
      ids: numericIds,
    });
    return response.data;
  },

  /**
   * Delete a single blog post by ID.
   */
  async deleteBlog(id: number | string): Promise<unknown> {
    const response = await apiClient.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  /**
   * Bulk delete multiple blog posts by ID.
   */
  async bulkDeleteBlogs(ids: Array<number | string>): Promise<unknown> {
    const numericIds = ids.map((id) => Number(id)).filter((n) => !Number.isNaN(n));
    const response = await apiClient.delete("/admin/blogs", {
      data: { ids: numericIds },
    });
    return response.data;
  },
};

