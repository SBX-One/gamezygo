import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { AdminBadge } from "@/components/admin/AdminBadge";
import type { AdminUserTransaction } from "../../types/admin-user.types";

export interface AdminUserRecentTransactionsCardProps {
  transactions: AdminUserTransaction[];
  className?: string;
}

export function AdminUserRecentTransactionsCard({
  transactions,
  className,
}: AdminUserRecentTransactionsCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden select-none",
        className
      )}
    >
      {/* Card Header matching Image 5 */}
      <div className="px-6 py-4.5 border-b border-deep-blue-700/80 bg-deep-blue-950 flex items-center">
        <h3 className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
          RECENT TRANSACTIONS
        </h3>
      </div>

      {/* Table */}
      <AdminTable>
        <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
          <AdminTableRow className="hover:bg-transparent">
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-400 py-3.5 px-6">
              Transactions ID
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-400 py-3.5 px-6">
              Product Name
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-400 py-3.5 px-6">
              Payment Method
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-400 py-3.5 px-6">
              Trasactions
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-400 py-3.5 px-6">
              Date
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-400 py-3.5 px-6">
              Status
            </AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>

        <AdminTableBody className="divide-y divide-deep-blue-700/60">
          {transactions.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={6} className="py-8 text-center text-gray-400 text-label-xs">
                Belum ada transaksi terkini.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            transactions.map((tx) => (
              <AdminTableRow
                key={tx.id}
                className="border-b border-deep-blue-700/50 hover:bg-white/[0.02] transition-colors"
              >
                {/* Transactions ID */}
                <AdminTableCell className="py-4 px-6 text-label-xs text-gray-400 font-mono">
                  {tx.transactionId}
                </AdminTableCell>

                {/* Product Name */}
                <AdminTableCell className="py-4 px-6 text-label-xs text-gray-300 font-medium">
                  {tx.productName}
                </AdminTableCell>

                {/* Payment Method */}
                <AdminTableCell className="py-4 px-6 text-label-xs font-semibold text-gray-200">
                  {tx.paymentMethod}
                </AdminTableCell>

                {/* Transactions (Amount) */}
                <AdminTableCell className="py-4 px-6 text-label-xs font-bold text-white">
                  {tx.formattedAmount}
                </AdminTableCell>

                {/* Date */}
                <AdminTableCell className="py-4 px-6 text-label-xs text-gray-400">
                  {tx.date}
                </AdminTableCell>

                {/* Status Badge */}
                <AdminTableCell className="py-4 px-6 text-label-xs">
                  <AdminBadge
                    variant={
                      tx.status === "Pending"
                        ? "pending"
                        : tx.status === "Completed"
                        ? "success"
                        : "danger"
                    }
                  >
                    {tx.status}
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
