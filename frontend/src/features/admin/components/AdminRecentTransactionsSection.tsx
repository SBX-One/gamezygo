import * as React from "react";
import Link from "next/link";
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
import { MOCK_ADMIN_TRANSACTIONS } from "../data/admin-mock-data";
import type { AdminTransaction } from "../types/admin.types";

export interface AdminRecentTransactionsSectionProps {
  isEmpty?: boolean;
  transactions?: AdminTransaction[];
  viewAllHref?: string;
  className?: string;
  isLoading?: boolean;
}

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export function AdminRecentTransactionsSection({
  isEmpty = false,
  transactions,
  viewAllHref = "/admin/transactions",
  className,
  isLoading = false,
}: AdminRecentTransactionsSectionProps) {
  const activeTransactions = isEmpty
    ? []
    : transactions || MOCK_ADMIN_TRANSACTIONS;

  const headerRight = (
    <Link
      href={viewAllHref}
      className="inline-flex items-center gap-1.5 text-label-xs font-medium text-gray-200 hover:text-white transition-colors group shrink-0 whitespace-nowrap"
    >
      <span>Lihat Semua</span>
      <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );

  return (
    <AdminCard
      title="RECENT TRANSACTIONS"
      headerRight={headerRight}
      className={className}
      bodyClassName="p-0"
    >
      <AdminTable>
        <AdminTableHeader>
          <tr>
            <AdminTableHead className="pl-6">Customer Email</AdminTableHead>
            <AdminTableHead>Product Name</AdminTableHead>
            <AdminTableHead>Total Revenue</AdminTableHead>
            <AdminTableHead>Date</AdminTableHead>
            <AdminTableHead className="pr-6">Status</AdminTableHead>
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <AdminTableRow key={`tx-skel-${idx}`}>
                <AdminTableCell className="pl-6">
                  <div className="w-40 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-24 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell className="pr-6">
                  <div className="w-16 h-6 rounded-full bg-white/10 animate-pulse" />
                </AdminTableCell>
              </AdminTableRow>
            ))
          ) : activeTransactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 sm:py-20 px-4 text-center">
                <AdminEmptyState
                  category="Recent Transactions"
                  actionLabel="Recent Transactions"
                  actionIcon={<ArrowRightIcon className="w-3.5 h-3.5" />}
                  actionIconPosition="right"
                  actionHref={viewAllHref}
                />
              </td>
            </tr>
          ) : (
            activeTransactions.map((tx) => (
              <AdminTableRow key={tx.id}>
                <AdminTableCell className="pl-6 font-semibold text-white">
                  {tx.customerEmail}
                </AdminTableCell>
                <AdminTableCell className="text-gray-300">
                  {tx.productName}
                </AdminTableCell>
                <AdminTableCell className="text-gray-300 font-medium">
                  {tx.totalRevenue}
                </AdminTableCell>
                <AdminTableCell className="text-gray-400 text-label-xs">
                  {tx.date}
                </AdminTableCell>
                <AdminTableCell className="pr-6">
                  <AdminBadge variant={tx.status === "pending" ? "pending" : "success"}>
                    {tx.status === "pending" ? "Pending" : "Completed"}
                  </AdminBadge>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>

      </AdminTable>
    </AdminCard>
  );
}
