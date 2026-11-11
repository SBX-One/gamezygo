import { apiClient } from "@/lib/api-client";

export interface AdminCommunityTagServerItem {
  id: number;
  name: string;
  slug: string;
}

export interface AdminCommunityServerItem {
  id: number;
  name: string;
  banner_file_url: string;
  link: string;
  order_number: number;
  is_active: boolean;
  tags: AdminCommunityTagServerItem[];
  tag?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminCommunitiesListResponse {
  success: boolean;
  message: string;
  data: AdminCommunityServerItem[];
}

export interface AdminCommunityTagsResponse {
  success: boolean;
  message: string;
  data: AdminCommunityTagServerItem[];
}

export interface AdminCommunityMutationResponse {
  success: boolean;
  message: string;
  data: AdminCommunityServerItem;
}

export interface AdminCommunitySavePayload {
  name: string;
  link?: string | null;
  is_active?: boolean;
  tags?: string[];
  banner_file?: File | null;
  banner_file_url?: string | null;
}

export interface AdminCommunityUpdatePayload {
  name?: string;
  link?: string | null;
  is_active?: boolean;
  order_number?: number;
  tags?: string[];
  remove_image?: boolean;
  banner_file?: File | null;
  banner_file_url?: string | null;
}

function buildCommunityFormData(
  payload: Partial<AdminCommunitySavePayload & AdminCommunityUpdatePayload>
): FormData {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }
  if (payload.link !== undefined) {
    formData.append("link", payload.link ?? "");
  }
  if (payload.is_active !== undefined) {
    formData.append("is_active", payload.is_active ? "1" : "0");
  }
  if (payload.order_number !== undefined) {
    formData.append("order_number", String(payload.order_number));
  }
  if (payload.remove_image) {
    formData.append("remove_image", "1");
  }
  if (payload.tags !== undefined) {
    if (payload.tags.length === 0) {
      formData.append("tags", "");
    } else {
      payload.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
    }
  }
  if (payload.banner_file instanceof File) {
    formData.append("banner_file", payload.banner_file);
  } else if (
    typeof payload.banner_file_url === "string" &&
    payload.banner_file_url.trim()
  ) {
    formData.append("banner_file_url", payload.banner_file_url.trim());
  }

  return formData;
}

export const adminCommunityService = {
  /**
   * Fetch all communities ordered by order_number.
   */
  async getCommunities(): Promise<AdminCommunityServerItem[]> {
    const response = await apiClient.get<AdminCommunitiesListResponse>(
      "/admin/communities"
    );
    return response.data.data ?? [];
  },

  /**
   * Fetch available community platform tags.
   */
  async getTags(): Promise<AdminCommunityTagServerItem[]> {
    const response = await apiClient.get<AdminCommunityTagsResponse>(
      "/admin/communities/tags"
    );
    return response.data.data ?? [];
  },

  /**
   * Create a new community group (supports File upload or URL).
   */
  async createCommunity(
    payload: AdminCommunitySavePayload
  ): Promise<AdminCommunityServerItem> {
    if (payload.banner_file instanceof File) {
      const formData = buildCommunityFormData(payload);
      const response = await apiClient.post<AdminCommunityMutationResponse>(
        "/admin/communities",
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return response.data.data;
    }

    const response = await apiClient.post<AdminCommunityMutationResponse>(
      "/admin/communities",
      {
        name: payload.name,
        link: payload.link ?? "",
        is_active: payload.is_active ?? true,
        tags: payload.tags ?? [],
        banner_file_url: payload.banner_file_url ?? "",
      }
    );
    return response.data.data;
  },

  /**
   * Update an existing community group (supports File upload via POST or JSON via PATCH).
   */
  async updateCommunity(
    id: number | string,
    payload: AdminCommunityUpdatePayload
  ): Promise<AdminCommunityServerItem> {
    if (payload.banner_file instanceof File) {
      const formData = buildCommunityFormData(payload);
      const response = await apiClient.post<AdminCommunityMutationResponse>(
        `/admin/communities/${id}`,
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return response.data.data;
    }

    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.link !== undefined) body.link = payload.link ?? "";
    if (payload.is_active !== undefined) body.is_active = payload.is_active;
    if (payload.order_number !== undefined) {
      body.order_number = payload.order_number;
    }
    if (payload.tags !== undefined) body.tags = payload.tags;
    if (payload.remove_image !== undefined) {
      body.remove_image = payload.remove_image;
    }
    if (payload.banner_file_url !== undefined) {
      body.banner_file_url = payload.banner_file_url;
    }

    const response = await apiClient.patch<AdminCommunityMutationResponse>(
      `/admin/communities/${id}`,
      body
    );
    return response.data.data;
  },

  /**
   * Persist reordered community sequence by ID array.
   */
  async sortCommunities(
    ids: Array<number | string>
  ): Promise<AdminCommunityServerItem[]> {
    const numericIds = ids
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    const response = await apiClient.post<AdminCommunitiesListResponse>(
      "/admin/communities/sort",
      { ids: numericIds }
    );
    return response.data.data ?? [];
  },

  /**
   * Delete a community group by ID.
   */
  async deleteCommunity(id: number | string): Promise<void> {
    await apiClient.delete(`/admin/communities/${id}`);
  },
};

