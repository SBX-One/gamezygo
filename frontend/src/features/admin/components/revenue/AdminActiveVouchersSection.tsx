import * as React from "react";
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

export function AdminActiveVouchersSection({
  isEmpty = false,
  vouchers = MOCK_ACTIVE_VOUCHERS,
  totalVouchersCount = 99,
  burnRateText = "IDR 200,000",
  addVoucherHref = "/admin/vouchers/new",
  onAddVoucher,
  className,
}: AdminActiveVouchersSectionProps) {
  const displayCount = isEmpty ? 0 : totalVouchersCount;
  const displayBurnRate = isEmpty ? "IDR 0" : burnRateText;
  const activeVouchers = isEmpty ? [] : vouchers;

  const cardTitle = (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 uppercase">
        ACTIVE VOUCHER :
      </span>
      <span className="text-xs font-bold text-white">
        {displayCount} Voucher
      </span>
    </div>
  );

  const headerRight = (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 uppercase">
        BURN RATE :
      </span>
      <span className="text-xs font-bold text-white">
        {displayBurnRate}
      </span>
    </div>
  );

  return (
    <AdminCard
      title={cardTitle}
      headerRight={headerRight}
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
            activeVouchers.map((vouch) => (
              <AdminTableRow key={vouch.id}>
                <AdminTableCell className="pl-6 font-semibold text-white">
                  {vouch.code}
                </AdminTableCell>
                <AdminTableCell className="text-gray-300 font-medium">
                  {vouch.totalUse}
                </AdminTableCell>
                <AdminTableCell className="text-gray-300 font-medium">
                  {vouch.minusRevenue}
                </AdminTableCell>
                <AdminTableCell className="pr-6 text-center">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    aria-label="Menu opsi voucher"
                  >
                    <MoreVerticalIcon />
                  </button>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </AdminCard>
  );
}
