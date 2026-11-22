import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminTransactionMetricsSection,
  AdminTransactionsTableSection,
} from "@/features/admin";
import { useAdminRecentTransactions } from "@/hooks/use-admin-dashboard";

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const emptySubscribe = () => () => {};

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  const [isEmptyManual, setIsEmptyManual] = React.useState<boolean | null>(null);

  const {
    metricsData,
    transactions,
    isLoading,
    isError,
    refetch,
  } = useAdminRecentTransactions(50);

  const isEmptyState =
    isEmptyManual !== null
      ? isEmptyManual
      : isMounted && router.isReady
      ? router.query.empty === "true"
      : false;

  // Breadcrumbs matching Gambar 4: Main Dashboard > Recent Transactions
  const breadcrumbs = (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 select-none"
    >
      <Link
        href="/admin/dashboard"
        className="text-[12px] leading-[1.4] font-medium text-gray-400 hover:text-white transition-colors"
      >
        Main Dashboard
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-[12px] leading-[1.4] font-semibold text-white">
        Recent Transactions
      </span>
    </nav>
  );

  // Switcher toggle in headerRight for previewing both Filled State (Gambar 1) and Empty State (Gambar 2-3)
  const headerRight = (
    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 text-label-xs">
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
  );

  return (
    <>
      <Head>
        <title>Recent Transactions | Gamezygo Admin</title>
        <meta
          name="description"
          content="Transaction history, revenue summaries, and order records for Gamezygo administration"
        />
      </Head>

      <AdminLayout
        title={breadcrumbs}
        activeNavId="dashboard"
        headerRight={headerRight}
      >
        <div className="space-y-8 pb-10">
          {isError && (
            <div className="w-full py-10 rounded-lg bg-deep-blue-900 border border-rose-500/30 flex flex-col items-center justify-center text-center gap-3 px-4">
              <p className="text-sm text-rose-300 font-medium">
                Gagal memuat data transaksi dari database. Pastikan Anda sudah login sebagai Admin.
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Muat Ulang
              </Button>
            </div>
          )}

          {/* 1. Top 3 Transaction Metric Cards (Gambar 1, 2, 5) */}
          <div className="relative z-20">
            <AdminTransactionMetricsSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              data={metricsData}
            />
          </div>

          {/* 2. Full Transactions Table / Empty State (Gambar 1, 3) */}
          <div className="relative z-10">
            <AdminTransactionsTableSection
              isEmpty={isEmptyState}
              isLoading={isLoading}
              transactions={transactions}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
