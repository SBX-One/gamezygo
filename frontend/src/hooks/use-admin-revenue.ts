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

export function useAdminRevenue(params: AdminRevenueQueryParams = { period: "today" }) {
  const query = useQuery({
    queryKey: ADMIN_REVENUE_KEYS.detail(params),
    queryFn: () => adminRevenueService.getRevenue(params),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const rawData: AdminRevenueApiResponse["data"] | undefined = query.data;

  // 1. Metrics Formatting
  const metrics = React.useMemo(() => {
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
  }, [rawData]);

  // 2. Revenue Chart Data
  const chartData: RevenueChartPoint[] = React.useMemo(() => {
    if (!rawData?.revenue_chart?.data) return [];
    return rawData.revenue_chart.data.map((item) => ({
      day: item.day,
      revenue: item.revenue,
    }));
  }, [rawData?.revenue_chart]);

  // 3. Income Spread Segments
  const incomeSpreadProductTypes: IncomeSpreadSegment[] = React.useMemo(() => {
    if (!rawData?.income_spread?.product_types) return [];
    return rawData.income_spread.product_types.map((item, idx) => ({
      id: `type-${idx}`,
      label: item.name,
      percentage: item.percentage,
      color: SPREAD_PALETTE[idx % SPREAD_PALETTE.length],
    }));
  }, [rawData?.income_spread?.product_types]);

  const incomeSpreadProducts: IncomeSpreadSegment[] = React.useMemo(() => {
    if (!rawData?.income_spread?.products) return [];
    return rawData.income_spread.products.map((item, idx) => ({
      id: `prod-${idx}`,
      label: item.name,
      percentage: item.percentage,
      color: SPREAD_PALETTE[idx % SPREAD_PALETTE.length],
    }));
  }, [rawData?.income_spread?.products]);

  // 4. Products Table Items
  const products: RevenueProductItem[] = React.useMemo(() => {
    if (!rawData?.products?.items) return [];
    return rawData.products.items.map((prod, idx) => {
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

      return {
        id: `prod-item-${idx}`,
        name: prod.name,
        totalSell: prod.total_sold.toLocaleString("id-ID"),
        totalRevenue: formatRupiah(prod.total_revenue),
        date: formattedDate,
        status: (prod.status === "pending" ? "pending" : "completed") as "pending" | "completed",
      };
    });
  }, [rawData?.products?.items]);

  const totalGamesCount = rawData?.products?.total ?? 0;

  // 5. Bundle Statistics Data
  const bundleStatistics: BundleStatisticData = React.useMemo(() => {
    if (!rawData?.bundle_statistics) {
      return {
        percentageIncrease: 0,
        amountIncreaseText: "NAIK IDR 0 DARI BULAN LALU",
        lastMonthAmount: "IDR 0",
        thisMonthAmount: "IDR 0",
        totalActiveSubs: "0 Users",
        totalSubsLastMonth: "0 Users",
      };
    }

    const b = rawData.bundle_statistics;
    return {
      percentageIncrease: b.growth_percentage,
      amountIncreaseText: b.description,
      lastMonthAmount: formatRupiah(b.last_month?.total || 0),
      thisMonthAmount: formatRupiah(b.this_month?.total || 0),
      totalActiveSubs: `${b.total_active_subscribers} Users`,
      totalSubsLastMonth: `${b.total_subscribers_last_month} Users`,
    };
  }, [rawData?.bundle_statistics]);

  // 6. Active Vouchers Table
  const vouchers: ActiveVoucherItem[] = React.useMemo(() => {
    if (!rawData?.vouchers?.items) return [];
    return rawData.vouchers.items.map((v, idx) => ({
      id: `voucher-${idx}`,
      code: v.name,
      totalUse: v.total_used,
      minusRevenue: formatRupiah(v.minus_revenue),
    }));
  }, [rawData?.vouchers?.items]);

  const totalVouchersCount = rawData?.vouchers?.total_active ?? 0;
  const voucherBurnAllTime = rawData?.vouchers?.total_burn ? formatRupiah(rawData.vouchers.total_burn) : undefined;

  return {
    ...query,
    metrics,
    chartData,
    incomeSpreadProductTypes,
    incomeSpreadProducts,
    products,
    totalGamesCount,
    bundleStatistics,
    vouchers,
    totalVouchersCount,
    voucherBurnAllTime,
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

