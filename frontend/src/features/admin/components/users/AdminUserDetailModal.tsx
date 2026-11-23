import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AdminBadge } from "@/components/admin/AdminBadge";
import type { AdminUserItem, UserStatus } from "../../types/admin-user.types";

export interface AdminUserDetailModalProps {
  isOpen: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onUpdateStatus?: (userId: string, newStatus: UserStatus) => void;
}

export function AdminUserDetailModal({
  isOpen,
  user,
  onClose,
  onUpdateStatus,
}: AdminUserDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<UserStatus>("Pending");

  React.useEffect(() => {
    if (user) {
      setSelectedStatus(user.status);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    if (onUpdateStatus && selectedStatus !== user.status) {
      onUpdateStatus(user.id, selectedStatus);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container: Max rounded-lg, zero shadow, explicit responsive width */}
      <div className="relative w-[540px] max-w-[95vw] bg-deep-blue-950 border border-deep-blue-700 rounded-lg overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-deep-blue-700 bg-deep-blue-900/60">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-white">Detail Pengguna</h3>
            <span className="text-label-xs font-mono text-gray-400 bg-deep-blue-950 px-2 py-0.5 rounded border border-deep-blue-700">
              {user.customerId ?? user.id}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded"
            aria-label="Tutup modal"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-label-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Email Pengguna</span>
              <span className="font-bold text-white block text-sm">{user.email}</span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Nama</span>
              <span className="font-semibold text-white block text-sm">{user.name || "-"}</span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Metode Login</span>
              <span className="text-gray-200 block">{user.loginType}</span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Total Poin</span>
              <span className="font-bold text-amber-400 block text-sm">{user.points} pts</span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Paket Langganan</span>
              <span className="inline-flex items-center text-label-xs font-medium px-2.5 py-0.5 rounded-full bg-deep-blue-900 border border-deep-blue-700 text-gray-300">
                {user.subscription}
              </span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Tanggal Bergabung</span>
              <span className="text-gray-300 block">{user.joinDate}</span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Login Terakhir</span>
              <span className="text-gray-300 block">{user.lastLogin}</span>
            </div>

            <div className="bg-deep-blue-900/40 p-3 rounded-lg border border-deep-blue-700/60">
              <span className="text-gray-400 block mb-1">Status Saat Ini</span>
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
            </div>
          </div>

          {/* Change Status Selector */}
          <div className="pt-2 border-t border-deep-blue-700/60">
            <label className="block text-gray-300 font-medium mb-2">
              Ubah Status Pengguna
            </label>
            <div className="flex gap-2">
              {(["Pending", "Active", "Suspended"] as UserStatus[]).map((st) => (
                <Button
                  key={st}
                  type="button"
                  variant={selectedStatus === st ? "active" : "inactive"}
                  size="xs"
                  onClick={() => setSelectedStatus(st)}
                  className="flex-1 justify-center"
                >
                  {st}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-deep-blue-700 bg-deep-blue-900/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-lg text-gray-400 hover:text-white"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="rounded-lg"
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
