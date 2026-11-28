import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  adminRevenueService,
  type AdminRevenueQueryParams,
  type AdminRevenueApiResponse,
} from "@/services/admin-revenue.service";
import type {
  RevenueChartPoint,
  IncomeSpreadSegment,
  RevenueProductItem,
  BundleStatisticData,
  ActiveVoucherItem,
} from "@/features/admin/types/admin-revenue.types";
import { formatRupiah } from "@/utils/formatters";

export const ADMIN_REVENUE_KEYS = {
  all: ["admin-revenue"] as const,
  metrics: (period: string) => [...ADMIN_REVENUE_KEYS.all, "metrics", period] as const,
  chart: (params: { period?: string; start_date?: string; end_date?: string }) =>
    [
      ...ADMIN_REVENUE_KEYS.all,
      "chart",
      params.period || "weekly",
      params.start_date || "",
      params.end_date || "",
    ] as const,
  spread: (period: string) => [...ADMIN_REVENUE_KEYS.all, "spread", period] as const,
  tables: () => [...ADMIN_REVENUE_KEYS.all, "tables"] as const,
  detail: (params: AdminRevenueQueryParams) =>
    [
      ...ADMIN_REVENUE_KEYS.all,
      params.period || "today",
      params.start_date || "",
      params.end_date || "",
    ] as const,
  product: (slug: string) => [...ADMIN_REVENUE_KEYS.all, "product", slug] as const,
};

const SPREAD_PALETTE = ["#FF5364", "#9E3D48", "#7B2E37", "#5A232B", "#3D171D"];

// --- Pure Transformer Helpers ---

function transformMetrics(rawData?: AdminRevenueApiResponse["data"]) {
  if (!rawData) return undefined;

  const rev = rawData.total_revenue;
  const aov = rawData.average_order_value;
  const ord = rawData.total_orders;
  const vch = rawData.voucher_burn;

  return {
    totalRevenue: {
      value: formatRupiah(rev.total || 0),
      subtitle: rev.description || `PENDAPATAN DARI ${rev.total > 0 ? "1" : "0"} TRANSAKSI`,
      badge: {
        text: `${Math.abs(rev.percentage)}%`,
        trend: rev.percentage >= 0 ? ("up" as const) : ("down" as const),
      },
    },
    averageOrderValue: {
      value: formatRupiah(aov.total || 0),
      subtitle: aov.description || "FROM TODAY",
      badge: {
        text: `${Math.abs(aov.percentage)}%`,
        trend: aov.percentage >= 0 ? ("up" as const) : ("down" as const),
      },
    },
    totalOrders: {
      value: `${ord.total || 0} Order`,
      subtitle: ord.description || "TOTAL ORDER",
    },
    voucherBurn: {
      value: formatRupiah(vch.total || 0),
      subtitle: vch.description || "FROM TODAY",
      badge: {
        text: `${Math.abs(vch.percentage)}%`,
        trend: vch.percentage >= 0 ? ("up" as const) : ("down" as const),
      },
    },
  };
}

function transformChartData(rawData?: AdminRevenueApiResponse["data"]): RevenueChartPoint[] {
  if (!rawData?.revenue_chart?.data) return [];
  return rawData.revenue_chart.data.map((item) => ({
    day: item.day,
    revenue: item.revenue,
  }));
}

function transformIncomeSpread(rawData?: AdminRevenueApiResponse["data"]) {
  const productTypes: IncomeSpreadSegment[] = rawData?.income_spread?.product_types
    ? rawData.income_spread.product_types.map((item, idx) => ({
        id: `type-${idx}`,
        label: item.name,
        percentage: item.percentage,
        color: SPREAD_PALETTE[idx % SPREAD_PALETTE.length],
      }))
    : [];

  const products: IncomeSpreadSegment[] = rawData?.income_spread?.products
    ? rawData.income_spread.products.map((item, idx) => ({
        id: `prod-${idx}`,
        label: item.name,
        percentage: item.percentage,
        color: SPREAD_PALETTE[idx % SPREAD_PALETTE.length],
      }))
    : [];

  return { productTypes, products };
}

function transformTables(rawData?: AdminRevenueApiResponse["data"]) {
  const products: RevenueProductItem[] = rawData?.products?.items
    ? rawData.products.items.map((prod, idx) => {
        let formattedDate = prod.date;
        try {
          const d = new Date(prod.date);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
          }
        } catch {
          // keep fallback
        }

        const prodWithId = prod as { id?: number | string };
        return {
          id:
            prodWithId.id !== undefined && prodWithId.id !== null
              ? String(prodWithId.id)
              : `prod-item-${idx}`,
          name: prod.name,
          totalSell: prod.total_sold.toLocaleString("id-ID"),
          totalRevenue: formatRupiah(prod.total_revenue),
          date: formattedDate,
          status: (prod.status === "pending" ? "pending" : "completed") as "pending" | "completed",
        };
      })
    : [];

  const totalGamesCount = rawData?.products?.total ?? 0;

  let bundleStatistics: BundleStatisticData = {
    percentageIncrease: 0,
    amountIncreaseText: "NAIK IDR 0 DARI BULAN LALU",
    lastMonthAmount: "IDR 0",
    thisMonthAmount: "IDR 0",
    totalActiveSubs: "0 Users",
    totalSubsLastMonth: "0 Users",
  };

  if (rawData?.bundle_statistics) {
    const b = rawData.bundle_statistics;
    bundleStatistics = {
      percentageIncrease: b.growth_percentage,
      amountIncreaseText: b.description,
      lastMonthAmount: formatRupiah(b.last_month?.total || 0),
      thisMonthAmount: formatRupiah(b.this_month?.total || 0),
      totalActiveSubs: `${b.total_active_subscribers} Users`,
      totalSubsLastMonth: `${b.total_subscribers_last_month} Users`,
    };
  }

  const vouchers: ActiveVoucherItem[] = rawData?.vouchers?.items
    ? rawData.vouchers.items.map((v, idx) => ({
        id: `voucher-${idx}`,
        code: v.name,
        totalUse: v.total_used,
        minusRevenue: formatRupiah(v.minus_revenue),
      }))
    : [];

  const totalVouchersCount = rawData?.vouchers?.total_active ?? 0;
  const voucherBurnAllTime = rawData?.vouchers?.total_burn
    ? formatRupiah(rawData.vouchers.total_burn)
    : undefined;

  return {
    products,
    totalGamesCount,
    bundleStatistics,
    vouchers,
    totalVouchersCount,
    voucherBurnAllTime,
  };
}

// --- Granular Hooks for Card-Specific Filters & Skeletons ---

export function useAdminRevenueMetrics(period: string = "today") {
  const query = useQuery({
    queryKey: ADMIN_REVENUE_KEYS.metrics(period),
    queryFn: () => adminRevenueService.getRevenue({ period }),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const metrics = React.useMemo(() => transformMetrics(query.data), [query.data]);

  return {
    ...query,
    metrics,
  };
}

export function useAdminRevenueChart(params: {
  period?: string;
  start_date?: string;
  end_date?: string;
} = {}) {
  const query = useQuery({
    queryKey: ADMIN_REVENUE_KEYS.chart(params),
    queryFn: () => adminRevenueService.getRevenue(params),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const chartData = React.useMemo(() => transformChartData(query.data), [query.data]);

  return {
    ...query,
    chartData,
  };
}

export function useAdminIncomeSpread(period: string = "today") {
  const query = useQuery({
    queryKey: ADMIN_REVENUE_KEYS.spread(period),
    queryFn: () => adminRevenueService.getRevenue({ period }),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const { productTypes, products } = React.useMemo(
    () => transformIncomeSpread(query.data),
    [query.data]
  );

  return {
    ...query,
    incomeSpreadProductTypes: productTypes,
    incomeSpreadProducts: products,
  };
}

export function useAdminRevenueTables() {
  const query = useQuery({
    queryKey: ADMIN_REVENUE_KEYS.tables(),
    queryFn: () => adminRevenueService.getRevenue({ period: "today" }),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const tablesData = React.useMemo(() => transformTables(query.data), [query.data]);

  return {
    ...query,
    ...tablesData,
  };
}

// --- Full Dashboard Aggregate Hook (Backward Compatible) ---

export function useAdminRevenue(params: AdminRevenueQueryParams = { period: "today" }) {
  const query = useQuery({
    queryKey: ADMIN_REVENUE_KEYS.detail(params),
    queryFn: () => adminRevenueService.getRevenue(params),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const rawData: AdminRevenueApiResponse["data"] | undefined = query.data;

  const metrics = React.useMemo(() => transformMetrics(rawData), [rawData]);
  const chartData = React.useMemo(() => transformChartData(rawData), [rawData]);
  const { productTypes, products: spreadProducts } = React.useMemo(
    () => transformIncomeSpread(rawData),
    [rawData]
  );
  const tablesData = React.useMemo(() => transformTables(rawData), [rawData]);

  return {
    ...query,
    metrics,
    chartData,
    incomeSpreadProductTypes: productTypes,
    incomeSpreadProducts: spreadProducts,
    ...tablesData,
  };
}

export function useAdminProductRevenue(slug: string) {
  return useQuery({
    queryKey: ADMIN_REVENUE_KEYS.product(slug),
    queryFn: () => adminRevenueService.getProductRevenue(slug),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });
}
