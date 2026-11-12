import * as React from "react";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  AdminBadge,
  AdminEmptyState,
} from "@/components/admin";
import { MOCK_TRANSACTIONS_LIST } from "../../data/admin-transactions-mock-data";
import type { TransactionItem } from "../../types/admin-transactions.types";

export interface AdminTransactionsTableSectionProps {
  isEmpty?: boolean;
  isLoading?: boolean;
  transactions?: TransactionItem[];
  className?: string;
}

export function AdminTransactionsTableSection({
  isEmpty = false,
  isLoading = false,
  transactions = MOCK_TRANSACTIONS_LIST,
  className,
}: AdminTransactionsTableSectionProps) {
  const activeTransactions = isEmpty ? [] : transactions;

  return (
    <div
      className={`rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden ${
        className || ""
      }`}
    >
      <AdminTable>
        <AdminTableHeader>
          <tr>
            <AdminTableHead className="pl-6">Transactions ID</AdminTableHead>
            <AdminTableHead>Customer Email</AdminTableHead>
            <AdminTableHead>Product ID</AdminTableHead>
            <AdminTableHead>Product Name</AdminTableHead>
            <AdminTableHead>Transactions</AdminTableHead>
            <AdminTableHead>Date</AdminTableHead>
            <AdminTableHead className="pr-6">Status</AdminTableHead>
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <AdminTableRow key={`tx-skel-${idx}`}>
                <AdminTableCell className="pl-6">
                  <div className="w-28 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-40 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-10 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-28 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell className="pr-6">
                  <div className="w-16 h-6 rounded-full bg-white/10 animate-pulse" />
                </AdminTableCell>
              </AdminTableRow>
            ))
          ) : isEmpty || activeTransactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 px-4 text-center">
                <AdminEmptyState category="Recent Transactions" />
              </td>
            </tr>
          ) : (
            activeTransactions.map((tx, idx) => (
              <AdminTableRow key={`${tx.id}-${idx}`}>
                <AdminTableCell className="pl-6 font-mono text-label-xs text-gray-300">
                  {tx.id}
                </AdminTableCell>
                <AdminTableCell className="font-semibold text-white">
                  {tx.customerEmail}
                </AdminTableCell>
                <AdminTableCell className="font-mono text-label-xs text-gray-400">
                  {tx.productId}
                </AdminTableCell>
                <AdminTableCell className="text-gray-300">
                  {tx.productName}
                </AdminTableCell>
                <AdminTableCell className="font-semibold text-white">
                  {tx.amount}
                </AdminTableCell>
                <AdminTableCell className="text-gray-400 text-label-xs">
                  {tx.date}
                </AdminTableCell>
                <AdminTableCell className="pr-6">
                  <AdminBadge
                    variant={
                      tx.status === "pending"
                        ? "pending"
                        : tx.status === "completed"
                        ? "success"
                        : "danger"
                    }
                  >
                    {tx.status === "pending"
                      ? "Pending"
                      : tx.status === "completed"
                      ? "Completed"
                      : "Failed"}
                  </AdminBadge>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
