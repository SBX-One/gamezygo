import * as React from "react";
import { AdminStatCard } from "@/components/admin";
import { MOCK_PRODUCT_METRICS } from "../../data/admin-product-performance-mock-data";
import type { ProductMetricsData } from "../../types/admin-product-performance.types";

export interface AdminProductMetricsSectionProps {
  data?: ProductMetricsData;
  className?: string;
}

export function AdminProductMetricsSection({
  data = MOCK_PRODUCT_METRICS,
  className,
}: AdminProductMetricsSectionProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch ${
        className || ""
      }`}
    >
      {/* 1. Card 1: REVENUE (Gambar 2 Top Left) */}
      <AdminStatCard
        title="REVENUE"
        value={data.revenue}
        badge={{ text: data.revenueChange, trend: "up" }}
        subtitle={data.revenueSubtitle}
        className="h-full"
      />

      {/* 2. Card 2: RANK IN TABLES (Gambar 2 Top Center) */}
      <AdminStatCard
        title="RANK IN TABLES"
        value={data.rankInTables}
        subtitle={data.rankSubtitle}
        className="h-full"
      />

      {/* 3. Card 3: LAST SOLD 24H (Gambar 2 Top Right) */}
      <AdminStatCard
        title="LAST SOLD 24H"
        value={data.lastSold24h}
        badge={{ text: data.lastSoldChange, trend: "up" }}
        subtitle={data.lastSoldSubtitle}
        className="h-full"
      />
    </div>
  );
}
