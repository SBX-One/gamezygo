import { apiGet } from "@/lib/api-client";
import type { ApiResponse } from "@/types";

export interface AdminDashboardIncome {
  total: number;
  percentage?: number;
  description?: string;
}

export interface AdminDashboardMetricCount {
  total: number;
  description?: string;
}

export interface AdminProductPerformanceRaw {
  name: string;
  total: number;
}

export interface AdminRecentTransactionRaw {
  customer_email: string;
  product_name: string;
  revenue: string;
  date: string;
  status: string;
}

export interface AdminGameRequestRaw {
  product_image_url: string;
  product_name: string;
  total_request: number;
  steam_url?: string;
}

export interface AdminDashboardData {
  income: AdminDashboardIncome;
  orders: AdminDashboardMetricCount;
  user_active: AdminDashboardMetricCount;
  active_subs: AdminDashboardMetricCount;
  product_performance: AdminProductPerformanceRaw[];
  recent_transactions: AdminRecentTransactionRaw[];
  game_requests: AdminGameRequestRaw[];
}

/**
 * Fetch Admin Main Dashboard Data
 * Contract: v1.postman_collection.json -> admin -> dashboard -> index
 * GET /api/v1/admin/dashboard?period=today
 */
export async function fetchAdminDashboardData(
  period: string = "today"
): Promise<ApiResponse<AdminDashboardData>> {
  return apiGet<ApiResponse<AdminDashboardData>>(
    `/admin/dashboard?period=${encodeURIComponent(period)}`
  );
}

