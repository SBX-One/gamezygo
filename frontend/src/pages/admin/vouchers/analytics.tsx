import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminVoucherAnalyticsOverview,
  AdminVoucherTargetSection,
  AdminVoucherRevenueChart,
  AdminVoucherOrdersTable,
} from "@/features/admin/components/vouchers/analytics";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import {
  MOCK_VOUCHER_ANALYTICS_DATA,
  MOCK_VOUCHER_ANALYTICS_EMPTY_DATA,
} from "@/features/admin/data/admin-voucher-analytics-mock-data";
import { useVoucherAnalytics } from "@/hooks/use-admin-vouchers";
import { adminVoucherService } from "@/services/admin-voucher.service";
import { toast } from "@/stores/use-toast-store";
import type { VoucherAnalyticsData } from "@/features/admin/types/admin-voucher-analytics.types";

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

export default function AdminVoucherAnalyticsPage() {
  const router = useRouter();
  const { id, code, empty } = router.query;
  const voucherId = typeof id === "string" ? id : undefined;
  const voucherCode = typeof code === "string" ? code : undefined;

  const [isEmptyMode, setIsEmptyMode] = React.useState<boolean>(
    empty === "true" || empty === "1"
  );
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const { data: serverAnalytics } = useVoucherAnalytics({
    id: voucherId,
    code: voucherCode,
  });

  const effectiveIsEmptyMode = isEmptyMode || empty === "true" || empty === "1";

  const analyticsData: VoucherAnalyticsData = React.useMemo(() => {
    if (effectiveIsEmptyMode) {
      return MOCK_VOUCHER_ANALYTICS_EMPTY_DATA;
    }
    if (serverAnalytics?.data) {
      return serverAnalytics.data;
    }
    const base = MOCK_VOUCHER_ANALYTICS_DATA;
    if (voucherCode && voucherCode.trim()) {
      return {
        ...base,
        summary: {
          ...base.summary,
          voucherCode: voucherCode.toUpperCase(),
        },
      };
    }
    return base;
  }, [effectiveIsEmptyMode, serverAnalytics, voucherCode]);

  // Export CSV Handler
  const handleExportCSV = async () => {
    if (voucherId && !effectiveIsEmptyMode) {
      try {
        const blob = await adminVoucherService.exportUsagesCsv(voucherId);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `Voucher_Analytics_${analyticsData.summary.voucherCode}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Data penggunaan voucher berhasil diekspor ke CSV!", "Export Berhasil");
        return;
      } catch {
        // Fallback to client-side CSV if server export fails
      }
    }

    const headers = ["Order ID", "Customer Email", "Status", "Price", "Date"];
    const rows = analyticsData.orders.map((o) => [
      `"${o.orderId}"`,
      `"${o.customerEmail}"`,
      `"${o.status}"`,
      `"${o.price}"`,
      `"${o.date}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Voucher_Analytics_${analyticsData.summary.voucherCode}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Breadcrumbs Header matching Image 1: Voucher > Analytics
  const breadcrumbs = (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 select-none text-label-xs"
    >
      <Link
        href="/admin/vouchers"
        className="text-[12px] leading-[1.4] font-medium text-gray-400 hover:text-white transition-colors"
      >
        Voucher
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-[12px] leading-[1.4] font-semibold text-white">
        Analytics
      </span>
    </nav>
  );

  // Right Header Buttons: Toggle Empty State demo + [Export CSV]
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <Button
        variant="outline"
        size="xs"
        onClick={() => setIsEmptyMode((prev) => !prev)}
        className="px-3 py-2"
      >
        {isEmptyMode ? "Preview Data" : "Preview Empty State"}
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={handleExportCSV}
      >
        Export CSV
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>
          {analyticsData.summary.voucherCode} Analytics | Gamezygo Admin
        </title>
        <meta
          name="description"
          content={`Voucher performance, total usage, burn rate, target games, and transaction metrics for ${analyticsData.summary.voucherCode}`}
        />
      </Head>

      <AdminLayout
        title={breadcrumbs}
        activeNavId="voucher"
        headerRight={headerRight}
      >
        <div className="flex flex-col gap-8 w-full pb-12 select-none font-sans">
          {/* Section 1: Voucher Name & Metric Cards (Matching Images 2 & 3) */}
          <section className="w-full">
            <AdminVoucherAnalyticsOverview summary={analyticsData.summary} />
          </section>

          {/* Section 2: Target Game & Target User Lists / Empty States (Matching Images 3 & 4) */}
          <section className="w-full">
            <AdminVoucherTargetSection
              games={analyticsData.targetGames}
              users={analyticsData.targetUsers}
            />
          </section>

          {/* Section 3: Revenue Area Chart / Empty State (Matching Images 2 & 4) */}
          <section className="w-full">
            <AdminVoucherRevenueChart data={analyticsData.revenueChart} />
          </section>

          {/* Section 4: Orders & Transactions Table / Empty State (Matching Image 4) */}
          <section className="w-full space-y-6">
            <AdminVoucherOrdersTable orders={analyticsData.orders} />

            {/* Pagination Component (Menggunakan component Pagination yang sudah ada) */}
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={25}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </div>
      </AdminLayout>
    </>
  );
}
