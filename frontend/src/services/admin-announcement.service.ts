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

interface RawAnnouncementItem {
  id: number;
  banner_file_url?: string;
  link?: string;
  is_publish?: boolean;
  is_published?: boolean;
  sort?: number;
  order_number?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

function normalizeAnnouncement(raw: RawAnnouncementItem): AdminAnnouncementServerItem {
  return {
    id: Number(raw.id),
    banner_file_url: String(raw.banner_file_url ?? ""),
    link: String(raw.link ?? ""),
    is_published: Boolean(raw.is_publish ?? raw.is_published ?? false),
    order_number: Number(raw.sort ?? raw.order_number ?? 0),
    created_at: raw.created_at ?? null,
    updated_at: raw.updated_at ?? null,
  };
}

export interface AdminAnnouncementsListResponse {
  success: boolean;
  message: string;
  data:
    | RawAnnouncementItem[]
    | {
        total_announcements?: number;
        announcements?: RawAnnouncementItem[];
      };
}

export interface AdminAnnouncementMutationResponse {
  success: boolean;
  message: string;
  data: RawAnnouncementItem;
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
  payload: Partial<AdminAnnouncementSavePayload & AdminAnnouncementUpdatePayload>,
  isUpdate = false
): FormData {
  const formData = new FormData();

  if (isUpdate) {
    formData.append("_method", "PUT");
  }
  if (payload.link !== undefined) {
    formData.append("link", payload.link ?? "");
  }
  if (payload.is_published !== undefined) {
    formData.append("is_publish", payload.is_published ? "1" : "0");
  }
  if (payload.sort_order !== undefined) {
    formData.append("sort", String(payload.sort_order));
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
   * Fetch all announcements ordered by sort.
   */
  async getAnnouncements(): Promise<AdminAnnouncementServerItem[]> {
    const response = await apiClient.get<AdminAnnouncementsListResponse>(
      "/admin/announcements"
    );
    const data = response.data?.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.announcements)
      ? data.announcements
      : [];
    return rawList.map(normalizeAnnouncement);
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
      return normalizeAnnouncement(response.data.data);
    }

    const response = await apiClient.post<AdminAnnouncementMutationResponse>(
      "/admin/announcements",
      {
        link: payload.link ?? "",
        is_publish: payload.is_published ?? true,
        banner_file: payload.banner_file_url ?? "",
      }
    );
    return normalizeAnnouncement(response.data.data);
  },

  /**
   * Update an existing announcement banner.
   */
  async updateAnnouncement(
    id: number | string,
    payload: AdminAnnouncementUpdatePayload
  ): Promise<AdminAnnouncementServerItem> {
    if (
      payload.is_published !== undefined &&
      payload.link === undefined &&
      payload.banner_file === undefined &&
      payload.banner_file_url === undefined &&
      payload.sort_order === undefined
    ) {
      const response = await apiClient.patch<AdminAnnouncementMutationResponse>(
        `/admin/announcements/${id}/publish`,
        { is_publish: payload.is_published }
      );
      return normalizeAnnouncement(response.data.data);
    }

    if (payload.banner_file instanceof File) {
      const formData = buildAnnouncementFormData(payload, true);
      const response = await apiClient.post<AdminAnnouncementMutationResponse>(
        `/admin/announcements/${id}`,
        formData,
        { headers: { "Content-Type": undefined } }
      );
      return normalizeAnnouncement(response.data.data);
    }

    const body: Record<string, unknown> = {};
    if (payload.link !== undefined) body.link = payload.link ?? "";
    if (payload.is_published !== undefined) {
      body.is_publish = payload.is_published;
    }
    if (payload.sort_order !== undefined) {
      body.sort = payload.sort_order;
    }
    if (payload.banner_file_url !== undefined) {
      body.banner_file = payload.banner_file_url;
    }

    const response = await apiClient.put<AdminAnnouncementMutationResponse>(
      `/admin/announcements/${id}`,
      body
    );
    return normalizeAnnouncement(response.data.data);
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
    const response = await apiClient.put<AdminAnnouncementsListResponse>(
      "/admin/announcements/sort",
      { announcement_ids: numericIds }
    );
    const data = response.data?.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.announcements)
      ? data.announcements
      : [];
    return rawList.map(normalizeAnnouncement);
  },

  /**
   * Delete an announcement banner by ID.
   */
  async deleteAnnouncement(id: number | string): Promise<void> {
    await apiClient.delete(`/admin/announcements/${id}`);
  },
};
