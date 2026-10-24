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
} from "@/features/admin/components";

const emptySubscribe = () => () => {};

export default function AdminRevenuePage() {
  const router = useRouter();
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isEmptyManual, setIsEmptyManual] = React.useState<boolean | null>(null);

  const isEmptyState =
    isEmptyManual !== null
      ? isEmptyManual
      : isMounted && router.isReady
      ? router.query.empty === "true"
      : false;

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
          {/* Quick Preview Toggle: Data Penuh vs Empty State */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-deep-blue-900/50 border border-deep-blue-700/60 text-label-xs">
            <span className="text-gray-400">
              Tampilan Halaman Pendapatan:{" "}
              <span className="text-gray-100 font-semibold">
                {isEmptyState ? "Empty State (Sesuai Desain)" : "Data Terisi"}
              </span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsEmptyManual(false)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  !isEmptyState
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-[#1E202B] text-gray-400 hover:text-white"
                }`}
              >
                Data Terisi
              </button>
              <button
                type="button"
                onClick={() => setIsEmptyManual(true)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  isEmptyState
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-[#1E202B] text-gray-400 hover:text-white"
                }`}
              >
                Empty State
              </button>
            </div>
          </div>

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
