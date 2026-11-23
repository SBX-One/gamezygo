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
  const [hasAvatarError, setHasAvatarError] = React.useState(false);

  const cleanAvatarSrc = React.useMemo(() => {
    if (!user.avatarUrl || hasAvatarError) return null;
    const lower = user.avatarUrl.toLowerCase();
    if (
      lower.includes("placehold.co") ||
      lower.includes("placeholder") ||
      lower.includes("dummyimage")
    ) {
      return null;
    }
    return user.avatarUrl;
  }, [user.avatarUrl, hasAvatarError]);

  const displayName = user.username || user.name || "User";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none",
        className
      )}
    >
      {/* Left: Avatar + Username + Email */}
      <div className="flex items-center gap-4">
        {cleanAvatarSrc ? (
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-deep-blue-700 shrink-0 bg-deep-blue-900 shadow-sm">
            <Image
              src={cleanAvatarSrc}
              alt={displayName}
              fill
              sizes="56px"
              unoptimized
              onError={() => setHasAvatarError(true)}
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center border border-deep-blue-700 bg-gradient-to-br from-indigo-600 to-deep-blue-900 text-white font-bold text-lg select-none shrink-0 shadow-inner">
            {initial}
          </div>
        )}

        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-normal leading-tight">
            {displayName}
          </h2>
          <span className="text-label-xs text-gray-400 mt-1">{user.email}</span>
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
            className="px-4 py-2 rounded-lg text-label-xs font-semibold border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Suspend
          </button>
          <button
            type="button"
            onClick={onBan}
            className="px-4 py-2 rounded-lg text-label-xs font-semibold border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Ban
          </button>
          <button
            type="button"
            onClick={onWipe}
            className="px-4 py-2 rounded-lg text-label-xs font-semibold border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Wipe
          </button>
        </div>
      </div>
    </div>
  );
}
