import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminBadge } from "@/components/admin/AdminBadge";
import type { AdminUserItem } from "../../types/admin-user.types";

export interface AdminUserProfileCardProps {
  user: AdminUserItem;
  onSuspend?: () => void;
  onBan?: () => void;
  onWipe?: () => void;
  className?: string;
}

export function AdminUserProfileCard({
  user,
  onSuspend,
  onBan,
  onWipe,
  className,
}: AdminUserProfileCardProps) {
  const avatarSrc =
    user.avatarUrl ||
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg";

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none",
        className
      )}
    >
      {/* Left: Avatar + Username + Email */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-deep-blue-700 shrink-0 bg-deep-blue-900">
          <Image
            src={avatarSrc}
            alt={user.username || user.name || user.email}
            fill
            sizes="56px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-normal leading-tight">
            {user.username || user.name || "Cihuy67"}
          </h2>
          <span className="text-xs text-gray-400 mt-1">{user.email}</span>
        </div>
      </div>

      {/* Right: Status Badge (Top) + Action Buttons (Bottom) */}
      <div className="flex flex-col md:items-end justify-between gap-4">
        {/* Status Badge */}
        <div>
          <AdminBadge
            variant={
              user.status === "Active"
                ? "success"
                : user.status === "Pending"
                ? "pending"
                : "danger"
            }
          >
            {user.status}
          </AdminBadge>
        </div>

        {/* 3 Action Buttons: Suspend, Ban, Wipe */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSuspend}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Suspend
          </button>
          <button
            type="button"
            onClick={onBan}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Ban
          </button>
          <button
            type="button"
            onClick={onWipe}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Wipe
          </button>
        </div>
      </div>
    </div>
  );
}
