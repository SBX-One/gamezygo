import { apiClient } from "@/lib/api-client";
import type {
  AdminVoucherItem,
  AdminAddVoucherFormData,
} from "@/features/admin/types/admin-voucher.types";
import type { VoucherAnalyticsData } from "@/features/admin/types/admin-voucher-analytics.types";

export interface AdminVoucherQueryParams {
  search?: string;
  status?: "all" | "active" | "inactive" | "expired" | "draft";
  sort_by?: "terbaru" | "code_asc" | "value_desc" | "value_asc" | string;
  page?: number;
  per_page?: number;
}

export interface AdminVouchersListResponse {
  success: boolean;
  message: string;
  data: {
    vouchers: AdminVoucherItem[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface AdminVoucherDetailResponse {
  success: boolean;
  message: string;
  data: AdminVoucherItem & {
    targetGames?: Array<{
      id: string;
      title: string;
      imageSrc: string;
      originalPrice: number;
      discountedPrice: number;
    }>;
    targetUsers?: Array<{
      id: string;
      email: string;
      points?: string;
    }>;
  };
}

export interface AdminVoucherAnalyticsResponse {
  success: boolean;
  message: string;
  data: VoucherAnalyticsData;
}

export const adminVoucherService = {
  /**
   * Fetch paginated vouchers with search, status filters, and sorting
   */
  async getVouchers(params?: AdminVoucherQueryParams): Promise<AdminVouchersListResponse> {
    const response = await apiClient.get<AdminVouchersListResponse>("/admin/vouchers", {
      params: {
        search: params?.search,
        status: params?.status && params.status !== "all" ? params.status : undefined,
        sort_by: params?.sort_by,
        page: params?.page,
        per_page: params?.per_page ?? 10,
      },
    });
    return response.data;
  },

  /**
   * Fetch detail of a voucher
   */
  async getVoucher(id: string | number): Promise<AdminVoucherDetailResponse> {
    const response = await apiClient.get<AdminVoucherDetailResponse>(`/admin/vouchers/${id}`);
    return response.data;
  },

  /**
   * Create a new voucher
   */
  async createVoucher(data: Partial<AdminAddVoucherFormData> & Record<string, unknown>): Promise<{ success: boolean; data: { id: string; code: string } }> {
    const response = await apiClient.post<{ success: boolean; data: { id: string; code: string } }>("/admin/vouchers", data);
    return response.data;
  },

  /**
   * Update existing voucher
   */
  async updateVoucher(id: string | number, data: Record<string, unknown>): Promise<{ success: boolean; data: unknown }> {
    const response = await apiClient.put<{ success: boolean; data: unknown }>(`/admin/vouchers/${id}`, data);
    return response.data;
  },

  /**
   * Toggle active status
   */
  async toggleStatus(id: string | number, isActive?: boolean): Promise<{ success: boolean; data: { id: string; is_active: boolean; status: string } }> {
    const response = await apiClient.patch<{ success: boolean; data: { id: string; is_active: boolean; status: string } }>(`/admin/vouchers/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  /**
   * Delete a single voucher
   */
  async deleteVoucher(id: string | number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/admin/vouchers/${id}`);
    return response.data;
  },

  /**
   * Batch delete vouchers
   */
  async batchDelete(ids: string[] | number[]): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>("/admin/vouchers", {
      data: { ids },
    });
    return response.data;
  },

  /**
   * Get voucher analytics
   */
  async getAnalytics(params?: { code?: string; id?: string | number }): Promise<AdminVoucherAnalyticsResponse> {
    const url = params?.id ? `/admin/vouchers/${params.id}/analytics` : "/admin/vouchers/analytics";
    const response = await apiClient.get<AdminVoucherAnalyticsResponse>(url, {
      params: { code: params?.code },
    });
    return response.data;
  },
};

