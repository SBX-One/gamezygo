import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminTransactionMetricsSection,
  AdminTransactionsTableSection,
} from "@/features/admin";

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
    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 text-xs">
      <button
        type="button"
        onClick={() => setIsEmptyManual(false)}
        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
          !isEmptyState
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Data Terisi
      </button>
      <button
        type="button"
        onClick={() => setIsEmptyManual(true)}
        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
          isEmptyState
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Empty State
      </button>
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
          {/* 1. Top 3 Transaction Metric Cards (Gambar 1, 2, 5) */}
          <div className="relative z-20">
            <AdminTransactionMetricsSection isEmpty={isEmptyState} />
          </div>

          {/* 2. Full Transactions Table / Empty State (Gambar 1, 3) */}
          <div className="relative z-10">
            <AdminTransactionsTableSection isEmpty={isEmptyState} />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
