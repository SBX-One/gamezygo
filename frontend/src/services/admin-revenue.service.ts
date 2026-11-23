import { apiClient } from "@/lib/api-client";
import type {
  RevenueChartPoint,
  IncomeSpreadSegment,
  RevenueProductItem,
  BundleStatisticData,
  ActiveVoucherItem,
} from "@/features/admin/types/admin-revenue.types";

export interface AdminRevenueQueryParams {
  period?: "today" | "weekly" | "monthly" | "yearly" | string;
  start_date?: string;
  end_date?: string;
}

export interface AdminRevenueApiResponse {
  success: boolean;
  message: string;
  data: {
    total_revenue: {
      total: number;
      percentage: number;
      description: string;
      period: string;
    };
    average_order_value: {
      total: number;
      percentage: number;
      description: string;
    };
    total_orders: {
      total: number;
      description: string;
      period: string;
    };
    voucher_burn: {
      total: number;
      percentage: number;
      description: string;
    };
    revenue_chart: {
      period: string;
      data: Array<{
        day: string;
        revenue: number;
      }>;
    };
    income_spread: {
      period: string;
      total: number;
      product_types: Array<{
        name: string;
        total: number;
        percentage: number;
      }>;
      products: Array<{
        name: string;
        total: number;
        percentage: number;
      }>;
    };
    products: {
      total: number;
      description: string;
      items: Array<{
        name: string;
        total_sold: number;
        total_revenue: number;
        date: string;
        status: string;
      }>;
    };
    bundle_statistics: {
      growth_percentage: number;
      description: string;
      last_month: {
        total: number;
      };
      this_month: {
        total: number;
      };
      total_active_subscribers: number;
      total_subscribers_last_month: number;
    };
    vouchers: {
      total_active: number;
      total_burn: number;
      items: Array<{
        name: string;
        total_used: number;
        minus_revenue: number;
      }>;
    };
  };
}

export interface AdminProductRevenueDetailResponse {
  success: boolean;
  message: string;
  data: {
    product: {
      id: number;
      name: string;
      thumbnail: string;
      categories: Array<{
        id: number;
        name: string;
        slug: string;
      }>;
    };
    total_sold: number;
    revenue: {
      total: number;
      percentage: number;
      description: string;
    };
    rank: {
      total: number;
      description: string;
    };
    last_sold: {
      total: number;
      percentage: number;
      description: string;
    };
  };
}

export const adminRevenueService = {
  /**
   * Fetch admin revenue statistics and breakdown
   */
  async getRevenue(params?: AdminRevenueQueryParams): Promise<AdminRevenueApiResponse["data"]> {
    const response = await apiClient.get<AdminRevenueApiResponse>("/admin/revenue", {
      params: {
        period: params?.period || "today",
        start_date: params?.start_date,
        end_date: params?.end_date,
      },
    });

    return response.data.data;
  },

  /**
   * Fetch specific product revenue details
   */
  async getProductRevenue(slug: string): Promise<AdminProductRevenueDetailResponse["data"]> {
    const response = await apiClient.get<AdminProductRevenueDetailResponse>(
      `/admin/revenue/product/${slug}`
    );

    return response.data.data;
  },
};

