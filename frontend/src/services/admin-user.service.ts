import { apiClient } from "@/lib/api-client";
import type {
  AdminUserItem,
  UserStatus,
} from "@/features/admin/types/admin-user.types";

export interface AdminUserQueryParams {
  search?: string;
  bundle?: string;
  status?: string;
  login_type?: string;
  min_points?: number;
  max_points?: number;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface AdminUsersListResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUserItem[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface AdminUserDetailResponse {
  success: boolean;
  message: string;
  data: AdminUserItem;
}

export const adminUserService = {
  /**
   * Fetch paginated users with search, status filters, and sorting
   */
  async getUsers(params?: AdminUserQueryParams): Promise<AdminUsersListResponse> {
    const response = await apiClient.get<AdminUsersListResponse>("/admin/users", {
      params: {
        search: params?.search,
        bundle: params?.bundle || undefined,
        status: params?.status || undefined,
        login_type: params?.login_type || undefined,
        min_points: params?.min_points,
        max_points: params?.max_points,
        sort_by: params?.sort_by,
        page: params?.page,
        per_page: params?.per_page ?? 10,
      },
    });
    return response.data;
  },

  /**
   * Fetch detailed profile of a single user
   */
  async getUser(id: string | number): Promise<AdminUserDetailResponse> {
    const response = await apiClient.get<AdminUserDetailResponse>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update user status (Active, Suspended, Banned, Pending)
   */
  async updateStatus(id: string | number, status: UserStatus): Promise<{ success: boolean; data: { id: string; status: UserStatus } }> {
    const response = await apiClient.patch<{ success: boolean; data: { id: string; status: UserStatus } }>(`/admin/users/${id}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Update user points or subscription duration
   */
  async updateUser(id: string | number, data: Record<string, unknown>): Promise<{ success: boolean; data: unknown }> {
    const response = await apiClient.put<{ success: boolean; data: unknown }>(`/admin/users/${id}`, data);
    return response.data;
  },

  /**
   * Wipe user session / auth tokens
   */
  async wipeSession(id: string | number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/admin/users/${id}/wipe`);
    return response.data;
  },
};

