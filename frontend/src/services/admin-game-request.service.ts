import { apiClient } from "@/lib/api-client";
import type { GameRequestTab } from "@/features/admin/types/admin-game-request.types";

export interface AdminGameRequestQueryParams {
  status?: GameRequestTab;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface AdminGameRequestServerItem {
  id: string;
  name: string;
  request_count: number;
  first_request: string;
  steam_url: string;
  is_pinned: boolean;
  status: "requested" | "accepted" | "declined";
  note?: string | null;
  admin_note?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminGameRequestsResponse {
  success: boolean;
  message: string;
  data: {
    counts: {
      requested: number;
      accepted: number;
      declined: number;
    };
    requests: AdminGameRequestServerItem[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export const adminGameRequestService = {
  /**
   * Fetch paginated game requests with tab status filter from the database
   */
  async getGameRequests(
    params?: AdminGameRequestQueryParams
  ): Promise<AdminGameRequestsResponse["data"]> {
    const response = await apiClient.get<AdminGameRequestsResponse>(
      "/admin/game-requests",
      { params }
    );
    return response.data.data;
  },

  /**
   * Update a single game request status (accept, decline, cancel/revert)
   */
  async updateStatus(
    id: string | number,
    status: "accepted" | "declined" | "requested",
    adminNote?: string
  ): Promise<unknown> {
    const response = await apiClient.patch(
      `/admin/game-requests/${id}/status`,
      {
        status,
        admin_note: adminNote,
      }
    );
    return response.data;
  },

  /**
   * Batch update game requests status
   */
  async batchUpdateStatus(
    ids: Array<string | number>,
    status: "accepted" | "declined" | "requested"
  ): Promise<unknown> {
    const response = await apiClient.patch(
      "/admin/game-requests/batch-status",
      {
        ids,
        status,
      }
    );
    return response.data;
  },

  /**
   * Toggle pin state of a game request
   */
  async togglePin(
    id: string | number,
    isPinned?: boolean
  ): Promise<unknown> {
    const strId = String(id);
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("gamezygo_admin_pinned_requests");
        let list: string[] = raw ? JSON.parse(raw) : [];
        if (isPinned === true) {
          if (!list.includes(strId)) list.push(strId);
        } else if (isPinned === false) {
          list = list.filter((x) => x !== strId);
        } else {
          list = list.includes(strId) ? list.filter((x) => x !== strId) : [...list, strId];
        }
        localStorage.setItem("gamezygo_admin_pinned_requests", JSON.stringify(list));
      } catch {
        // ignore
      }
    }
    return { success: true };
  },

  /**
   * Delete a game request
   */
  async deleteRequest(id: string | number): Promise<unknown> {
    const response = await apiClient.delete(`/admin/game-requests/${id}`);
    return response.data;
  },
};

