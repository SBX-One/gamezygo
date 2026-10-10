import * as React from "react";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  AdminBadge,
} from "@/components/admin";
import { MOCK_PRODUCT_ORDERS } from "../../data/admin-product-performance-mock-data";
import type { ProductOrderItem } from "../../types/admin-product-performance.types";

export interface AdminProductOrdersTableSectionProps {
  orders?: ProductOrderItem[];
  className?: string;
}

export function AdminProductOrdersTableSection({
  orders = MOCK_PRODUCT_ORDERS,
  className,
}: AdminProductOrdersTableSectionProps) {
  return (
    <div
      className={`rounded-xl border border-deep-blue-700 bg-deep-blue-950 overflow-hidden ${
        className || ""
      }`}
    >
      <AdminTable>
        <AdminTableHeader className="bg-deep-blue-900/40">
          <tr>
            <AdminTableHead className="pl-6">Order ID</AdminTableHead>
            <AdminTableHead>Customer Email</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead>Price</AdminTableHead>
            <AdminTableHead className="pr-6">Date</AdminTableHead>
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {orders.map((item, idx) => (
            <AdminTableRow key={`${item.orderId}-${idx}`}>
              <AdminTableCell className="pl-6 font-mono text-xs text-gray-300">
                {item.orderId}
              </AdminTableCell>
              <AdminTableCell className="font-semibold text-white">
                {item.customerEmail}
              </AdminTableCell>
              <AdminTableCell>
                <AdminBadge
                  variant={
                    item.status === "pending"
                      ? "pending"
                      : item.status === "completed"
                      ? "success"
                      : "danger"
                  }
                >
                  {item.status === "pending"
                    ? "Pending"
                    : item.status === "completed"
                    ? "Completed"
                    : "Failed"}
                </AdminBadge>
              </AdminTableCell>
              <AdminTableCell className="font-semibold text-white">
                {item.price}
              </AdminTableCell>
              <AdminTableCell className="pr-6 text-gray-400 text-xs">
                {item.date}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
