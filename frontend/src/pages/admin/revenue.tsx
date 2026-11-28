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
import {
  useAdminRevenueMetrics,
  useAdminRevenueChart,
  useAdminIncomeSpread,
  useAdminRevenueTables,
} from "@/hooks/use-admin-revenue";

export default function AdminRevenuePage() {
  const router = useRouter();

  // 1. Independent filter states per card/section
  const [metricsPeriod, setMetricsPeriod] = React.useState<string>("today");
  const [orderPeriod, setOrderPeriod] = React.useState<string>("today");
  const [spreadPeriod, setSpreadPeriod] = React.useState<string>("today");
  const [chartPeriod, setChartPeriod] = React.useState<string>("weekly");
  const [chartStartDate, setChartStartDate] = React.useState<string | undefined>(undefined);
  const [chartEndDate, setChartEndDate] = React.useState<string | undefined>(undefined);

  // 2. Granular queries: changing one filter ONLY fetches & renders skeleton for that specific card
  const {
    metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    refetch: refetchMetrics,
  } = useAdminRevenueMetrics(metricsPeriod);

  const {
    chartData,
    isLoading: isChartLoading,
    isError: isChartError,
    refetch: refetchChart,
  } = useAdminRevenueChart({
    period: chartPeriod,
    start_date: chartStartDate,
    end_date: chartEndDate,
  });

  const {
    incomeSpreadProductTypes,
    incomeSpreadProducts,
    isLoading: isSpreadLoading,
    isError: isSpreadError,
    refetch: refetchSpread,
  } = useAdminIncomeSpread(spreadPeriod);

  const {
    products,
    totalGamesCount,
    bundleStatistics,
    vouchers,
    totalVouchersCount,
    voucherBurnAllTime,
    isLoading: isTablesLoading,
    isError: isTablesError,
    refetch: refetchTables,
  } = useAdminRevenueTables();

  const isEmptyState = router.isReady ? router.query.empty === "true" : false;

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    if (!start || !end) {
      setChartStartDate(undefined);
      setChartEndDate(undefined);
      return;
    }
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setChartStartDate(formatDate(start));
    setChartEndDate(formatDate(end));
  };

  const handleReload = () => {
    refetchMetrics();
    refetchChart();
    refetchSpread();
    refetchTables();
  };

  const hasPageError = isMetricsError && isChartError && isSpreadError && isTablesError;

  return (
    <>
      <Head>
        <title>Pendapatan | Gamezygo Admin</title>
        <meta
          name="description"
          content="Financial reporting, revenue charts, and transaction distribution dashboard for Gamezygo administration"
        />
      </Head>

      <AdminLayout
        title="Pendapatan"
        activeNavId="pendapatan"
        isError={hasPageError}
        onReload={handleReload}
      >
        <div className="space-y-8 pb-10">
          {/* 1. Top Revenue Metrics Section (Gambar 1) - z-30 so dropdown floats over charts below */}
          <div className="relative z-30">
            <AdminRevenueMetricsSection
              isEmpty={isEmptyState}
              isLoading={isMetricsLoading}
              metrics={metrics}
              heroTimeframe={metricsPeriod}
              onHeroTimeframeChange={setMetricsPeriod}
              orderTimeframe={orderPeriod}
              onOrderTimeframeChange={setOrderPeriod}
            />
          </div>

          {/* 2. Charts Section: Revenue Area Chart (Left) + Income Spread Donut Chart (Right) (Gambar 2) */}
          <div className="relative z-20 grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            <AdminRevenueChartCard
              isEmpty={isEmptyState}
              isLoading={isChartLoading}
              data={chartData}
              period={chartPeriod}
              onPeriodChange={(nextPeriod) => {
                setChartPeriod(nextPeriod);
                setChartStartDate(undefined);
                setChartEndDate(undefined);
              }}
              onChangeRange={handleDateRangeChange}
            />
            <AdminIncomeSpreadCard
              isEmpty={isEmptyState}
              isLoading={isSpreadLoading}
              productTypes={incomeSpreadProductTypes}
              products={incomeSpreadProducts}
              timeframe={spreadPeriod}
              onTimeframeChange={setSpreadPeriod}
            />
          </div>

          {/* 3. Products Listed Table (Gambar 3) */}
          <div className="relative z-10">
            <AdminRevenueProductTableSection
              isEmpty={isEmptyState}
              isLoading={isTablesLoading}
              products={products}
              totalGamesCount={totalGamesCount}
            />
          </div>

          {/* 4. Bundle Statistic Widget (Gambar 4) */}
          <div className="relative z-0">
            <AdminBundleStatisticSection
              isEmpty={isEmptyState}
              isLoading={isTablesLoading}
              data={bundleStatistics}
            />
          </div>

          {/* 5. Active Vouchers Table (Gambar 5) */}
          <div className="relative z-0">
            <AdminActiveVouchersSection
              isEmpty={isEmptyState}
              isLoading={isTablesLoading}
              vouchers={vouchers}
              totalVouchersCount={totalVouchersCount}
              burnRateText={voucherBurnAllTime ? `Total Burn: ${voucherBurnAllTime}` : undefined}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
