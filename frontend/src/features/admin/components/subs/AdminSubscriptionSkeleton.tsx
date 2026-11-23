import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminSubscriptionSkeletonProps {
  className?: string;
}

export function AdminSubscriptionSkeleton({ className }: AdminSubscriptionSkeletonProps) {
  return (
    <div className={cn("space-y-8 select-none pb-16", className)}>
      {/* ========================================================
          1. THREE SUBSCRIPTION PLAN CARDS SKELETON
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={`plan-skel-${idx}`}
            className="rounded-2xl bg-deep-blue-950 border border-deep-blue-700/80 p-6 flex flex-col justify-between gap-6 shadow-lg"
          >
            <div className="space-y-4">
              {/* Header: Title + Duration */}
              <div className="flex items-center justify-between">
                <div className="w-24 h-5 rounded bg-white/10 animate-pulse" />
                <div className="w-20 h-6 rounded-full bg-white/10 animate-pulse" />
              </div>

              {/* Price & Period */}
              <div className="flex items-baseline gap-2">
                <div className="w-36 h-8 rounded bg-white/10 animate-pulse" />
                <div className="w-16 h-4 rounded bg-white/5 animate-pulse" />
              </div>

              <div className="border-t border-deep-blue-700/60 pt-4 space-y-3">
                {/* Benefits */}
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse shrink-0" />
                  <div className="w-44 h-4 rounded bg-white/10 animate-pulse" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse shrink-0" />
                  <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="w-full h-10 rounded-lg bg-deep-blue-900 border border-deep-blue-700/80 animate-pulse mt-2" />
          </div>
        ))}
      </div>

      {/* ========================================================
          2. TOTAL LIST GAME CARD SKELETON
         ======================================================== */}
      <div className="rounded-2xl bg-deep-blue-950 border border-deep-blue-700/80 p-6 sm:p-8 space-y-6 shadow-lg">
        {/* Header: Stats & Edit Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-deep-blue-700/60">
          <div className="space-y-2">
            <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
            <div className="flex items-baseline gap-3">
              <div className="w-28 h-8 rounded bg-white/10 animate-pulse" />
              <div className="w-32 h-5 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="w-36 h-10 rounded-lg bg-deep-blue-900 border border-deep-blue-700/80 animate-pulse" />
        </div>

        {/* Game Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`game-skel-${idx}`}
              className="rounded-xl bg-deep-blue-900/60 border border-deep-blue-700/60 overflow-hidden flex flex-col gap-2 p-2 shadow-sm"
            >
              <div className="w-full aspect-[3/4] rounded-lg bg-white/10 animate-pulse" />
              <div className="w-3/4 h-3.5 rounded bg-white/10 animate-pulse mt-1" />
              <div className="w-1/2 h-3 rounded bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. SUBSCRIBERS TABLE SKELETON
         ======================================================== */}
      <div className="rounded-2xl bg-deep-blue-950 border border-deep-blue-700/80 shadow-lg overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-5 bg-deep-blue-900/80 border-b border-deep-blue-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-40 h-5 rounded bg-white/10 animate-pulse" />
            <div className="w-16 h-5 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* Table Rows Placeholder */}
        <div className="divide-y divide-deep-blue-700/60">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`sub-skel-${idx}`}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              <div className="w-16 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-44 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-28 h-4 rounded bg-white/10 animate-pulse hidden sm:block" />
              <div className="w-24 h-4 rounded bg-white/10 animate-pulse hidden md:block" />
              <div className="w-18 h-6 rounded-full bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

