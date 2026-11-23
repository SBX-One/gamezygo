import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminMetricsSection,
  AdminPerformanceChartSection,
  AdminRecentTransactionsSection,
  AdminGameRequestsSection,
} from "@/features/admin/components";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

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
    isError,
    refetch,
  } = useAdminDashboard(selectedTimeframe);

  const isEmptyState = router.isReady ? router.query.empty === "true" : false;

  return (
    <>
      <Head>
        <title>Main Dashboard | Gamezygo Admin</title>
        <meta
          name="description"
          content="Main financial and performance dashboard for Gamezygo administration"
        />
      </Head>

      <AdminLayout
        title="Main Dashboard"
        activeNavId="dashboard"
        isError={isError}
        onReload={() => refetch()}
      >
        <div className="space-y-8">
          {/* 1. Hero Revenue + Stat Cards (Image 1) - z-20 so dropdown floats over charts below */}
          <div className="relative z-20 has-[[aria-expanded='true']]:z-30">
            <AdminMetricsSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              heroStat={heroStat}
              statCards={statCards}
              onTimeframeChange={setSelectedTimeframe}
            />
          </div>

          {/* 2. Best Performance Product Bar Chart (Image 2) */}
          <div className="relative z-10">
            <AdminPerformanceChartSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              data={productPerformance}
            />
          </div>

          {/* 3. Recent Transactions Table (Image 3) */}
          <div className="relative z-0">
            <AdminRecentTransactionsSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              transactions={recentTransactions}
            />
          </div>

          {/* 4. Game Requests Widget */}
          <div className="relative z-0">
            <AdminGameRequestsSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              requests={gameRequests}
              totalCount={gameRequests ? gameRequests.length : undefined}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

