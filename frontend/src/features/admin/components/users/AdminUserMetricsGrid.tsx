import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminUserItem } from "../../types/admin-user.types";

export interface AdminUserMetricsGridProps {
  user: AdminUserItem;
  onEditPoints?: () => void;
  onEditSubsDuration?: () => void;
  className?: string;
}

const EditPencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export function AdminUserMetricsGrid({
  user,
  onEditPoints,
  onEditSubsDuration,
  className,
}: AdminUserMetricsGridProps) {
  const lifetimeValueFormatted = `IDR ${(user.lifetimeValue ?? 0).toLocaleString("en-US")}`;
  const pointsFormatted = `${user.points ?? 0} pts`;
  const subsDurationFormatted = user.subsDuration || "-";

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 w-full select-none", className)}>
      {/* Card 1: LIFETIME VALUE */}
      <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 flex flex-col justify-between">
        <div className="border-b border-deep-blue-700/60 pb-3 mb-4">
          <span className="text-label-xs font-medium text-gray-400 uppercase tracking-wider">
            LIFETIME VALUE
          </span>
        </div>
        <div>
          <span className="text-2xl font-bold text-white tracking-tight">
            {lifetimeValueFormatted}
          </span>
        </div>
      </div>

      {/* Card 2: CURRENT POINTS */}
      <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 flex flex-col justify-between">
        <div className="border-b border-deep-blue-700/60 pb-3 mb-4">
          <span className="text-label-xs font-medium text-gray-400 uppercase tracking-wider">
            CURRENT POINTS
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-bold text-white tracking-tight">
            {pointsFormatted}
          </span>
          <button
            type="button"
            onClick={onEditPoints}
            aria-label="Ubah poin"
            className="p-1.5 rounded-lg border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <EditPencilIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card 3: SUBS DURATION */}
      <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 flex flex-col justify-between">
        <div className="border-b border-deep-blue-700/60 pb-3 mb-4">
          <span className="text-label-xs font-medium text-gray-400 uppercase tracking-wider">
            SUBS DURATION
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-bold text-white tracking-tight">
            {subsDurationFormatted}
          </span>
          <button
            type="button"
            onClick={onEditSubsDuration}
            aria-label="Ubah durasi langganan"
            className="p-1.5 rounded-lg border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <EditPencilIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
