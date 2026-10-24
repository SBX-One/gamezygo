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
import type { AdminUserItem } from "../../types/admin-user.types";

export interface AdminUsersTableProps {
  users: AdminUserItem[];
  onSelectUser?: (user: AdminUserItem) => void;
  className?: string;
}

export function AdminUsersTable({
  users,
  onSelectUser,
  className,
}: AdminUsersTableProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden",
        className
      )}
    >
      <AdminTable>
        <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
          <AdminTableRow className="hover:bg-transparent">
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Customer ID
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Customer Email
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Login Type
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Points
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Subscription
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Join Date
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Status
            </AdminTableHead>
            <AdminTableHead className="normal-case text-label-xs font-semibold text-gray-300 py-4 px-5">
              Last Login
            </AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>

        <AdminTableBody className="divide-y divide-deep-blue-700/60">
          {users.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={8} className="py-12 text-center text-gray-400">
                <p className="text-sm font-medium">Tidak ada data pengguna ditemukan.</p>
                <p className="text-label-xs text-gray-500 mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            users.map((user, idx) => (
              <AdminTableRow
                key={`${user.id}-${idx}`}
                onClick={() => onSelectUser?.(user)}
                className={cn(
                  "border-b border-deep-blue-700/50 hover:bg-white/[0.03] transition-colors",
                  onSelectUser && "cursor-pointer"
                )}
              >
                {/* 1. Customer ID */}
                <AdminTableCell className="py-4 px-5 text-label-xs text-gray-400 font-mono tracking-wider">
                  {user.id}
                </AdminTableCell>

                {/* 2. Customer Email */}
                <AdminTableCell className="py-4 px-5 text-label-xs font-bold text-white">
                  {user.email}
                </AdminTableCell>

                {/* 3. Login Type */}
                <AdminTableCell className="py-4 px-5 text-label-xs text-gray-300">
                  {user.loginType}
                </AdminTableCell>

                {/* 4. Points */}
                <AdminTableCell className="py-4 px-5 text-label-xs font-bold text-white">
                  {user.points} pts
                </AdminTableCell>

                {/* 5. Subscription */}
                <AdminTableCell className="py-4 px-5">
                  <span className="inline-flex items-center text-label-xs font-medium px-2.5 py-0.5 rounded-full bg-deep-blue-900 border border-deep-blue-700 text-gray-300">
                    {user.subscription}
                  </span>
                </AdminTableCell>

                {/* 6. Join Date */}
                <AdminTableCell className="py-4 px-5 text-label-xs text-gray-400">
                  {user.joinDate}
                </AdminTableCell>

                {/* 7. Status */}
                <AdminTableCell className="py-4 px-5">
                  <AdminBadge
                    variant={
                      user.status === "Pending"
                        ? "pending"
                        : user.status === "Active"
                        ? "success"
                        : "danger"
                    }
                  >
                    {user.status}
                  </AdminBadge>
                </AdminTableCell>

                {/* 8. Last Login */}
                <AdminTableCell className="py-4 px-5 text-label-xs text-gray-400">
                  {user.lastLogin}
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
