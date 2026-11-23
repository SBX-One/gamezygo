import { apiClient } from "@/lib/api-client";
import type {
  AdminGameRequestItem,
  GameRequestStatus,
  GameRequestTab,
} from "@/features/admin/types/admin-game-request.types";

export interface AdminGameRequestQueryParams {
  status?: GameRequestTab;
  sort_by?: "most_requested" | "latest" | "oldest";
  page?: number;
  per_page?: number;
}

export type BackendGameRequestStatus =
  | "pending"
  | "reviewed"
  | "available"
  | "rejected";

export interface BackendGameRequestItem {
  id: number | string;
  product_name?: string | null;
  name?: string | null;
  total_requests?: number | null;
  request_count?: number | null;
  first_requested_at?: string | null;
  steam_url?: string | null;
  status?: string | null;
  is_pinned?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BackendGameRequestsData {
  total_requests: number;
  pinned_games: {
    total: number;
    items: BackendGameRequestItem[];
  };
  requested_games: {
    total: number;
    items: BackendGameRequestItem[];
    meta: {
      current_page: number;
      from: number | null;
      last_page: number;
      per_page: number;
      to: number | null;
      total: number;
    };
  };
}

export interface BackendGameRequestsResponse {
  status?: string;
  success?: boolean;
  message?: string;
  data: BackendGameRequestsData;
}

export interface AdminGameRequestCounts {
  requested: number;
  accepted: number;
  declined: number;
}

export interface NormalizedAdminGameRequestsResult {
  pinnedItems: AdminGameRequestItem[];
  unpinnedItems: AdminGameRequestItem[];
  totalRequests: number;
  meta: BackendGameRequestsData["requested_games"]["meta"];
}

function toBackendStatus(status?: GameRequestTab | GameRequestStatus): string {
  switch (status) {
    case "accepted":
      return "reviewed";
    case "declined":
      return "rejected";
    case "requested":
    default:
      return "pending";
  }
}

function toFrontendStatus(status?: string | null): GameRequestStatus {
  const normalized = (status || "").toLowerCase();
  if (
    normalized === "reviewed" ||
    normalized === "accepted" ||
    normalized === "available"
  ) {
    return "accepted";
  }
  if (normalized === "rejected" || normalized === "declined") {
    return "declined";
  }
  return "requested";
}

function formatRequestDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapBackendItem(item: BackendGameRequestItem): AdminGameRequestItem {
  return {
    id: String(item.id),
    name: item.product_name || item.name || `Game #${item.id}`,
    requestCount: Number(item.total_requests ?? item.request_count ?? 1),
    firstRequest: formatRequestDate(item.first_requested_at || item.created_at),
    steamUrl: item.steam_url || "",
    isPinned: Boolean(item.is_pinned),
    status: toFrontendStatus(item.status),
    createdAt: item.first_requested_at || item.created_at || undefined,
    updatedAt: item.updated_at || undefined,
  };
}

export const adminGameRequestService = {
  /**
   * Fetch paginated game requests with tab status filter matching be/dev contract
   */
  async getGameRequests(
    params?: AdminGameRequestQueryParams
  ): Promise<NormalizedAdminGameRequestsResult> {
    const queryParams: Record<string, string | number> = {
      status: toBackendStatus(params?.status),
      sort_by: params?.sort_by ?? "most_requested",
    };

    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;

    const response = await apiClient.get<BackendGameRequestsResponse>(
      "/admin/game-requests",
      { params: queryParams }
    );

    const data = response.data.data;

    return {
      pinnedItems: (data?.pinned_games?.items ?? []).map(mapBackendItem),
      unpinnedItems: (data?.requested_games?.items ?? []).map(mapBackendItem),
      totalRequests: Number(data?.total_requests ?? 0),
      meta: data?.requested_games?.meta ?? {
        current_page: 1,
        from: null,
        last_page: 1,
        per_page: params?.per_page ?? 20,
        to: null,
        total: 0,
      },
    };
  },

  /**
   * Fetch live tab counts across pending, reviewed, and rejected statuses
   */
  async getCounts(): Promise<AdminGameRequestCounts> {
    const [pendingRes, reviewedRes, rejectedRes] = await Promise.all([
      apiClient.get<BackendGameRequestsResponse>("/admin/game-requests", {
        params: { status: "pending", per_page: 1 },
      }),
      apiClient.get<BackendGameRequestsResponse>("/admin/game-requests", {
        params: { status: "reviewed", per_page: 1 },
      }),
      apiClient.get<BackendGameRequestsResponse>("/admin/game-requests", {
        params: { status: "rejected", per_page: 1 },
      }),
    ]);

    return {
      requested: Number(pendingRes.data.data?.total_requests ?? 0),
      accepted: Number(reviewedRes.data.data?.total_requests ?? 0),
      declined: Number(rejectedRes.data.data?.total_requests ?? 0),
    };
  },

  /**
   * Update a single game request status via be/dev bulk status endpoint
   */
  async updateStatus(
    id: string | number,
    status: GameRequestStatus
  ): Promise<unknown> {
    const numericId = Number(id);
    const response = await apiClient.post("/admin/game-requests/status", {
      request_ids: [Number.isNaN(numericId) ? id : numericId],
      status: toBackendStatus(status),
    });
    return response.data;
  },

  /**
   * Batch update game requests status via be/dev bulk status endpoint
   */
  async batchUpdateStatus(
    ids: Array<string | number>,
    status: GameRequestStatus
  ): Promise<unknown> {
    const requestIds = ids.map((id) => {
      const numericId = Number(id);
      return Number.isNaN(numericId) ? id : numericId;
    });

    const response = await apiClient.post("/admin/game-requests/status", {
      request_ids: requestIds,
      status: toBackendStatus(status),
    });
    return response.data;
  },

  /**
   * Toggle pin state of a game request directly on be/dev
   */
  async togglePin(id: string | number): Promise<unknown> {
    const response = await apiClient.post(`/admin/game-requests/${id}/pin`);
    return response.data;
  },
};
