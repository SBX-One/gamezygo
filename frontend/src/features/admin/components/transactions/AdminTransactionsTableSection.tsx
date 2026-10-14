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
  transactions?: TransactionItem[];
  className?: string;
}

export function AdminTransactionsTableSection({
  isEmpty = false,
  transactions = MOCK_TRANSACTIONS_LIST,
  className,
}: AdminTransactionsTableSectionProps) {
  const activeTransactions = isEmpty ? [] : transactions;

  return (
    <div
      className={`rounded-xl border border-deep-blue-700 bg-deep-blue-950 overflow-hidden ${
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
            <AdminTableHead>Trasactions</AdminTableHead>
            <AdminTableHead>Date</AdminTableHead>
            <AdminTableHead className="pr-6">Status</AdminTableHead>
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {isEmpty || activeTransactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 px-4 text-center">
                <AdminEmptyState category="Recent Transactions" />
              </td>
            </tr>
          ) : (
            activeTransactions.map((tx, idx) => (
              <AdminTableRow key={`${tx.id}-${idx}`}>
                <AdminTableCell className="pl-6 font-mono text-xs text-gray-300">
                  {tx.id}
                </AdminTableCell>
                <AdminTableCell className="font-semibold text-white">
                  {tx.customerEmail}
                </AdminTableCell>
                <AdminTableCell className="font-mono text-xs text-gray-400">
                  {tx.productId}
                </AdminTableCell>
                <AdminTableCell className="text-gray-300">
                  {tx.productName}
                </AdminTableCell>
                <AdminTableCell className="font-semibold text-white">
                  {tx.amount}
                </AdminTableCell>
                <AdminTableCell className="text-gray-400 text-xs">
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
