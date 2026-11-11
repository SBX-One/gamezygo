import { apiClient } from "@/lib/api-client";

export interface AdminAnnouncementServerItem {
  id: number;
  banner_file_url: string;
  link: string;
  is_published: boolean;
  order_number: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminAnnouncementsListResponse {
  success: boolean;
  message: string;
  data: AdminAnnouncementServerItem[];
}

export interface AdminAnnouncementMutationResponse {
  success: boolean;
  message: string;
  data: AdminAnnouncementServerItem;
}

export interface AdminAnnouncementSavePayload {
  link?: string | null;
  is_published?: boolean;
  banner_file?: File | null;
  banner_file_url?: string | null;
}

export interface AdminAnnouncementUpdatePayload {
  link?: string | null;
  is_published?: boolean;
  sort_order?: number;
  banner_file?: File | null;
  banner_file_url?: string | null;
}

function buildAnnouncementFormData(
  payload: Partial<AdminAnnouncementSavePayload & AdminAnnouncementUpdatePayload>
): FormData {
  const formData = new FormData();

  if (payload.link !== undefined) {
    formData.append("link", payload.link ?? "");
  }
  if (payload.is_published !== undefined) {
    formData.append("is_published", payload.is_published ? "1" : "0");
  }
  if (payload.sort_order !== undefined) {
    formData.append("sort_order", String(payload.sort_order));
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

export const adminAnnouncementService = {
  /**
   * Fetch all announcements ordered by sort_order.
   */
  async getAnnouncements(): Promise<AdminAnnouncementServerItem[]> {
    const response = await apiClient.get<AdminAnnouncementsListResponse>(
      "/admin/announcements"
    );
    return response.data.data ?? [];
  },

  /**
   * Create a new announcement banner (supports File upload or URL).
   */
  async createAnnouncement(
    payload: AdminAnnouncementSavePayload
  ): Promise<AdminAnnouncementServerItem> {
    if (payload.banner_file instanceof File) {
      const formData = buildAnnouncementFormData(payload);
      const response = await apiClient.post<AdminAnnouncementMutationResponse>(
        "/admin/announcements",
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return response.data.data;
    }

    const response = await apiClient.post<AdminAnnouncementMutationResponse>(
      "/admin/announcements",
      {
        link: payload.link ?? "",
        is_published: payload.is_published ?? true,
        banner_file_url: payload.banner_file_url ?? "",
      }
    );
    return response.data.data;
  },

  /**
   * Update an existing announcement banner (supports File upload via POST or JSON via PATCH).
   */
  async updateAnnouncement(
    id: number | string,
    payload: AdminAnnouncementUpdatePayload
  ): Promise<AdminAnnouncementServerItem> {
    if (payload.banner_file instanceof File) {
      const formData = buildAnnouncementFormData(payload);
      const response = await apiClient.post<AdminAnnouncementMutationResponse>(
        `/admin/announcements/${id}`,
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return response.data.data;
    }

    const body: Record<string, unknown> = {};
    if (payload.link !== undefined) body.link = payload.link ?? "";
    if (payload.is_published !== undefined) {
      body.is_published = payload.is_published;
    }
    if (payload.sort_order !== undefined) {
      body.sort_order = payload.sort_order;
    }
    if (payload.banner_file_url !== undefined) {
      body.banner_file_url = payload.banner_file_url;
    }

    const response = await apiClient.patch<AdminAnnouncementMutationResponse>(
      `/admin/announcements/${id}`,
      body
    );
    return response.data.data;
  },

  /**
   * Persist reordered announcement sequence by ID array.
   */
  async sortAnnouncements(
    ids: Array<number | string>
  ): Promise<AdminAnnouncementServerItem[]> {
    const numericIds = ids
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    const response = await apiClient.post<AdminAnnouncementsListResponse>(
      "/admin/announcements/sort",
      { ids: numericIds }
    );
    return response.data.data ?? [];
  },

  /**
   * Delete an announcement banner by ID.
   */
  async deleteAnnouncement(id: number | string): Promise<void> {
    await apiClient.delete(`/admin/announcements/${id}`);
  },
};

