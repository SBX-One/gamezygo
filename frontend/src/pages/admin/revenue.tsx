import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminRevenueMetricsSection,
  AdminRevenueChartCard,
  AdminIncomeSpreadCard,
  AdminRevenueProductTableSection,
  AdminBundleStatisticSection,
  AdminActiveVouchersSection,
} from "@/features/admin";

const emptySubscribe = () => () => {};

export default function AdminRevenuePage() {
  const router = useRouter();
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Default to empty state (sesuai permintaan gambar 1-5).
  // Jika ?filled=true atau ?empty=false diakses, akan transisi dengan aman setelah mount tanpa hydration mismatch.
  const isEmptyState = isMounted
    ? router.query.empty !== "false" && router.query.filled !== "true"
    : true;

  return (
    <>
      <Head>
        <title>Pendapatan | Gamezygo Admin</title>
        <meta
          name="description"
          content="Financial reporting, revenue charts, and transaction distribution dashboard for Gamezygo administration"
        />
      </Head>

      <AdminLayout title="Pendapatan" activeNavId="pendapatan">
        <div className="space-y-8 pb-10">
          {/* 1. Top Revenue Metrics Section (Gambar 1) - z-30 so dropdown floats over charts below */}
          <div className="relative z-30">
            <AdminRevenueMetricsSection isEmpty={isEmptyState} />
          </div>

          {/* 2. Charts Section: Revenue Area Chart (Left) + Income Spread Donut Chart (Right) (Gambar 2) */}
          <div className="relative z-20 grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            <AdminRevenueChartCard isEmpty={isEmptyState} />
            <AdminIncomeSpreadCard isEmpty={isEmptyState} />
          </div>

          {/* 3. Products Listed Table (Gambar 3) */}
          <div className="relative z-10">
            <AdminRevenueProductTableSection isEmpty={isEmptyState} />
          </div>

          {/* 4. Bundle Statistic Widget (Gambar 4) */}
          <div className="relative z-0">
            <AdminBundleStatisticSection isEmpty={isEmptyState} />
          </div>

          {/* 5. Active Vouchers Table (Gambar 5) */}
          <div className="relative z-0">
            <AdminActiveVouchersSection isEmpty={isEmptyState} />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
