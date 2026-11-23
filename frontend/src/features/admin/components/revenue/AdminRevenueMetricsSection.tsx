import * as React from "react";
import { AdminHeroStatCard, AdminStatCard } from "@/components/admin";
import { ADMIN_TIMEFRAMES } from "../../data/admin-mock-data";

export interface AdminRevenueMetricsData {
  totalRevenue?: {
    value: string;
    subtitle?: string;
    badge?: { text: string; trend: "up" | "down" };
  };
  averageOrderValue?: {
    value: string;
    subtitle?: string;
    badge?: { text: string; trend: "up" | "down" };
  };
  totalOrders?: {
    value: string;
    subtitle?: string;
  };
  voucherBurn?: {
    value: string;
    subtitle?: string;
    badge?: { text: string; trend: "up" | "down" };
  };
}

export interface AdminRevenueMetricsSectionProps {
  isEmpty?: boolean;
  metrics?: AdminRevenueMetricsData;
  heroTimeframe?: string;
  onHeroTimeframeChange?: (val: string) => void;
  orderTimeframe?: string;
  onOrderTimeframeChange?: (val: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function AdminRevenueMetricsSection({
  isEmpty = false,
  metrics,
  heroTimeframe: externalHeroTimeframe,
  onHeroTimeframeChange,
  orderTimeframe: externalOrderTimeframe,
  onOrderTimeframeChange,
  className,
  isLoading = false,
}: AdminRevenueMetricsSectionProps) {
  const [internalHeroTimeframe, setInternalHeroTimeframe] = React.useState("today");
  const [internalOrderTimeframe, setInternalOrderTimeframe] = React.useState("today");

  const heroTimeframe = externalHeroTimeframe ?? internalHeroTimeframe;
  const handleHeroTimeframeChange = onHeroTimeframeChange ?? setInternalHeroTimeframe;

  const orderTimeframe = externalOrderTimeframe ?? internalOrderTimeframe;
  const handleOrderTimeframeChange = onOrderTimeframeChange ?? setInternalOrderTimeframe;

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        {/* Hero Card Skeleton */}
        <div className="rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-6 flex flex-col justify-between gap-6 shadow-lg select-none">
          <div className="flex items-center justify-between">
            <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
            <div className="w-24 h-8 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="w-64 h-9 rounded bg-white/10 animate-pulse" />
            <div className="w-48 h-4 rounded bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* 3 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`rev-stat-skel-${idx}`}
              className="rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-5 flex flex-col justify-between h-[120px] shadow-lg"
            >
              <div className="w-28 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-36 h-7 rounded bg-white/10 animate-pulse" />
              <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const heroValue = isEmpty
    ? "IDR 0"
    : metrics?.totalRevenue?.value ?? "IDR 350,000";

  const heroSubtitle = isEmpty
    ? "PENDAPATAN DARI 0 TRANSAKSI"
    : metrics?.totalRevenue?.subtitle ?? "PENDAPATAN DARI 56 TRANSAKSI";

  const heroBadge = isEmpty
    ? undefined
    : metrics?.totalRevenue?.badge ?? { text: "50%", trend: "up" as const };

  const aovValue = isEmpty
    ? "IDR 0"
    : metrics?.averageOrderValue?.value ?? "IDR 55,000";

  const aovSubtitle = isEmpty
    ? "FROM TODAY"
    : metrics?.averageOrderValue?.subtitle ?? "FROM 8 DAYS AGO";

  const aovBadge = isEmpty
    ? undefined
    : metrics?.averageOrderValue?.badge ?? { text: "50%", trend: "up" as const };

  const totalOrdersValue = isEmpty
    ? "0 Order"
    : metrics?.totalOrders?.value ?? "80 Order";

  const voucherBurnValue = isEmpty
    ? "IDR 0"
    : metrics?.voucherBurn?.value ?? "IDR 350,000";

  const voucherBurnSubtitle = isEmpty
    ? undefined
    : metrics?.voucherBurn?.subtitle ?? "FROM 8 DAYS AGO";

  const voucherBurnBadge = isEmpty
    ? undefined
    : metrics?.voucherBurn?.badge ?? { text: "50%", trend: "up" as const };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* 1. Hero Revenue Card (Gambar 2 Top & Gambar 1 Empty State) */}
      <div className="relative z-20 has-[[aria-expanded='true']]:z-40">
        <AdminHeroStatCard
          title="TOTAL PENDAPATAN"
          value={heroValue}
          subtitle={heroSubtitle}
          badge={heroBadge}
          timeframes={ADMIN_TIMEFRAMES}
          selectedTimeframe={heroTimeframe}
          onTimeframeChange={handleHeroTimeframeChange}
        />
      </div>

      {/* 2. Three Metric Stat Cards Grid (Gambar 2 Bottom & Gambar 1 Empty State) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch">
        {/* Card 1: Average Order Value with Info Icon */}
        <AdminStatCard
          title="AVERAGE ORDER VALUE"
          value={aovValue}
          hasInfoIcon={true}
          infoTooltip="Rata-rata nilai transaksi pelanggan"
          badge={aovBadge}
          subtitle={aovSubtitle}
          className="h-full"
        />

        {/* Card 2: Total Order with Dropdown (elevates to z-50 when open) */}
        <AdminStatCard
          title="TOTAL ORDER"
          value={totalOrdersValue}
          timeframes={ADMIN_TIMEFRAMES}
          selectedTimeframe={orderTimeframe}
          onTimeframeChange={handleOrderTimeframeChange}
          className="h-full"
        />

        {/* Card 3: Voucher Burn with Info Icon */}
        <AdminStatCard
          title="VOUCHER BURN"
          value={voucherBurnValue}
          hasInfoIcon={true}
          infoTooltip="Total potongan dari voucher yang digunakan"
          badge={voucherBurnBadge}
          subtitle={voucherBurnSubtitle}
          className="h-full"
        />
      </div>
    </div>
  );
}
