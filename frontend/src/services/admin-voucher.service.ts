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

const formatIdr = (value: number): string =>
  `IDR ${(Number.isFinite(value) ? value : 0).toLocaleString("id-ID")}`;

const formatVoucherDate = (iso?: string | null): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const mapVoucherItem = (raw: Record<string, unknown>): AdminVoucherItem => {
  const rawType = String(raw.discount_type ?? "fixed").toLowerCase();
  const isPercentage = rawType === "percent" || rawType === "percentage";
  const rawValue = Number(raw.discount_value ?? raw.discount_amount ?? 0);
  const rawStatus = String(raw.status ?? (raw.is_active ? "active" : "inactive")).toLowerCase();
  const mappedStatus: AdminVoucherItem["status"] =
    rawStatus === "draft"
      ? "draft"
      : rawStatus === "expired"
      ? "expired"
      : rawStatus === "active" && raw.is_active !== false
      ? "active"
      : "inactive";

  return {
    id: String(raw.id ?? ""),
    code: String(raw.code ?? ""),
    usageCount: Number(raw.total_usage ?? raw.usage_count ?? 0),
    usageLimit: raw.slot !== null && raw.slot !== undefined ? Number(raw.slot) : undefined,
    discountAmount: isPercentage ? 0 : rawValue,
    discountType: isPercentage ? "percentage" : "flat",
    percentageValue: isPercentage ? rawValue : undefined,
    status: mappedStatus,
    isActive: Boolean(raw.is_active ?? mappedStatus === "active"),
    validityPeriod: formatVoucherDate(
      typeof raw.expired_at === "string"
        ? raw.expired_at
        : typeof raw.started_at === "string"
        ? raw.started_at
        : null
    ),
    expiresAt: raw.expired_at ? String(raw.expired_at) : undefined,
    minPurchase: raw.min_purchase !== undefined ? Number(raw.min_purchase) : undefined,
    description: raw.name ? String(raw.name) : undefined,
    createdAt: raw.created_at ? String(raw.created_at) : undefined,
  };
};

interface RawVouchersApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    vouchers?: Record<string, unknown>[];
    pagination?: Record<string, unknown>;
    meta?: Record<string, unknown>;
  };
}

export const adminVoucherService = {
  /**
   * Fetch paginated vouchers with search, status filters, and sorting
   */
  async getVouchers(params?: AdminVoucherQueryParams): Promise<AdminVouchersListResponse> {
    const response = await apiClient.get<RawVouchersApiResponse>("/admin/vouchers", {
      params: {
        search: params?.search,
        status: params?.status && params?.status !== "all" ? params.status : undefined,
        sort_by: params?.sort_by,
        page: params?.page,
        per_page: params?.per_page ?? 10,
      },
    });
    const payload = response.data;
    const rawData = payload?.data ?? {};
    const rawList = Array.isArray(rawData.vouchers) ? rawData.vouchers : [];
    const vouchers = rawList.map(mapVoucherItem);
    const pagination = rawData.pagination ?? rawData.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page ?? 10,
      total: vouchers.length,
    };

    return {
      success: Boolean(payload?.success ?? true),
      message: String(payload?.message ?? ""),
      data: {
        vouchers,
        meta: {
          current_page: Number(pagination.current_page ?? 1),
          last_page: Number(pagination.last_page ?? 1),
          per_page: Number(pagination.per_page ?? 10),
          total: Number(pagination.total ?? vouchers.length),
        },
      },
    };
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
    let targetId = params?.id;

    if (!targetId) {
      const listRes = await this.getVouchers({
        search: params?.code || undefined,
        per_page: 10,
      });
      const matched = params?.code
        ? listRes.data.vouchers.find(
            (v) => v.code.toUpperCase() === params.code?.toUpperCase()
          ) ?? listRes.data.vouchers[0]
        : listRes.data.vouchers[0];
      targetId = matched?.id;
    }

    if (!targetId) {
      return {
        success: true,
        message: "No voucher found",
        data: {
          summary: {
            voucherCode: params?.code?.toUpperCase() || "-",
            discountPercentage: 0,
            totalUsage: 0,
            totalBurn: "IDR 0",
          },
          targetGames: [],
          targetUsers: [],
          revenueChart: [],
          orders: [],
        },
      };
    }

    const [analyticsRes, usagesRes] = await Promise.all([
      apiClient.get<{ success?: boolean; message?: string; data?: Record<string, unknown> }>(
        `/admin/vouchers/${targetId}/analytics`
      ),
      apiClient
        .get<{ data?: { usages?: Record<string, unknown>[]; orders?: Record<string, unknown>[] } }>(
          `/admin/vouchers/${targetId}/usages`
        )
        .catch(() => null),
    ]);

    const raw = (analyticsRes.data?.data ?? {}) as Record<string, unknown>;
    const voucher = (raw.voucher ?? {}) as Record<string, unknown>;
    const stats = (raw.statistics ?? {}) as Record<string, unknown>;
    const rawGames = Array.isArray(raw.target_games) ? (raw.target_games as Record<string, unknown>[]) : [];
    const rawUsers = Array.isArray(raw.target_users) ? (raw.target_users as Record<string, unknown>[]) : [];
    const rawChartObj = (raw.revenue_chart ?? {}) as Record<string, unknown>;
    const rawChart = Array.isArray(rawChartObj.data) ? (rawChartObj.data as Record<string, unknown>[]) : [];
    const rawUsages = Array.isArray(usagesRes?.data?.data?.usages)
      ? usagesRes.data.data.usages
      : Array.isArray(usagesRes?.data?.data?.orders)
      ? usagesRes.data.data.orders
      : [];

    const mappedData: VoucherAnalyticsData = {
      summary: {
        voucherCode: String(voucher.code ?? params?.code ?? "-").toUpperCase(),
        discountPercentage:
          voucher.discount_type === "percent" || voucher.discount_type === "percentage"
            ? Number(voucher.discount_value ?? 0)
            : 0,
        totalUsage: Number(stats.total_usage ?? 0),
        totalBurn: formatIdr(Number(stats.total_burn ?? 0)),
      },
      targetGames: rawGames.map((g) => ({
        id: String(g.id ?? ""),
        title: String(g.name ?? g.title ?? "Game"),
        coverImage: String(g.image_url ?? g.cover_image ?? ""),
        discountBadge: g.discount_percentage ? `${g.discount_percentage}% OFF` : "",
        originalPrice: formatIdr(Number(g.original_price ?? 0)),
        discountedPrice: formatIdr(Number(g.discounted_price ?? 0)),
      })),
      targetUsers: rawUsers.map((u) => ({
        id: String(u.id ?? ""),
        email: String(u.email ?? "-"),
      })),
      revenueChart: rawChart.map((point) => ({
        day: String(point.date ?? point.day ?? ""),
        revenue: Number(point.revenue ?? 0),
      })),
      orders: rawUsages.map((u, idx) => {
        const userObj = (u.user ?? {}) as Record<string, unknown>;
        return {
          id: String(u.id ?? idx + 1),
          orderId: String(u.order_number ?? u.order_id ?? u.id ?? "-"),
          customerEmail: String(u.user_email ?? u.customer_email ?? userObj.email ?? "-"),
          status:
            u.status === "completed" || u.status === "paid" || u.status === "success"
              ? "completed"
              : u.status === "failed"
              ? "failed"
              : "pending",
          price: formatIdr(Number(u.discount_amount ?? u.amount ?? u.price ?? 0)),
          date: formatVoucherDate(
            typeof u.used_at === "string"
              ? u.used_at
              : typeof u.created_at === "string"
              ? u.created_at
              : null
          ),
        };
      }),
    };

    return {
      success: Boolean(analyticsRes.data?.success ?? true),
      message: String(analyticsRes.data?.message ?? ""),
      data: mappedData,
    };
  },
};

