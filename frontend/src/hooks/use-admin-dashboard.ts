import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminDashboardData,
  fetchAdminRecentTransactions,
  type AdminDashboardData,
  type AdminRecentTransactionsData,
} from "@/services/admin-dashboard.service";
import type {
  AdminMetricData,
  AdminProductPerformance,
  AdminTransaction,
  AdminGameRequest,
} from "@/features/admin/types/admin.types";
import type {
  TransactionItem,
  TransactionMetricsData,
} from "@/features/admin/types/admin-transactions.types";
import { formatRupiah } from "@/utils/formatters";

export const ADMIN_DASHBOARD_KEYS = {
  all: ["admin-dashboard"] as const,
  detail: (period: string) => [...ADMIN_DASHBOARD_KEYS.all, period] as const,
};

export function useAdminDashboard(period: string = "today") {
  const query = useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.detail(period),
    queryFn: () => fetchAdminDashboardData(period),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const rawData: AdminDashboardData | undefined = query.data?.data;

  // 1. Mapped Hero Revenue Stat Card
  const heroStat: AdminMetricData | undefined = React.useMemo(() => {
    if (!rawData?.income) return undefined;
    const inc = rawData.income;
    return {
      id: "hero-revenue",
      title: "TOTAL REVENUE",
      value: formatRupiah(inc.total || 0),
      subtitle: inc.description || undefined,
      badge: inc.percentage !== undefined
        ? {
            text: `${inc.percentage}% ${inc.percentage >= 0 ? "Naik" : "Turun"}`,
            trend: inc.percentage >= 0 ? "up" : "down",
          }
        : undefined,
    };
  }, [rawData?.income]);

  // 2. Mapped 3 Sub Metric Stat Cards
  const statCards: AdminMetricData[] | undefined = React.useMemo(() => {
    if (!rawData) return undefined;
    return [
      {
        id: "stat-orders",
        title: "TOTAL ORDERS",
        value: String(rawData.orders?.total ?? 0),
        subtitle: rawData.orders?.description || "Total pesanan berhasil",
      },
      {
        id: "stat-users",
        title: "TOTAL USER AKTIF",
        value: String(rawData.user_active?.total ?? 0),
        subtitle: rawData.user_active?.description || "Pengguna terdaftar aktif",
      },
      {
        id: "stat-subs",
        title: "TOTAL SUBSCRIPTION",
        value: String(rawData.active_subs?.total ?? 0),
        subtitle: rawData.active_subs?.description || "Paket langganan aktif",
      },
    ];
  }, [rawData]);

  // 3. Mapped Product Performance Chart
  const productPerformance: AdminProductPerformance[] | undefined = React.useMemo(() => {
    if (!rawData?.product_performance || !Array.isArray(rawData.product_performance)) {
      return undefined;
    }
    return rawData.product_performance.map((item, idx) => ({
      id: `perf-${idx + 1}`,
      name: item.name.length > 20 ? `${item.name.slice(0, 18)}...` : item.name,
      fullName: item.name,
      revenue: Number(item.total || 0),
    }));
  }, [rawData]);

  // 4. Mapped Recent Transactions Table
  const recentTransactions: AdminTransaction[] | undefined = React.useMemo(() => {
    if (!rawData?.recent_transactions || !Array.isArray(rawData.recent_transactions)) {
      return undefined;
    }
    return rawData.recent_transactions.map((tx, idx) => {
      const lower = String(tx.status || "").toLowerCase();
      let normalizedStatus: AdminTransaction["status"] = "pending";
      if (lower === "paid" || lower === "completed" || lower === "success") {
        normalizedStatus = "completed";
      } else if (lower === "failed" || lower === "cancelled") {
        normalizedStatus = "failed";
      } else if (lower === "refunded") {
        normalizedStatus = "refunded";
      }

      return {
        id: `tx-${idx + 1}`,
        customerEmail: tx.customer_email || "-",
        productName: tx.product_name || "-",
        totalRevenue: typeof tx.revenue === "number" ? formatRupiah(tx.revenue) : String(tx.revenue || "Rp 0"),
        date: tx.date || "-",
        status: normalizedStatus,
      };
    });
  }, [rawData]);

  // 5. Mapped Game Requests List
  const gameRequests: AdminGameRequest[] | undefined = React.useMemo(() => {
    if (!rawData?.game_requests || !Array.isArray(rawData.game_requests)) {
      return undefined;
    }
    return rawData.game_requests.map((gr, idx) => ({
      id: `gr-${idx + 1}`,
      title: gr.product_name || "Untitled Game",
      requesterCount: Number(gr.total_request || 0),
      imageSrc: gr.product_image_url || "/assets/images/placeholder.png",
      steamUrl: gr.steam_url,
    }));
  }, [rawData]);

  return {
    ...query,
    heroStat,
    statCards,
    productPerformance,
    recentTransactions,
    gameRequests,
    hasLiveData: Boolean(rawData),
  };
}

function stripKeuntunganPrefix(description?: string, fallbackTotal?: number): string {
  if (!description) {
    return `IDR ${Number(fallbackTotal || 0).toLocaleString("en-US")}`;
  }
  return description.replace(/^KEUNTUNGAN\s+/i, "").trim();
}

export function useAdminRecentTransactions(limit: number = 50) {
  const query = useQuery({
    queryKey: [...ADMIN_DASHBOARD_KEYS.all, "recent-transactions", limit] as const,
    queryFn: () => fetchAdminRecentTransactions(limit),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const rawData: AdminRecentTransactionsData | undefined = query.data?.data;

  const metricsData: TransactionMetricsData | undefined = React.useMemo(() => {
    if (!rawData) return undefined;

    return {
      todayTransactions: Number(rawData.today_transactions?.total ?? 0),
      todayProfit: stripKeuntunganPrefix(rawData.today_transactions?.description),
      todayPercentage: `${rawData.today_transactions?.percentage ?? 0}%`,
      thisWeekTransactions: Number(rawData.week_transactions?.total ?? 0),
      thisWeekProfit: stripKeuntunganPrefix(rawData.week_transactions?.description),
      thisWeekPercentage: `${rawData.week_transactions?.percentage ?? 0}%`,
      thisMonthTransactions: Number(rawData.month_transactions?.total ?? 0),
      thisMonthProfit: stripKeuntunganPrefix(rawData.month_transactions?.description),
      thisMonthPercentage: `${rawData.month_transactions?.percentage ?? 0}%`,
    };
  }, [rawData]);

  const transactions: TransactionItem[] | undefined = React.useMemo(() => {
    const rawList = rawData?.transactins ?? rawData?.transactions;
    if (!rawList || !Array.isArray(rawList)) return undefined;

    return rawList.map((tx) => {
      const lower = String(tx.status || "").toLowerCase();
      let status: TransactionItem["status"] = "pending";
      if (lower === "paid" || lower === "completed" || lower === "success") {
        status = "completed";
      } else if (
        lower === "failed" ||
        lower === "cancelled" ||
        lower === "refunded"
      ) {
        status = "failed";
      }

      return {
        id: tx.id,
        customerEmail: tx.customer_email || "-",
        productId: String(tx.product_id ?? "-"),
        productName: tx.product_name || "-",
        amount: formatRupiah(Number(tx.total || 0)),
        date: tx.date || "-",
        status,
      };
    });
  }, [rawData]);

  return {
    ...query,
    metricsData,
    transactions,
  };
}

