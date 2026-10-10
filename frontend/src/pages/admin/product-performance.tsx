import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminProductHeroBanner,
  AdminProductMetricsSection,
  AdminProductRevenueChartCard,
  AdminProductOrdersTableSection,
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

export default function AdminProductPerformancePage() {
  // Breadcrumbs matching Gambar 1: Pendapatan > Product Performance
  const breadcrumbs = (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 select-none"
    >
      <Link
        href="/admin/revenue"
        className="text-[12px] leading-[1.4] font-medium text-gray-400 hover:text-white transition-colors"
      >
        Pendapatan
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-[12px] leading-[1.4] font-semibold text-white">
        Product Performance
      </span>
    </nav>
  );

  return (
    <>
      <Head>
        <title>Product Performance | Gamezygo Admin</title>
        <meta
          name="description"
          content="Detailed performance analytics, sales volume, and order history for Beholder : Conductor"
        />
      </Head>

      <AdminLayout title={breadcrumbs} activeNavId="pendapatan">
        <div className="space-y-8 pb-10">
          {/* 1. Top Product Hero Banner (Gambar 1) */}
          <section className="relative z-20">
            <AdminProductHeroBanner />
          </section>

          {/* 2. Three Metric Cards: REVENUE, RANK IN TABLES, LAST SOLD 24H (Gambar 2 Top) */}
          <section className="relative z-10">
            <AdminProductMetricsSection />
          </section>

          {/* 3. Product Revenue Area Chart (Gambar 2 Bottom) */}
          <section className="relative z-10">
            <AdminProductRevenueChartCard />
          </section>

          {/* 4. Product Orders Table (Gambar 3) */}
          <section className="relative z-0">
            <AdminProductOrdersTableSection />
          </section>
        </div>
      </AdminLayout>
    </>
  );
}
