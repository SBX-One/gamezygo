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
  data?: TransactionMetricsData;
  className?: string;
}

export function AdminTransactionMetricsSection({
  isEmpty = false,
  data,
  className,
}: AdminTransactionMetricsSectionProps) {
  const [weekTimeframe, setWeekTimeframe] = React.useState("today");

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
            : { text: metrics.todayPercentage, trend: "up" }
        }
        subtitle={
          isEmpty ? "KEUNTUNGAN IDR 0" : `KEUNTUNGAN ${metrics.todayProfit}`
        }
        className="h-full"
      />

      {/* 2. Card 2: This Week Transactions with Dropdown (Gambar 1 & Gambar 2 Center) */}
      <div className="relative z-20 h-full">
        <AdminStatCard
          title="THIS WEEK TRANSACTIONS"
          value={metrics.thisWeekTransactions}
          timeframes={ADMIN_TIMEFRAMES}
          selectedTimeframe={weekTimeframe}
          onTimeframeChange={setWeekTimeframe}
          badge={
            isEmpty
              ? undefined
              : { text: metrics.thisWeekPercentage, trend: "up" }
          }
          subtitle={
            isEmpty ? "KEUNTUNGAN IDR 0" : `KEUNTUNGAN ${metrics.thisWeekProfit}`
          }
          className="h-full"
        />
      </div>

      {/* 3. Card 3: This Month Transactions (Gambar 1 & Gambar 2 Right) */}
      <AdminStatCard
        title="THIS MONTH TRANSACTIONS"
        value={metrics.thisMonthTransactions}
        hasInfoIcon={true}
        infoTooltip="Total transaksi dan keuntungan bulan ini"
        badge={
          isEmpty
            ? undefined
            : { text: metrics.thisMonthPercentage, trend: "up" }
        }
        subtitle={
          isEmpty ? "KEUNTUNGAN IDR 0" : `KEUNTUNGAN ${metrics.thisMonthProfit}`
        }
        className="h-full"
      />
    </div>
  );
}
