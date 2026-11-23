import * as React from "react";
import { cn } from "@/lib/utils";

export function AdminVoucherAnalyticsSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 w-full pb-12 select-none font-sans animate-pulse",
        className
      )}
    >
      {/* 1. Header Overview Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        {/* Left: Voucher Name */}
        <div className="lg:col-span-6 flex flex-col justify-center py-2 space-y-3">
          <div className="w-28 h-3.5 bg-white/10 rounded" />
          <div className="flex items-center gap-3">
            <div className="w-56 h-10 bg-white/10 rounded-lg" />
            <div className="w-16 h-7 bg-white/10 rounded-full" />
          </div>
        </div>

        {/* Right: Metric Cards (TOTAL USAGE & TOTAL BURN) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-hidden p-5 flex flex-col justify-between h-28">
            <div className="w-24 h-3 bg-white/10 rounded" />
            <div className="w-28 h-8 bg-white/10 rounded" />
          </div>
          <div className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-hidden p-5 flex flex-col justify-between h-28">
            <div className="w-24 h-3 bg-white/10 rounded" />
            <div className="w-36 h-8 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* 2. Target Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
        {/* Target Game Skeleton */}
        <div className="flex flex-col w-full space-y-3">
          <div className="w-28 h-3.5 bg-white/10 rounded" />
          <div className="w-full h-px bg-deep-blue-700/60 my-1" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skel-game-${idx}`}
                className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 p-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-16 rounded-lg bg-white/10 shrink-0" />
                  <div className="space-y-2">
                    <div className="w-36 h-4 bg-white/10 rounded" />
                    <div className="w-16 h-4 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col items-end">
                  <div className="w-16 h-3 bg-white/10 rounded" />
                  <div className="w-24 h-4 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target User Skeleton */}
        <div className="flex flex-col w-full space-y-3">
          <div className="w-28 h-3.5 bg-white/10 rounded" />
          <div className="w-full h-px bg-deep-blue-700/60 my-1" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skel-user-${idx}`}
                className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 px-4 py-3.5 flex items-center gap-3.5 h-20"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
                <div className="w-48 h-4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Revenue Chart Skeleton */}
      <div className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-deep-blue-700/80 bg-deep-blue-900/40">
          <div className="w-32 h-3.5 bg-white/10 rounded" />
          <div className="w-24 h-8 bg-white/10 rounded-lg" />
        </div>
        <div className="p-6 h-72 flex items-center justify-center">
          <div className="w-full h-full flex flex-col justify-between py-4">
            <div className="w-full h-px bg-deep-blue-700/30" />
            <div className="w-full h-px bg-deep-blue-700/30" />
            <div className="w-full h-px bg-deep-blue-700/30" />
            <div className="w-full h-px bg-deep-blue-700/30" />
          </div>
        </div>
      </div>

      {/* 4. Orders Table Skeleton */}
      <div className="rounded-lg border border-deep-blue-700/80 bg-deep-blue-950 overflow-hidden">
        <div className="border-b border-deep-blue-700/80 bg-deep-blue-900/40 px-6 py-4 flex items-center justify-between">
          <div className="w-20 h-3.5 bg-white/10 rounded" />
          <div className="w-28 h-3.5 bg-white/10 rounded" />
          <div className="w-16 h-3.5 bg-white/10 rounded" />
          <div className="w-20 h-3.5 bg-white/10 rounded" />
          <div className="w-16 h-3.5 bg-white/10 rounded" />
        </div>
        <div className="divide-y divide-deep-blue-700/40">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`skel-row-${idx}`}
              className="px-6 py-4.5 flex items-center justify-between"
            >
              <div className="w-28 h-4 bg-white/10 rounded font-mono" />
              <div className="w-36 h-4 bg-white/10 rounded" />
              <div className="w-16 h-5 bg-white/10 rounded-full" />
              <div className="w-24 h-4 bg-white/10 rounded" />
              <div className="w-20 h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

