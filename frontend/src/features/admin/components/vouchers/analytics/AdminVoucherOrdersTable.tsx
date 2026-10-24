import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  FluentBookIcon,
} from "@/components/admin";
import type { VoucherOrderItem } from "../../../types/admin-voucher-analytics.types";

export interface AdminVoucherOrdersTableProps {
  orders?: VoucherOrderItem[];
  onAddProduct?: () => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function AdminVoucherOrdersTable({
  orders = [],
  onAddProduct,
  className,
}: AdminVoucherOrdersTableProps) {
  const isEmpty = orders.length === 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-deep-blue-700/80 bg-deep-blue-950 overflow-hidden shadow-xs select-none font-sans",
        className
      )}
    >
      <div className="overflow-x-auto">
        <AdminTable className="w-full text-left">
          <AdminTableHeader>
            <tr className="border-b border-deep-blue-700/80 bg-deep-blue-900/40">
              <AdminTableHead className="pl-6 py-4.5 text-label-xs font-semibold text-gray-300 tracking-wider">
                Order ID
              </AdminTableHead>
              <AdminTableHead className="py-4.5 text-label-xs font-semibold text-gray-300 tracking-wider">
                Customer Email
              </AdminTableHead>
              <AdminTableHead className="py-4.5 text-label-xs font-semibold text-gray-300 tracking-wider">
                Status
              </AdminTableHead>
              <AdminTableHead className="py-4.5 text-label-xs font-semibold text-gray-300 tracking-wider">
                Price
              </AdminTableHead>
              <AdminTableHead className="pr-6 py-4.5 text-label-xs font-semibold text-gray-300 tracking-wider">
                Date
              </AdminTableHead>
            </tr>
          </AdminTableHeader>

          <AdminTableBody>
            {isEmpty ? (
              /* Empty State Row spanning 5 columns (Matching Image 4) */
              <tr className="border-b-0">
                <td colSpan={5} className="py-16 sm:py-20 px-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                      <FluentBookIcon className="w-7 h-7 text-slate-200" />
                    </div>

                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                      Tidak ada Riwayat
                    </h4>

                    <p className="text-label-xs sm:text-sm text-slate-400 font-normal mb-5">
                      Tidak ditemukan riwayat untuk kategori Product List.
                    </p>

                    {/* Action Button: + Tambah Produk (Matching Image 4) */}
                    <Link
                      href="/admin/catalog"
                      onClick={onAddProduct}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-label-xs sm:text-sm font-medium text-white transition-all cursor-pointer shadow-xs"
                    >
                      <PlusIcon className="w-4 h-4 text-slate-300" />
                      <span>Tambah Produk</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((item, idx) => (
                <AdminTableRow
                  key={`${item.id}-${idx}`}
                  className="border-b border-deep-blue-700/40 hover:bg-white/2 transition-colors"
                >
                  {/* Order ID */}
                  <AdminTableCell className="pl-6 py-4.5 font-mono text-label-xs sm:text-sm text-gray-200">
                    {item.orderId}
                  </AdminTableCell>

                  {/* Customer Email */}
                  <AdminTableCell className="py-4.5 text-label-xs sm:text-sm text-gray-200 font-medium">
                    {item.customerEmail}
                  </AdminTableCell>

                  {/* Status Badge (Matching Image 5: Amber Pending badge) */}
                  <AdminTableCell className="py-4.5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-label-xs font-medium bg-[#312010] text-amber-500 border border-amber-500/35">
                      {item.status === "pending"
                        ? "Pending"
                        : item.status === "completed"
                        ? "Completed"
                        : "Failed"}
                    </span>
                  </AdminTableCell>

                  {/* Price */}
                  <AdminTableCell className="py-4.5 text-label-xs sm:text-sm font-semibold text-white">
                    {item.price}
                  </AdminTableCell>

                  {/* Date */}
                  <AdminTableCell className="pr-6 py-4.5 text-label-xs sm:text-sm text-gray-400 font-mono">
                    {item.date}
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
}
