import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminMetricsSection,
  AdminPerformanceChartSection,
  AdminRecentTransactionsSection,
  AdminGameRequestsSection,
} from "@/features/admin/components";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

const emptySubscribe = () => () => {};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("today");
  const {
    heroStat,
    statCards,
    productPerformance,
    recentTransactions,
    gameRequests,
    isLoading,
  } = useAdminDashboard(selectedTimeframe);

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
        <title>Main Dashboard | Gamezygo Admin</title>
        <meta
          name="description"
          content="Main financial and performance dashboard for Gamezygo administration"
        />
      </Head>

      <AdminLayout title="Main Dashboard" activeNavId="dashboard">
        <div className="space-y-8">
          {/* Quick Preview Toggle: Data Penuh vs Empty State */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-deep-blue-900/50 border border-deep-blue-700/60 text-label-xs">
            <span className="text-gray-400">
              Tampilan Dashboard:{" "}
              <span className="text-gray-100 font-semibold">
                {isEmptyState ? "Empty State (Sesuai Desain)" : "Data Terisi"}
              </span>
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant={!isEmptyState ? "active" : "inactive"}
                size="xs"
                onClick={() => setIsEmptyManual(false)}
                className="px-3 py-2"
              >
                Data Terisi
              </Button>
              <Button
                variant={isEmptyState ? "active" : "inactive"}
                size="xs"
                onClick={() => setIsEmptyManual(true)}
                className="px-3 py-2"
              >
                Empty State
              </Button>
            </div>
          </div>

          {/* 1. Hero Revenue + Stat Cards (Image 1) - z-20 so dropdown floats over charts below */}
          <div className="relative z-20 has-[[aria-expanded='true']]:z-30">
            <AdminMetricsSection
              isEmpty={isEmptyState}
              heroStat={heroStat}
              statCards={statCards}
              onTimeframeChange={setSelectedTimeframe}
            />
          </div>

          {/* 2. Best Performance Product Bar Chart (Image 2) */}
          <div className="relative z-10">
            <AdminPerformanceChartSection
              isEmpty={isEmptyState}
              data={productPerformance}
            />
          </div>

          {/* 3. Recent Transactions Table (Image 3) */}
          <div className="relative z-0">
            <AdminRecentTransactionsSection
              isEmpty={isEmptyState}
              transactions={recentTransactions}
            />
          </div>

          {/* 4. Game Requests Widget */}
          <div className="relative z-0">
            <AdminGameRequestsSection
              isEmpty={isEmptyState}
              requests={gameRequests}
              totalCount={gameRequests ? gameRequests.length : undefined}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

