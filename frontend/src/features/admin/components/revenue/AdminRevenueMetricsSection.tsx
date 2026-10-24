import * as React from "react";
import { AdminHeroStatCard, AdminStatCard } from "@/components/admin";
import { ADMIN_TIMEFRAMES } from "../../data/admin-mock-data";

export interface AdminRevenueMetricsSectionProps {
  isEmpty?: boolean;
  className?: string;
}

export function AdminRevenueMetricsSection({
  isEmpty = false,
  className,
}: AdminRevenueMetricsSectionProps) {
  const [heroTimeframe, setHeroTimeframe] = React.useState("today");
  const [orderTimeframe, setOrderTimeframe] = React.useState("today");

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* 1. Hero Revenue Card (Gambar 2 Top & Gambar 1 Empty State) */}
      <div className="relative z-20 has-[[aria-expanded='true']]:z-40">
        <AdminHeroStatCard
          title="TOTAL PENDAPATAN"
          value={isEmpty ? "IDR 0" : "IDR 350,000"}
          subtitle={isEmpty ? "PENDAPATAN DARI 0 TRANSAKSI" : "PENDAPATAN DARI 56 TRANSAKSI"}
          badge={isEmpty ? undefined : { text: "50%", trend: "up" }}
          timeframes={ADMIN_TIMEFRAMES}
          selectedTimeframe={heroTimeframe}
          onTimeframeChange={setHeroTimeframe}
        />
      </div>

      {/* 2. Three Metric Stat Cards Grid (Gambar 2 Bottom & Gambar 1 Empty State) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch">
        {/* Card 1: Average Order Value with Info Icon */}
        <AdminStatCard
          title="AVERAGE ORDER VALUE"
          value={isEmpty ? "IDR 0" : "IDR 55,000"}
          hasInfoIcon={true}
          infoTooltip="Rata-rata nilai transaksi pelanggan"
          badge={isEmpty ? undefined : { text: "50%", trend: "up" }}
          subtitle={isEmpty ? "FROM TODAY" : "FROM 8 DAYS AGO"}
          className="h-full"
        />

        {/* Card 2: Total Order with Dropdown (elevates to z-50 when open) */}
        <AdminStatCard
          title="TOTAL ORDER"
          value={isEmpty ? "0 Order" : "80 Order"}
          timeframes={ADMIN_TIMEFRAMES}
          selectedTimeframe={orderTimeframe}
          onTimeframeChange={setOrderTimeframe}
          className="h-full"
        />

        {/* Card 3: Voucher Burn with Info Icon */}
        <AdminStatCard
          title="VOUCHER BURN"
          value={isEmpty ? "IDR 0" : "IDR 350,000"}
          hasInfoIcon={true}
          infoTooltip="Total potongan dari voucher yang digunakan"
          badge={isEmpty ? undefined : { text: "50%", trend: "up" }}
          subtitle={isEmpty ? undefined : "FROM 8 DAYS AGO"}
          className="h-full"
        />
      </div>
    </div>
  );
}
