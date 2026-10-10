import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminMetricsSection,
  AdminPerformanceChartSection,
  AdminRecentTransactionsSection,
  AdminGameRequestsSection,
} from "@/features/admin";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isEmptyManual, setIsEmptyManual] = React.useState<boolean | null>(null);
  const isEmptyState =
    isEmptyManual !== null ? isEmptyManual : router.query.empty === "true";

  return (
    <>
      <Head>
        <title>Main Dashboard | Gamezygo Admin</title>
        <meta
          name="description"
          content="Main financial and performance dashboard for Gamezygo administration"
        />
      </Head>

      <AdminLayout title="Main Dashboard" activeNavId="dashboard">
        <div className="space-y-8">
          {/* Quick Preview Toggle: Data Penuh vs Empty State */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-deep-blue-900/50 border border-deep-blue-700/60 text-xs">
            <span className="text-gray-400">
              Tampilan Dashboard:{" "}
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

          {/* 1. Hero Revenue + Stat Cards (Image 1) */}
          <AdminMetricsSection isEmpty={isEmptyState} />

          {/* 2. Best Performance Product Bar Chart (Image 2) */}
          <AdminPerformanceChartSection isEmpty={isEmptyState} />

          {/* 3. Recent Transactions Table (Image 3) */}
          <AdminRecentTransactionsSection isEmpty={isEmptyState} />

          {/* 4. Game Requests Widget */}
          <AdminGameRequestsSection isEmpty={isEmptyState} />
        </div>
      </AdminLayout>
    </>
  );
}

