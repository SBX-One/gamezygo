import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AdminCard,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  AdminBadge,
  AdminEmptyState,
} from "@/components/admin";
import { MOCK_REVENUE_PRODUCTS } from "../../data/admin-revenue-mock-data";
import type { RevenueProductItem } from "../../types/admin-revenue.types";

export interface AdminRevenueProductTableSectionProps {
  isEmpty?: boolean;
  products?: RevenueProductItem[];
  totalGamesCount?: number;
  addProductHref?: string;
  onAddProduct?: () => void;
  className?: string;
  isLoading?: boolean;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
    {...props}
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const AnalyticsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export function AdminRevenueProductTableSection({
  isEmpty = false,
  products = MOCK_REVENUE_PRODUCTS,
  totalGamesCount = 90,
  addProductHref = "/admin/catalog/add",
  onAddProduct,
  className,
  isLoading = false,
}: AdminRevenueProductTableSectionProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const menuContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  const getPerformanceHref = (item: RevenueProductItem) => {
    if (/^\d+$/.test(String(item.id))) {
      return `/admin/products/${item.id}/performance`;
    }
    return `/admin/product-performance?name=${encodeURIComponent(item.name)}`;
  };

  const displayCount = isEmpty ? 0 : totalGamesCount;
  const activeProducts = isEmpty ? [] : products;

  const cardTitle = (
    <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
      <span className="text-body-sm text-gray-400 uppercase whitespace-nowrap">
        TOTAL PRODUCT :
      </span>
      <span className="text-label-sm font-semibold text-white whitespace-nowrap">
        {displayCount} Games Listed
      </span>
    </div>
  );

  return (
    <AdminCard
      title={cardTitle}
      headerResponsive={true}
      className={className}
      bodyClassName="p-0"
    >
      <AdminTable className="min-w-[700px]">
        <AdminTableHeader>
          <tr>
            <AdminTableHead className="pl-6 min-w-[180px]">Product Name</AdminTableHead>
            <AdminTableHead className="min-w-[140px]">Total Product Sell</AdminTableHead>
            <AdminTableHead className="min-w-[130px]">Total Revenue</AdminTableHead>
            <AdminTableHead className="min-w-[110px]">Date</AdminTableHead>
            <AdminTableHead className="min-w-[100px]">Status</AdminTableHead>
            {!isEmpty && (
              <AdminTableHead className="pr-6 w-12 text-center" aria-label="Aksi" />
            )}
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <AdminTableRow key={`rev-prod-skel-${idx}`}>
                <AdminTableCell className="pl-6">
                  <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-24 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-16 h-6 rounded-full bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell className="pr-6 text-center">
                  <div className="w-6 h-6 rounded bg-white/10 animate-pulse mx-auto" />
                </AdminTableCell>
              </AdminTableRow>
            ))
          ) : isEmpty || activeProducts.length === 0 ? (
            <tr>
              <td colSpan={isEmpty ? 5 : 6} className="py-16 sm:py-20 px-4 text-center">
                <AdminEmptyState
                  category="Product List"
                  actionLabel="Tambah Produk"
                  actionIcon={<PlusIcon className="w-4 h-4" />}
                  actionIconPosition="left"
                  onAction={onAddProduct}
                  actionHref={onAddProduct ? undefined : addProductHref}
                />
              </td>
            </tr>
          ) : (
            activeProducts.map((item, idx) => {
              const isMenuOpen = activeMenuId === item.id;
              const isNearBottom =
                idx >= activeProducts.length - 2 && activeProducts.length > 2;
              const perfHref = getPerformanceHref(item);

              return (
                <AdminTableRow key={item.id}>
                  <AdminTableCell className="pl-6 font-semibold text-white">
                    <Link
                      href={perfHref}
                      className="hover:text-indigo-300 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-400">
                    {item.totalSell}
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-400">
                    {item.totalRevenue}
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-400">
                    {item.date}
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant={item.status === "pending" ? "pending" : "success"}>
                      {item.status === "pending" ? "Pending" : "Completed"}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell className="pr-6 text-center">
                    <div
                      className="relative inline-block text-left"
                      ref={isMenuOpen ? menuContainerRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : item.id)
                        }
                        className={cn(
                          "p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer",
                          isMenuOpen && "text-white bg-white/10"
                        )}
                        aria-label={`Menu opsi produk ${item.name}`}
                        aria-expanded={isMenuOpen}
                      >
                        <MoreVerticalIcon
                          className={
                            isMenuOpen
                              ? "text-white"
                              : "text-gray-400 hover:text-white"
                          }
                        />
                      </button>

                      {isMenuOpen && (
                        <div
                          className={cn(
                            "absolute right-0 z-50 w-44 rounded-2xl bg-[#10131E] border border-deep-blue-700/80 p-2 shadow-2xl shadow-black/80 flex flex-col gap-1 text-left select-none animate-in fade-in zoom-in-95 duration-150",
                            isNearBottom
                              ? "bottom-full mb-1.5"
                              : "top-full mt-1.5"
                          )}
                        >
                          <Link
                            href={perfHref}
                            onClick={() => setActiveMenuId(null)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <AnalyticsIcon className="w-[18px] h-[18px] text-indigo-200/90 group-hover:text-white transition-colors shrink-0" />
                            <span>Analytics</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          )}
        </AdminTableBody>
      </AdminTable>
    </AdminCard>
  );
}
