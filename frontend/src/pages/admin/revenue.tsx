import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminRevenueMetricsSection,
  AdminRevenueChartCard,
  AdminIncomeSpreadCard,
  AdminRevenueProductTableSection,
  AdminBundleStatisticSection,
  AdminActiveVouchersSection,
} from "@/features/admin/components";
import { useAdminRevenue } from "@/hooks/use-admin-revenue";

const emptySubscribe = () => () => {};

export default function AdminRevenuePage() {
  const router = useRouter();
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isEmptyManual, setIsEmptyManual] = React.useState<boolean | null>(null);

  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("today");
  const [orderPeriod, setOrderPeriod] = React.useState<string>("today");
  const [startDate, setStartDate] = React.useState<string | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);

  // Live database hook for revenue data
  const {
    metrics,
    chartData,
    incomeSpreadProductTypes,
    incomeSpreadProducts,
    products,
    totalGamesCount,
    bundleStatistics,
    vouchers,
    totalVouchersCount,
    voucherBurnAllTime,
    isLoading,
    isError,
  } = useAdminRevenue({
    period: selectedPeriod,
    start_date: startDate,
    end_date: endDate,
  });

  const isEmptyState =
    isEmptyManual !== null
      ? isEmptyManual
      : isMounted && router.isReady
      ? router.query.empty === "true"
      : false;

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    if (!start || !end) {
      setStartDate(undefined);
      setEndDate(undefined);
      return;
    }
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

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
            <div className="flex items-center gap-3">
              <span className="text-gray-400">
                Tampilan Halaman Pendapatan:{" "}
                <span className="text-gray-100 font-semibold">
                  {isEmptyState ? "Empty State (Sesuai Desain)" : "Data Terisi (Database)"}
                </span>
              </span>
              {isError && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Koneksi API offline (menggunakan fallback)
                </span>
              )}
            </div>
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

          {/* 1. Top Revenue Metrics Section (Gambar 1) - z-30 so dropdown floats over charts below */}
          <div className="relative z-30">
            <AdminRevenueMetricsSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              metrics={metrics}
              heroTimeframe={selectedPeriod}
              onHeroTimeframeChange={setSelectedPeriod}
              orderTimeframe={orderPeriod}
              onOrderTimeframeChange={setOrderPeriod}
            />
          </div>

          {/* 2. Charts Section: Revenue Area Chart (Left) + Income Spread Donut Chart (Right) (Gambar 2) */}
          <div className="relative z-20 grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            <AdminRevenueChartCard
              isEmpty={isEmptyState}
              isLoading={isLoading}
              data={chartData}
              onChangeRange={handleDateRangeChange}
            />
            <AdminIncomeSpreadCard
              isEmpty={isEmptyState}
              isLoading={isLoading}
              productTypes={incomeSpreadProductTypes}
              products={incomeSpreadProducts}
              timeframe={selectedPeriod}
              onTimeframeChange={setSelectedPeriod}
            />
          </div>

          {/* 3. Products Listed Table (Gambar 3) */}
          <div className="relative z-10">
            <AdminRevenueProductTableSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              products={products}
              totalGamesCount={totalGamesCount}
            />
          </div>

          {/* 4. Bundle Statistic Widget (Gambar 4) */}
          <div className="relative z-0">
            <AdminBundleStatisticSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              data={bundleStatistics}
            />
          </div>

          {/* 5. Active Vouchers Table (Gambar 5) */}
          <div className="relative z-0">
            <AdminActiveVouchersSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
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
