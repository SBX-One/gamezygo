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

function mapVoucherSortBy(
  sortBy?: string
): "latest" | "oldest" | "most_used" | "highest_discount" | undefined {
  if (!sortBy) return undefined;
  switch (sortBy) {
    case "terbaru":
    case "latest":
      return "latest";
    case "oldest":
      return "oldest";
    case "value_desc":
    case "highest_discount":
      return "highest_discount";
    case "most_used":
      return "most_used";
    default:
      return "latest";
  }
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
        sort_by: mapVoucherSortBy(params?.sort_by),
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
   * Delete a single voucher (backend uses bulk DELETE /admin/vouchers with ids array)
   */
  async deleteVoucher(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.batchDelete([id] as string[] | number[]);
  },

  /**
   * Batch delete vouchers
   */
  async batchDelete(ids: string[] | number[]): Promise<{ success: boolean; message: string }> {
    const numericIds = ids
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    const response = await apiClient.delete<{ success: boolean; message: string }>("/admin/vouchers", {
      data: { ids: numericIds.length > 0 ? numericIds : ids },
    });
    return response.data;
  },

  /**
   * Export vouchers CSV from backend
   */
  async exportVouchersCsv(params?: AdminVoucherQueryParams): Promise<Blob> {
    const response = await apiClient.get<Blob>("/admin/vouchers/export", {
      params: {
        search: params?.search,
        status: params?.status && params?.status !== "all" ? params.status : undefined,
        sort_by: params?.sort_by,
      },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Export voucher usages CSV from backend
   */
  async exportUsagesCsv(
    id: string | number,
    params?: { search?: string; status?: string }
  ): Promise<Blob> {
    const response = await apiClient.get<Blob>(`/admin/vouchers/${id}/usages/export`, {
      params: {
        search: params?.search,
        status: params?.status,
      },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Search and paginate eligible products for voucher targeting
   */
  async getEligibleProducts(params?: {
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    products: Array<{
      id: string;
      name: string;
      image_url: string;
      price: number;
      categories: string[];
    }>;
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const response = await apiClient.get<{
      data?: {
        products?: Array<{
          id: number | string;
          name?: string;
          image_url?: string;
          price?: number;
          categories?: string[];
        }>;
        meta?: {
          current_page?: number;
          last_page?: number;
          per_page?: number;
          total?: number;
        };
      };
    }>("/admin/vouchers/eligible-products", {
      params: {
        search: params?.search || undefined,
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 50,
      },
    });
    const raw = response.data?.data;
    const products = (Array.isArray(raw?.products) ? raw.products : []).map((p) => ({
      id: String(p.id),
      name: String(p.name ?? "Game"),
      image_url: String(p.image_url ?? ""),
      price: Number(p.price ?? 0),
      categories: Array.isArray(p.categories) ? p.categories : [],
    }));
    return {
      products,
      meta: {
        current_page: Number(raw?.meta?.current_page ?? 1),
        last_page: Number(raw?.meta?.last_page ?? 1),
        per_page: Number(raw?.meta?.per_page ?? params?.per_page ?? 50),
        total: Number(raw?.meta?.total ?? products.length),
      },
    };
  },

  /**
   * Search and paginate eligible users for voucher targeting
   */
  async getEligibleUsers(params?: {
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    users: Array<{
      id: string;
      email: string;
      total_points: number;
    }>;
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const response = await apiClient.get<{
      data?: {
        users?: Array<{
          id: number | string;
          email?: string;
          total_points?: number;
        }>;
        meta?: {
          current_page?: number;
          last_page?: number;
          per_page?: number;
          total?: number;
        };
      };
    }>("/admin/vouchers/eligible-users", {
      params: {
        search: params?.search || undefined,
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 50,
      },
    });
    const raw = response.data?.data;
    const users = (Array.isArray(raw?.users) ? raw.users : []).map((u) => ({
      id: String(u.id),
      email: String(u.email ?? "-"),
      total_points: Number(u.total_points ?? 0),
    }));
    return {
      users,
      meta: {
        current_page: Number(raw?.meta?.current_page ?? 1),
        last_page: Number(raw?.meta?.last_page ?? 1),
        per_page: Number(raw?.meta?.per_page ?? params?.per_page ?? 50),
        total: Number(raw?.meta?.total ?? users.length),
      },
    };
  },

  /**
   * Add target products to an existing voucher
   */
  async addProducts(
    id: string | number,
    productIds: Array<string | number>
  ): Promise<unknown> {
    const numericIds = productIds.map((pid) => Number(pid)).filter((n) => !Number.isNaN(n));
    const response = await apiClient.post(`/admin/vouchers/${id}/products`, {
      product_ids: numericIds,
    });
    return response.data;
  },

  /**
   * Remove target products from an existing voucher
   */
  async removeProducts(
    id: string | number,
    productIds: Array<string | number>
  ): Promise<unknown> {
    const numericIds = productIds.map((pid) => Number(pid)).filter((n) => !Number.isNaN(n));
    const response = await apiClient.delete(`/admin/vouchers/${id}/products`, {
      data: { product_ids: numericIds },
    });
    return response.data;
  },

  /**
   * Add target users to an existing voucher
   */
  async addUsers(
    id: string | number,
    userIds: Array<string | number>
  ): Promise<unknown> {
    const numericIds = userIds.map((uid) => Number(uid)).filter((n) => !Number.isNaN(n));
    const response = await apiClient.post(`/admin/vouchers/${id}/users`, {
      user_ids: numericIds,
    });
    return response.data;
  },

  /**
   * Remove target users from an existing voucher
   */
  async removeUsers(
    id: string | number,
    userIds: Array<string | number>
  ): Promise<unknown> {
    const numericIds = userIds.map((uid) => Number(uid)).filter((n) => !Number.isNaN(n));
    const response = await apiClient.delete(`/admin/vouchers/${id}/users`, {
      data: { user_ids: numericIds },
    });
    return response.data;
  },

  /**
   * Get voucher analytics
   */
  async getAnalytics(params?: {
    code?: string;
    id?: string | number;
    page?: number;
    per_page?: number;
    period?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<AdminVoucherAnalyticsResponse> {
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
        `/admin/vouchers/${targetId}/analytics`,
        {
          params: {
            period: params?.period,
            start_date: params?.start_date,
            end_date: params?.end_date,
          },
        }
      ),
      apiClient
        .get<{
          success?: boolean;
          message?: string;
          data?: {
            usages?: Record<string, unknown>[];
            orders?: Record<string, unknown>[];
            meta?: {
              current_page?: number;
              last_page?: number;
              total?: number;
              per_page?: number;
            };
          };
        }>(`/admin/vouchers/${targetId}/usages`, {
          params: {
            page: params?.page ?? 1,
            per_page: params?.per_page ?? 10,
          },
        })
        .catch(() => null),
    ]);

    const raw = (analyticsRes.data?.data ?? {}) as Record<string, unknown>;
    const voucher = (raw.voucher ?? {}) as Record<string, unknown>;
    const stats = (raw.statistics ?? {}) as Record<string, unknown>;
    const rawGames = Array.isArray(raw.target_games) ? (raw.target_games as Record<string, unknown>[]) : [];
    const rawUsers = Array.isArray(raw.target_users) ? (raw.target_users as Record<string, unknown>[]) : [];
    const rawChartObj = (raw.revenue_chart ?? {}) as Record<string, unknown>;
    const rawChart = Array.isArray(rawChartObj.data) ? (rawChartObj.data as Record<string, unknown>[]) : [];
    const usagesData = usagesRes?.data?.data;
    const rawUsages = Array.isArray(usagesData?.usages)
      ? usagesData.usages
      : Array.isArray(usagesData?.orders)
      ? usagesData.orders
      : [];

    const formatChartDay = (dateStr?: string): string => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      return dayNames[d.getDay()] || dateStr;
    };

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
        day: formatChartDay(String(point.date ?? point.day ?? "")),
        revenue: Number(point.revenue ?? 0),
      })),
      orders: rawUsages.map((u, idx) => {
        const userObj = (u.user ?? {}) as Record<string, unknown>;
        const rawStatus = String(u.status ?? "").toLowerCase();
        const isSuccess =
          rawStatus === "completed" ||
          rawStatus === "paid" ||
          rawStatus === "settled" ||
          rawStatus === "success";
        const isFailed =
          rawStatus === "failed" ||
          rawStatus === "cancelled" ||
          rawStatus === "expired" ||
          rawStatus === "refunded";

        return {
          id: String(u.id ?? idx + 1),
          orderId: String(
            u.order_code ??
            u.order_number ??
            u.order_id ??
            (u.id ? `ORD-${u.id}` : "-")
          ),
          customerEmail: String(
            u.customer_email ??
            u.user_email ??
            userObj.email ??
            "-"
          ),
          status: isSuccess ? "completed" : isFailed ? "failed" : "pending",
          price: formatIdr(
            Number(
              u.total ??
              u.total_price ??
              u.subtotal ??
              u.subtotal_price ??
              u.discount_amount ??
              u.amount ??
              u.price ??
              0
            )
          ),
          date: formatVoucherDate(
            typeof u.used_at === "string"
              ? u.used_at
              : typeof u.paid_at === "string"
              ? u.paid_at
              : typeof u.created_at === "string"
              ? u.created_at
              : null
          ),
        };
      }),
      meta: {
        currentPage: Number(usagesData?.meta?.current_page ?? 1),
        totalPages: Math.max(1, Number(usagesData?.meta?.last_page ?? 1)),
        total: Number(usagesData?.meta?.total ?? rawUsages.length),
      },
    };

    return {
      success: Boolean(analyticsRes.data?.success ?? true),
      message: String(analyticsRes.data?.message ?? ""),
      data: mappedData,
    };
  },
};

