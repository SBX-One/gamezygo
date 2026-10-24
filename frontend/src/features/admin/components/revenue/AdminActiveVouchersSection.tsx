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
  AdminEmptyState,
} from "@/components/admin";
import { MOCK_ACTIVE_VOUCHERS } from "../../data/admin-revenue-mock-data";
import type { ActiveVoucherItem } from "../../types/admin-revenue.types";

export interface AdminActiveVouchersSectionProps {
  isEmpty?: boolean;
  vouchers?: ActiveVoucherItem[];
  totalVouchersCount?: number;
  burnRateText?: string;
  addVoucherHref?: string;
  onAddVoucher?: () => void;
  className?: string;
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

const MoreVerticalIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("w-4 h-4", className)}
    {...props}
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

// Ticket / Voucher Icon matching Figma screenshot (media_1792660787188.png)
const VoucherTicketIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <g transform="rotate(-45 12 12)">
      <path d="M4 6h6a2 2 0 0 1 4 0h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
      <line x1="12" y1="9" x2="12" y2="10" />
      <line x1="12" y1="14" x2="12" y2="15" />
    </g>
  </svg>
);

// Analytics 3-bars Icon matching Figma screenshot (media_1792660787188.png)
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
    <path d="M4 19V13a1 1 0 0 1 1-1h3V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
    <line x1="8" y1="12" x2="8" y2="20" />
    <line x1="14" y1="12" x2="14" y2="20" />
  </svg>
);

export function AdminActiveVouchersSection({
  isEmpty = false,
  vouchers = MOCK_ACTIVE_VOUCHERS,
  totalVouchersCount = 99,
  burnRateText = "IDR 200,000",
  addVoucherHref = "/admin/vouchers/new",
  onAddVoucher,
  className,
}: AdminActiveVouchersSectionProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const menuContainerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMenuId(null);
      }
    }

    if (activeMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenuId]);

  const displayCount = isEmpty ? 0 : totalVouchersCount;
  const displayBurnRate = isEmpty ? "IDR 0" : burnRateText;
  const activeVouchers = isEmpty ? [] : vouchers;

  const cardTitle = (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-body-sm text-gray-400 uppercase whitespace-nowrap">
        ACTIVE VOUCHER :
      </span>
      <span className="text-label-sm font-semibold text-white whitespace-nowrap">
        {displayCount} Voucher
      </span>
    </div>
  );

  const headerRight = (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-body-sm text-gray-400 uppercase whitespace-nowrap">
        BURN RATE :
      </span>
      <span className="text-label-sm font-semibold text-white whitespace-nowrap">
        {displayBurnRate}
      </span>
    </div>
  );

  return (
    <AdminCard
      title={cardTitle}
      headerRight={headerRight}
      headerResponsive={true}
      className={className}
      bodyClassName="p-0"
    >
      <AdminTable>
        <AdminTableHeader>
          <tr>
            <AdminTableHead className="pl-6">Voucher Name</AdminTableHead>
            <AdminTableHead>Total Use</AdminTableHead>
            <AdminTableHead>Minus Revenue</AdminTableHead>
            {!isEmpty && (
              <AdminTableHead className="pr-6 w-12 text-center" aria-label="Aksi" />
            )}
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {isEmpty || activeVouchers.length === 0 ? (
            <tr>
              <td colSpan={isEmpty ? 3 : 4} className="py-16 sm:py-20 px-4 text-center">
                <AdminEmptyState
                  category="Voucher List"
                  actionLabel="Tambah Voucher"
                  actionIcon={<PlusIcon className="w-4 h-4" />}
                  actionIconPosition="left"
                  onAction={onAddVoucher}
                  actionHref={onAddVoucher ? undefined : addVoucherHref}
                />
              </td>
            </tr>
          ) : (
            activeVouchers.map((vouch, idx) => {
              const isMenuOpen = activeMenuId === vouch.id;
              const isNearBottom = idx >= activeVouchers.length - 2 && activeVouchers.length > 2;

              return (
                <AdminTableRow key={vouch.id} className={isMenuOpen ? "relative z-20" : undefined}>
                  <AdminTableCell className="pl-6 font-semibold text-white">
                    {vouch.code}
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-300 font-medium">
                    {vouch.totalUse}
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-300 font-medium">
                    {vouch.minusRevenue}
                  </AdminTableCell>
                  <AdminTableCell className={cn("pr-6 text-center", isMenuOpen && "relative z-30")}>
                    <div
                      className="relative inline-block text-left"
                      ref={isMenuOpen ? menuContainerRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : vouch.id)
                        }
                        className={cn(
                          "p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer",
                          isMenuOpen && "text-white bg-white/10"
                        )}
                        aria-label={`Menu opsi voucher ${vouch.code}`}
                        aria-expanded={isMenuOpen}
                      >
                        <MoreVerticalIcon className={isMenuOpen ? "text-white" : "text-gray-400 hover:text-white"} />
                      </button>

                      {isMenuOpen && (
                        <div
                          className={cn(
                            "absolute right-0 z-50 w-44 rounded-2xl bg-[#10131E] border border-deep-blue-700/80 p-2 shadow-2xl shadow-black/80 flex flex-col gap-1 text-left select-none animate-in fade-in zoom-in-95 duration-150",
                            isNearBottom ? "bottom-full mb-1.5" : "top-full mt-1.5"
                          )}
                        >
                          <Link
                            href={`/admin/vouchers?code=${encodeURIComponent(vouch.code)}`}
                            onClick={() => setActiveMenuId(null)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <VoucherTicketIcon className="w-[18px] h-[18px] text-indigo-200/90 group-hover:text-white transition-colors shrink-0" />
                            <span>Voucher</span>
                          </Link>

                          <Link
                            href={`/admin/vouchers/analytics?code=${encodeURIComponent(vouch.code)}`}
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
