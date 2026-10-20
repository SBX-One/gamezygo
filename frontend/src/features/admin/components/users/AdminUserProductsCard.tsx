import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import type { AdminUserProduct } from "../../types/admin-user.types";

export interface AdminUserProductsCardProps {
  products: AdminUserProduct[];
  className?: string;
}

export function AdminUserProductsCard({
  products,
  className,
}: AdminUserProductsCardProps) {
  const count = products.length;

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden select-none",
        className
      )}
    >
      {/* Card Header matching Image 4 */}
      <div className="px-6 py-4.5 border-b border-deep-blue-700/80 bg-deep-blue-950 flex items-center">
        <h3 className="text-xs uppercase tracking-wider">
          <span className="font-semibold text-gray-400">TOTAL PRODUCT : </span>
          <span className="font-bold text-white normal-case">{count} Games</span>
        </h3>
      </div>

      {/* Table */}
      <AdminTable>
        <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
          <AdminTableRow className="hover:bg-transparent">
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              Product Name
            </AdminTableHead>
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              Transaction ID
            </AdminTableHead>
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              Transaction Date
            </AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>

        <AdminTableBody className="divide-y divide-deep-blue-700/60">
          {products.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={3} className="py-8 text-center text-gray-400 text-xs">
                Belum ada produk yang dibeli oleh pengguna ini.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            products.map((prod) => (
              <AdminTableRow
                key={prod.id}
                className="border-b border-deep-blue-700/50 hover:bg-white/[0.02] transition-colors"
              >
                {/* Product Name with Thumbnail Icon */}
                <AdminTableCell className="py-4 px-6 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-5 h-5 rounded overflow-hidden shrink-0 bg-deep-blue-900 border border-deep-blue-700/60">
                      <Image
                        src={
                          prod.imageSrc ||
                          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg"
                        }
                        alt={prod.name}
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-white">{prod.name}</span>
                  </div>
                </AdminTableCell>

                {/* Transaction ID */}
                <AdminTableCell className="py-4 px-6 text-xs text-gray-400 font-mono">
                  {prod.transactionId}
                </AdminTableCell>

                {/* Transaction Date */}
                <AdminTableCell className="py-4 px-6 text-xs text-gray-400">
                  {prod.transactionDate}
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
