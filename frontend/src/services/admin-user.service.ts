import { apiClient } from "@/lib/api-client";
import { formatPaymentMethodLabel } from "@/features/history/utils/payment-method";
import type {
  AdminUserDeviceLogin,
  AdminUserItem,
  AdminUserProduct,
  AdminUserTransaction,
  UserLoginType,
  UserStatus,
} from "@/features/admin/types/admin-user.types";

export interface AdminUserQueryParams {
  search?: string;
  bundle?: string;
  subscription_plan_id?: number | string;
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
    total_users?: number;
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

export function toBackendUserId(id: string | number): string | number {
  if (typeof id === "number") return id;
  if (!id) return id;
  const trimmed = String(id).trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const matched = trimmed.match(/^GZO-?0*(\d+)$/i);
  if (matched && matched[1]) {
    return matched[1];
  }
  return trimmed;
}

function formatUserDate(iso?: string | null, withTime = false): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (!withTime) return `${dd}/${mm}/${yyyy}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

function mapLoginType(raw?: unknown): UserLoginType {
  const val = String(raw ?? "email").toLowerCase();
  if (val.includes("google")) return "Google Account";
  if (val.includes("steam")) return "Steam";
  return "Email & Password";
}

function mapUserStatus(raw?: unknown): UserStatus {
  const val = String(raw ?? "active").toLowerCase();
  if (val === "suspended") return "Suspended";
  if (val === "banned") return "Banned";
  if (val === "pending" || val === "inactive") return "Pending";
  return "Active";
}

function mapBackendUser(raw: Record<string, unknown>): AdminUserItem {
  const sub = (raw.subscription ?? null) as Record<string, unknown> | null;
  const stats = (raw.statistics ?? {}) as Record<string, unknown>;

  const rawId = raw.id !== undefined && raw.id !== null ? String(raw.id) : "";
  const customerId = raw.customer_id
    ? String(raw.customer_id)
    : rawId
    ? `GZO-${rawId.padStart(8, "0")}`
    : "";

  return {
    id: rawId || customerId,
    customerId: customerId || rawId,
    email: String(raw.email ?? "-"),
    username: raw.username ? String(raw.username) : undefined,
    name: raw.name ? String(raw.name) : raw.username ? String(raw.username) : undefined,
    loginType: mapLoginType(raw.login_type),
    points: Number(stats.current_points ?? raw.points ?? raw.total_points ?? 0),
    subscription: sub?.name ? String(sub.name) : "Free",
    subsDuration: sub?.remaining_duration_label
      ? String(sub.remaining_duration_label)
      : sub?.duration_months !== undefined && sub?.duration_months !== null
      ? `${sub.duration_months} months`
      : undefined,
    lifetimeValue:
      stats.lifetime_value !== undefined ? Number(stats.lifetime_value) : undefined,
    joinDate: formatUserDate(
      typeof raw.created_at === "string" ? raw.created_at : null
    ),
    status: mapUserStatus(raw.status),
    lastLogin: formatUserDate(
      typeof raw.updated_at === "string"
        ? raw.updated_at
        : typeof raw.created_at === "string"
        ? raw.created_at
        : null
    ),
    avatarUrl: raw.avatar_url ? String(raw.avatar_url) : undefined,
    totalOrders:
      stats.total_transactions !== undefined
        ? Number(stats.total_transactions)
        : undefined,
    totalSpent:
      stats.lifetime_value !== undefined ? Number(stats.lifetime_value) : undefined,
  };
}

function mapBundleToPlanId(bundle?: string): number | undefined {
  if (!bundle) return undefined;
  const match = bundle.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

export const adminUserService = {
  /**
   * Fetch paginated users matching Postman /admin/users contract.
   */
  async getUsers(params?: AdminUserQueryParams): Promise<AdminUsersListResponse> {
    const subscriptionPlanId =
      params?.subscription_plan_id ?? mapBundleToPlanId(params?.bundle);
    const sortBy =
      params?.sort_by === "terbaru" ? "latest" : params?.sort_by || undefined;

    const response = await apiClient.get<{
      success?: boolean;
      message?: string;
      data?: {
        total_users?: number;
        users?: Record<string, unknown>[];
        meta?: AdminUsersListResponse["data"]["meta"];
      };
    }>("/admin/users", {
      params: {
        search: params?.search,
        subscription_plan_id: subscriptionPlanId,
        status: params?.status ? params.status.toLowerCase() : undefined,
        login_type: params?.login_type
          ? params.login_type.toLowerCase().includes("google")
            ? "google"
            : "email"
          : undefined,
        min_points: params?.min_points,
        max_points: params?.max_points,
        sort_by: sortBy,
        page: params?.page,
        per_page: params?.per_page ?? 10,
      },
    });

    const rawData = response.data?.data;
    const rawUsers = Array.isArray(rawData?.users) ? rawData.users : [];
    const users = rawUsers.map(mapBackendUser);

    return {
      success: Boolean(response.data?.success ?? true),
      message: String(response.data?.message ?? ""),
      data: {
        total_users: Number(rawData?.total_users ?? users.length),
        users,
        meta: rawData?.meta ?? {
          current_page: 1,
          last_page: 1,
          per_page: params?.per_page ?? 10,
          total: users.length,
        },
      },
    };
  },

  /**
   * Fetch detailed profile of a single user along with devices, products, and transactions.
   */
  async getUser(id: string | number): Promise<AdminUserDetailResponse> {
    const targetId = toBackendUserId(id);
    const [detailRes, devicesRes, productsRes, txRes] = await Promise.all([
      apiClient.get<{
        success?: boolean;
        message?: string;
        data?: Record<string, unknown>;
      }>(`/admin/users/${targetId}`),
      apiClient
        .get<{ data?: { devices?: Record<string, unknown>[] } }>(
          `/admin/users/${targetId}/devices`
        )
        .catch(() => null),
      apiClient
        .get<{ data?: { products?: Record<string, unknown>[] } }>(
          `/admin/users/${targetId}/products`
        )
        .catch(() => null),
      apiClient
        .get<{ data?: { transactions?: Record<string, unknown>[] } }>(
          `/admin/users/${targetId}/transactions`
        )
        .catch(() => null),
    ]);

    const user = mapBackendUser(detailRes.data?.data ?? { id: targetId, customer_id: id });

    const rawDevices = devicesRes?.data?.data?.devices ?? [];
    const deviceLogins: AdminUserDeviceLogin[] = rawDevices.map((d, i) => ({
      id: String(d.id ?? i + 1),
      ipAddress: String(d.ip_address ?? "-"),
      device: String(d.device ?? "-"),
      browser: String(d.browser ?? "-"),
      time: formatUserDate(
        typeof d.login_at === "string" ? d.login_at : null,
        true
      ),
    }));

    const rawProducts = productsRes?.data?.data?.products ?? [];
    const products: AdminUserProduct[] = rawProducts.map((p, i) => ({
      id: String(p.id ?? i + 1),
      name: String(p.name ?? "Game"),
      imageSrc: p.image_url ? String(p.image_url) : undefined,
      transactionId: String(p.transaction_id ?? "-"),
      transactionDate: formatUserDate(
        typeof p.transaction_date === "string" ? p.transaction_date : null,
        true
      ),
    }));

    const rawTx = txRes?.data?.data?.transactions ?? [];
    const recentTransactions: AdminUserTransaction[] = rawTx.map((t, i) => {
      const amount = Number(t.total ?? 0);
      const rawStatus = String(t.status ?? "pending").toLowerCase();
      return {
        id: String(t.transaction_id ?? i + 1),
        transactionId: String(t.transaction_id ?? "-"),
        productName: String(t.product_name ?? "-"),
        paymentMethod: formatPaymentMethodLabel(String(t.payment_method ?? "")),
        amount,
        formattedAmount: `Rp ${amount.toLocaleString("id-ID")}`,
        date: formatUserDate(typeof t.date === "string" ? t.date : null, true),
        status:
          rawStatus === "paid" || rawStatus === "completed" || rawStatus === "success"
            ? "Completed"
            : rawStatus === "failed"
            ? "Failed"
            : "Pending",
      };
    });

    return {
      success: Boolean(detailRes.data?.success ?? true),
      message: String(detailRes.data?.message ?? ""),
      data: {
        ...user,
        deviceLogins,
        products,
        recentTransactions,
      },
    };
  },

  /**
   * Update user status (Active, Suspended, Banned, Pending).
   */
  async updateStatus(
    id: string | number,
    status: UserStatus
  ): Promise<{ success: boolean; data: { id: string; status: UserStatus } }> {
    const targetId = toBackendUserId(id);
    const normalized = status.toLowerCase();
    if (normalized === "suspended") {
      const response = await apiClient.post<{
        success: boolean;
        data: { id: string; status: UserStatus };
      }>(`/admin/users/${targetId}/suspend`, {
        reason: "Suspended by admin",
      });
      return response.data;
    }

    const response = await apiClient.patch<{
      success: boolean;
      data: { id: string; status: UserStatus };
    }>(`/admin/users/${targetId}/status`, {
      status: normalized === "pending" ? "inactive" : normalized,
    });
    return response.data;
  },

  /**
   * Update user points or subscription duration adjustment.
   */
  async updateUser(
    id: string | number,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; data: unknown }> {
    const targetId = toBackendUserId(id);
    const response = await apiClient.patch<{ success: boolean; data: unknown }>(
      `/admin/users/${targetId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete user or wipe session.
   */
  async wipeSession(
    id: string | number
  ): Promise<{ success: boolean; message: string }> {
    const targetId = toBackendUserId(id);
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/admin/users/${targetId}/unsuspend`
    );
    return response.data;
  },
};
