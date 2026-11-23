import * as React from "react";
import { AdminStatCard } from "@/components/admin";
import { ADMIN_TIMEFRAMES } from "../../data/admin-mock-data";
import {
  MOCK_TRANSACTION_METRICS,
  EMPTY_TRANSACTION_METRICS,
} from "../../data/admin-transactions-mock-data";
import type { TransactionMetricsData } from "../../types/admin-transactions.types";

export interface AdminTransactionMetricsSectionProps {
  isEmpty?: boolean;
  isLoading?: boolean;
  data?: TransactionMetricsData;
  className?: string;
}

function getTrend(percentageStr?: string): "up" | "down" {
  return String(percentageStr || "").trim().startsWith("-") ? "down" : "up";
}

export function AdminTransactionMetricsSection({
  isEmpty = false,
  isLoading = false,
  data,
  className,
}: AdminTransactionMetricsSectionProps) {
  const [weekTimeframe, setWeekTimeframe] = React.useState("today");

  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch ${
          className || ""
        }`}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={`tx-metric-skel-${idx}`}
            className="h-36 rounded-lg bg-deep-blue-900 border border-deep-blue-700 animate-pulse p-5 space-y-3"
          >
            <div className="w-36 h-3 rounded bg-white/10" />
            <div className="w-24 h-8 rounded bg-white/10" />
            <div className="w-40 h-3 rounded bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  const metrics = isEmpty
    ? EMPTY_TRANSACTION_METRICS
    : data || MOCK_TRANSACTION_METRICS;

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch ${
        className || ""
      }`}
    >
      {/* 1. Card 1: Today Transactions (Gambar 1 & Gambar 2 Left) */}
      <AdminStatCard
        title="TODAY TRANSACTIONS"
        value={metrics.todayTransactions}
        hasInfoIcon={true}
        infoTooltip="Total transaksi dan keuntungan hari ini"
        badge={
          isEmpty
            ? undefined
            : { text: metrics.todayPercentage, trend: getTrend(metrics.todayPercentage) }
        }
        subtitle={
          isEmpty ? "KEUNTUNGAN IDR 0" : `KEUNTUNGAN ${metrics.todayProfit}`
        }
        className="h-full"
      />

      {/* 2. Card 2: This Week Transactions with Dropdown */}
      <AdminStatCard
        title="THIS WEEK TRANSACTIONS"
        value={metrics.thisWeekTransactions}
        timeframes={ADMIN_TIMEFRAMES}
        selectedTimeframe={weekTimeframe}
        onTimeframeChange={setWeekTimeframe}
        badge={
          isEmpty
            ? undefined
            : { text: metrics.thisWeekPercentage, trend: getTrend(metrics.thisWeekPercentage) }
        }
        subtitle={
          isEmpty ? "KEUNTUNGAN IDR 0" : `KEUNTUNGAN ${metrics.thisWeekProfit}`
        }
        className="h-full"
      />

      {/* 3. Card 3: This Month Transactions (Gambar 1 & Gambar 2 Right) */}
      <AdminStatCard
        title="THIS MONTH TRANSACTIONS"
        value={metrics.thisMonthTransactions}
        hasInfoIcon={true}
        infoTooltip="Total transaksi dan keuntungan bulan ini"
        badge={
          isEmpty
            ? undefined
            : { text: metrics.thisMonthPercentage, trend: getTrend(metrics.thisMonthPercentage) }
        }
        subtitle={
          isEmpty ? "KEUNTUNGAN IDR 0" : `KEUNTUNGAN ${metrics.thisMonthProfit}`
        }
        className="h-full"
      />
    </div>
  );
}
