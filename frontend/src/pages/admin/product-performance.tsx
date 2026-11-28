import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminProductHeroBanner,
  AdminProductMetricsSection,
  AdminProductRevenueChartCard,
  AdminProductOrdersTableSection,
} from "@/features/admin";
import { apiClient } from "@/lib/api-client";
import { useAdminProductRevenue } from "@/hooks/use-admin-revenue";
import { useAdminRecentTransactions } from "@/hooks/use-admin-dashboard";
import { formatRupiah } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/image-url";
import type {
  ProductHeroData,
  ProductMetricsData,
  ProductOrderItem,
} from "@/features/admin/types/admin-product-performance.types";

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
  const router = useRouter();
  const routeId =
    typeof router.query.id === "string" && router.query.id.trim()
      ? router.query.id.trim()
      : "";
  const routeName =
    typeof router.query.name === "string" && router.query.name.trim()
      ? router.query.name.trim()
      : "";

  // Resolve product ID from catalog when opened via ?name=... or directly without [id]
  const fallbackCatalogQuery = useQuery({
    queryKey: ["admin-catalog-resolve-product", routeName],
    queryFn: async () => {
      const response = await apiClient.get<{
        data?: { products?: Array<{ id: number | string; name?: string }> };
      }>("/admin/catalog", {
        params: routeName ? { search: routeName, per_page: 20 } : { per_page: 1 },
      });
      const list = response.data?.data?.products ?? [];
      if (routeName) {
        const exact = list.find(
          (p) => (p.name || "").trim().toLowerCase() === routeName.toLowerCase()
        );
        if (exact?.id) return String(exact.id);
      }
      return list[0]?.id ? String(list[0].id) : "";
    },
    enabled: router.isReady && !routeId,
    staleTime: 60 * 1000,
  });

  const resolvedProductId = routeId || fallbackCatalogQuery.data || "";

  const {
    data: productRevenue,
    isLoading: isRevenueLoading,
    isError,
    refetch,
  } = useAdminProductRevenue(resolvedProductId);

  const { transactions: recentTransactions } = useAdminRecentTransactions(100);

  const heroData: ProductHeroData | undefined = React.useMemo(() => {
    if (!productRevenue?.product) return undefined;
    const p = productRevenue.product;
    return {
      id: String(p.id),
      title: p.name,
      genres: (p.categories ?? []).map((c) => c.name),
      totalSold: Number(productRevenue.total_sold ?? 0),
      coverImage: resolveImageUrl(
        p.thumbnail,
        "https://placehold.co/600x900/13151F/6366F1?text=No+Cover"
      ),
    };
  }, [productRevenue]);

  const metricsData: ProductMetricsData | undefined = React.useMemo(() => {
    if (!productRevenue) return undefined;
    return {
      revenue: formatRupiah(Number(productRevenue.revenue?.total ?? 0)),
      revenueChange: `${productRevenue.revenue?.percentage ?? 0}%`,
      revenueSubtitle: productRevenue.revenue?.description || "KEUNTUNGAN IDR 0",
      rankInTables: `#${productRevenue.rank?.total ?? "-"}`,
      rankSubtitle: productRevenue.rank?.description || "RANK PENJUALAN",
      lastSold24h: `${productRevenue.last_sold?.total ?? 0} Sold`,
      lastSoldChange: `${productRevenue.last_sold?.percentage ?? 0}%`,
      lastSoldSubtitle:
        productRevenue.last_sold?.description || "KEUNTUNGAN IDR 0",
    };
  }, [productRevenue]);

  const productOrders: ProductOrderItem[] = React.useMemo(() => {
    if (!recentTransactions || !resolvedProductId) return [];
    return recentTransactions
      .filter((tx) => String(tx.productId) === String(resolvedProductId))
      .map((tx) => ({
        orderId: tx.id,
        customerEmail: tx.customerEmail,
        status: tx.status,
        price: tx.amount,
        date: tx.date,
      }));
  }, [recentTransactions, resolvedProductId]);

  const isLoading =
    !router.isReady ||
    (!routeId && fallbackCatalogQuery.isLoading) ||
    isRevenueLoading;

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
        {heroData?.title || "Product Performance"}
      </span>
    </nav>
  );

  return (
    <>
      <Head>
        <title>
          {heroData?.title
            ? `${heroData.title} | Product Performance`
            : "Product Performance | Gamezygo Admin"}
        </title>
        <meta
          name="description"
          content="Detailed performance analytics, sales volume, and order history for Gamezygo product"
        />
      </Head>

      <AdminLayout
        title={breadcrumbs}
        activeNavId="pendapatan"
        isError={!isLoading && (isError || !resolvedProductId)}
        onReload={() => refetch()}
      >
        <div className="space-y-8 pb-10">
          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-56 rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-36 rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
                <div className="h-36 rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
                <div className="h-36 rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
              </div>
              <div className="h-64 rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
            </div>
          ) : (
            <>
              <section className="relative z-20">
                <AdminProductHeroBanner data={heroData} />
              </section>

              <section className="relative z-10">
                <AdminProductMetricsSection data={metricsData} />
              </section>

              <section className="relative z-10">
                <AdminProductRevenueChartCard
                  isEmpty={true}
                  data={[]}
                />
              </section>

              <section className="relative z-0">
                <AdminProductOrdersTableSection orders={productOrders} />
              </section>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
