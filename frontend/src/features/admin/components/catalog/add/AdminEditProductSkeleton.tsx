import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminEditProductSkeletonProps {
  showPreOrder?: boolean;
  className?: string;
}

export function AdminEditProductSkeleton({
  showPreOrder = false,
  className,
}: AdminEditProductSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-8 w-full select-none pb-8", className)}>
      {/* ========================================================
          SECTION 1: MEDIA & BASIC INFO SKELETON
         ======================================================== */}
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 w-full">
        {/* Media Upload Box Placeholder */}
        <div className="w-full lg:w-1/5 shrink-0 flex justify-center lg:justify-start">
          <div className="w-full max-w-[280px] h-[340px] rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 flex flex-col items-center justify-center p-6 gap-3 animate-pulse">
            <div className="w-16 h-16 rounded-xl bg-white/10" />
            <div className="w-28 h-4 rounded bg-white/10" />
            <div className="w-20 h-3 rounded bg-white/5" />
          </div>
        </div>

        {/* Basic Info Fields Placeholder */}
        <div className="w-full lg:w-3/5 flex-1 flex flex-col gap-5">
          {/* Row 1: Nama Produk */}
          <div className="flex flex-col gap-2">
            <div className="w-24 h-3.5 rounded bg-white/10 animate-pulse" />
            <div className="w-full h-11 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
          </div>

          {/* Row 2: Harga Akhir & Harga Awal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-2">
              <div className="w-24 h-3.5 rounded bg-white/10 animate-pulse" />
              <div className="w-full h-11 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-24 h-3.5 rounded bg-white/10 animate-pulse" />
              <div className="w-full h-11 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
            </div>
          </div>

          {/* Row 3: Pre-order Switch (Optional) */}
          {showPreOrder && (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-11 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
            </div>
          )}

          {/* Row 4: Genre Chips List */}
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="w-16 h-3 rounded bg-white/10 animate-pulse" />
            <div className="flex flex-wrap items-center gap-2">
              {[70, 85, 60, 95, 75, 80, 65, 90].map((width, idx) => (
                <div
                  key={`genre-skel-${idx}`}
                  style={{ width: `${width}px` }}
                  className="h-8 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: LAUNCHER & PROMOTION SECTION SKELETON
         ======================================================== */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 w-full items-start">
          {/* Launcher Buttons */}
          <div className="flex flex-col gap-2.5 shrink-0">
            <div className="w-20 h-3 rounded bg-white/10 animate-pulse" />
            <div className="flex items-center gap-2.5">
              {[80, 95, 65, 75].map((w, idx) => (
                <div
                  key={`launcher-skel-${idx}`}
                  style={{ width: `${w}px` }}
                  className="h-9 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Promotion Section Dropdown */}
          <div className="flex flex-col gap-2.5 flex-1 w-full min-w-0">
            <div className="w-36 h-3 rounded bg-white/10 animate-pulse" />
            <div className="w-full h-10 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
          </div>
        </div>

        {/* URL Store Input Card */}
        <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 sm:p-6 flex flex-col gap-3 shadow-sm">
          <div className="w-32 h-3.5 rounded bg-white/10 animate-pulse" />
          <div className="w-full h-10 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
        </div>
      </div>

      {/* ========================================================
          SECTION 3: SHARED ACCOUNT CREDENTIALS SKELETON
         ======================================================== */}
      <div className="flex flex-col gap-3.5 w-full">
        <div className="w-48 h-6 rounded bg-white/10 animate-pulse" />

        <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          {/* Row 1: Username */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-36 h-5 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="w-16 h-8 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
          </div>

          <div className="border-t border-deep-blue-700/80 w-full" />

          {/* Row 2: Password */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-36 h-5 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="w-16 h-8 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 4: HARDWARE SPECIFICATIONS SKELETON
         ======================================================== */}
      <div className="flex flex-col gap-3.5 w-full">
        <div className="w-44 h-6 rounded bg-white/10 animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Minimum Specs Column */}
          <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden flex flex-col shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-700/80 bg-deep-blue-900/60">
              <div className="w-32 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-16 h-7 rounded-lg bg-white/10 animate-pulse" />
            </div>
            <div className="divide-y divide-deep-blue-700/80">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`min-spec-skel-${idx}`}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
                    <div className="w-48 h-4 rounded bg-white/10 animate-pulse" />
                  </div>
                  <div className="w-16 h-7 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Specs Column */}
          <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden flex flex-col shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-700/80 bg-deep-blue-900/60">
              <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-16 h-7 rounded-lg bg-white/10 animate-pulse" />
            </div>
            <div className="divide-y divide-deep-blue-700/80">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`rec-spec-skel-${idx}`}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
                    <div className="w-48 h-4 rounded bg-white/10 animate-pulse" />
                  </div>
                  <div className="w-16 h-7 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 5: INSTRUCTION TEMPLATE SKELETON
         ======================================================== */}
      <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden flex flex-col shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 border-b border-deep-blue-700/80 bg-deep-blue-900/60">
          <div className="flex flex-col gap-1.5">
            <div className="w-52 h-5 rounded bg-white/10 animate-pulse" />
            <div className="w-32 h-3.5 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-8 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
            <div className="w-36 h-8 rounded-lg bg-deep-blue-900/60 border border-deep-blue-700/60 animate-pulse" />
          </div>
        </div>

        {/* Steps Skeleton with Red Indicator Strip */}
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="border-l-2 border-[#DF3848]/40 pl-5 sm:pl-6 flex flex-col divide-y divide-deep-blue-700/60">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`step-skel-${idx}`}
                className="py-5 first:pt-0 last:pb-0 flex flex-col gap-2"
              >
                <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
                <div className="w-72 h-4.5 rounded bg-white/10 animate-pulse" />
                <div className="w-full max-w-[560px] h-3.5 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

