import * as React from "react";
import { cn } from "@/lib/utils";

import { formatPoints } from "@/utils/formatters";

export interface UserRankProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Posisi peringkat (misal: 1 atau '#1') */
  rank: number | string;
  /** Nama pengguna / display name */
  name: React.ReactNode;
  /** Jumlah poin (misal: 999 atau '999 pts') */
  points: number | string;
  /** Avatar opsional di sebelah nama */
  avatar?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

export function UserRank({
  rank,
  name,
  points,
  avatar,
  className,
  ref,
  ...props
}: UserRankProps) {
  const formattedRank =
    typeof rank === "number" ? `#${rank}` : rank.startsWith("#") ? rank : `#${rank}`;

  const formattedPoints =
    typeof points === "number"
      ? formatPoints(points)
      : points.includes("pts")
      ? points
      : `${points} pts`;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-4 px-6 py-4 rounded-lg bg-deep-blue-900 border border-deep-blue-700/60  select-none w-full  transition-all duration-150 hover:border-neutral-500",
        className
      )}
      {...props}
    >
      {/* Left: Rank # + Avatar + Username */}
      <div className="flex items-center gap-6 min-w-0">
        <span className="text-gray-400 font-semibold text-h6 shrink-0">
          {formattedRank}
        </span>
        {avatar && <div className="shrink-0">{avatar}</div>}
        <span className="text-gray-50 font-semibold text-label-md tracking-tight truncate">
          {name}
        </span>
      </div>

      {/* Right: Points */}
      <span className="text-gray-50 font-semibold text-label-md  whitespace-nowrap shrink-0">
        {formattedPoints}
      </span>
    </div>
  );
}
