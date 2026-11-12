import { apiClient } from "@/lib/api-client";

export interface AdminCommunityTagServerItem {
  id: number;
  name: string;
  slug?: string;
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
  data:
    | AdminCommunityServerItem[]
    | {
        total_communities?: number;
        communities?: AdminCommunityServerItem[];
      };
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
  tag_ids?: number[];
  banner_file?: File | null;
  banner_file_url?: string | null;
}

export interface AdminCommunityUpdatePayload {
  name?: string;
  link?: string | null;
  is_active?: boolean;
  order_number?: number;
  tags?: string[];
  tag_ids?: number[];
  remove_image?: boolean;
  banner_file?: File | null;
  banner_file_url?: string | null;
}

const KNOWN_TAG_IDS: Record<string, number> = {
  whatsapp: 1,
  telegram: 2,
  discord: 3,
  "steam group": 4,
  reddit: 5,
  forum: 6,
};

function resolveTagIds(payload: {
  tags?: string[];
  tag_ids?: number[];
}): number[] | undefined {
  if (Array.isArray(payload.tag_ids) && payload.tag_ids.length > 0) {
    return payload.tag_ids;
  }
  if (!Array.isArray(payload.tags)) return undefined;
  const mapped = payload.tags
    .map((t) => KNOWN_TAG_IDS[t.trim().toLowerCase()])
    .filter((id): id is number => typeof id === "number");
  return mapped.length > 0 ? mapped : undefined;
}

function buildCommunityFormData(
  payload: Partial<AdminCommunitySavePayload & AdminCommunityUpdatePayload>,
  isUpdate = false
): FormData {
  const formData = new FormData();

  if (isUpdate) {
    formData.append("_method", "PATCH");
  }
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

  const tagIds = resolveTagIds(payload);
  if (tagIds !== undefined) {
    tagIds.forEach((tagId) => {
      formData.append("tag_ids[]", String(tagId));
    });
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
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.communities)) return data.communities;
    return [];
  },

  /**
   * Fetch available community platform tags (falls back to tags derived from communities).
   */
  async getTags(): Promise<AdminCommunityTagServerItem[]> {
    try {
      const response = await apiClient.get<AdminCommunityTagsResponse>(
        "/admin/communities/tags"
      );
      if (Array.isArray(response.data?.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback: derive unique tags from community list if /tags endpoint is not exposed
    }

    const communities = await this.getCommunities().catch(() => []);
    const tagMap = new Map<number, AdminCommunityTagServerItem>();
    for (const c of communities) {
      for (const t of c.tags ?? []) {
        if (t?.id && t?.name) {
          tagMap.set(t.id, t);
        }
      }
    }
    return Array.from(tagMap.values());
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

    const tagIds = resolveTagIds(payload);
    const response = await apiClient.post<AdminCommunityMutationResponse>(
      "/admin/communities",
      {
        name: payload.name,
        link: payload.link ?? "",
        is_active: payload.is_active ?? true,
        tag_ids: tagIds,
        tags: payload.tags ?? [],
        banner_file_url: payload.banner_file_url ?? "",
      }
    );
    return response.data.data;
  },

  /**
   * Update an existing community group (supports File upload via POST+_method=PATCH or JSON via PATCH).
   */
  async updateCommunity(
    id: number | string,
    payload: AdminCommunityUpdatePayload
  ): Promise<AdminCommunityServerItem> {
    if (payload.banner_file instanceof File) {
      const formData = buildCommunityFormData(payload, true);
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
    const tagIds = resolveTagIds(payload);
    if (tagIds !== undefined) body.tag_ids = tagIds;
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
    const response = await apiClient.put<AdminCommunitiesListResponse>(
      "/admin/communities/sort",
      { community_ids: numericIds }
    );
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.communities)) return data.communities;
    return [];
  },

  /**
   * Delete a community group by ID.
   */
  async deleteCommunity(id: number | string): Promise<void> {
    await apiClient.delete(`/admin/communities/${id}`);
  },
};
