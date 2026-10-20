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
import type { AdminUserDeviceLogin } from "../../types/admin-user.types";

export interface AdminUserDeviceLoginsCardProps {
  deviceLogins: AdminUserDeviceLogin[];
  className?: string;
}

export function AdminUserDeviceLoginsCard({
  deviceLogins,
  className,
}: AdminUserDeviceLoginsCardProps) {
  const count = deviceLogins.length;

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden select-none",
        className
      )}
    >
      {/* Card Header matching Image 3 */}
      <div className="px-6 py-4.5 border-b border-deep-blue-700/80 bg-deep-blue-950 flex items-center">
        <h3 className="text-xs uppercase tracking-wider">
          <span className="font-semibold text-gray-400">TOTAL DEVICE LOGIN : </span>
          <span className="font-bold text-white normal-case">{count} Devices</span>
        </h3>
      </div>

      {/* Table */}
      <AdminTable>
        <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
          <AdminTableRow className="hover:bg-transparent">
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              IP Address
            </AdminTableHead>
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              Device
            </AdminTableHead>
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              Browser
            </AdminTableHead>
            <AdminTableHead className="normal-case text-xs font-semibold text-gray-400 py-3.5 px-6">
              Time
            </AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>

        <AdminTableBody className="divide-y divide-deep-blue-700/60">
          {deviceLogins.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                Belum ada riwayat login perangkat.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            deviceLogins.map((dev) => (
              <AdminTableRow
                key={dev.id}
                className="border-b border-deep-blue-700/50 hover:bg-white/[0.02] transition-colors"
              >
                <AdminTableCell className="py-4 px-6 text-xs text-gray-300 font-mono">
                  {dev.ipAddress}
                </AdminTableCell>
                <AdminTableCell className="py-4 px-6 text-xs text-gray-300">
                  {dev.device}
                </AdminTableCell>
                <AdminTableCell className="py-4 px-6 text-xs text-gray-300">
                  {dev.browser}
                </AdminTableCell>
                <AdminTableCell className="py-4 px-6 text-xs text-gray-400">
                  {dev.time}
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
