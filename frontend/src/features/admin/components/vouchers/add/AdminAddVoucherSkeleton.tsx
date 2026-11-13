import * as React from "react";
import { cn } from "@/lib/utils";

export function AdminAddVoucherSkeleton({
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
      {/* 1. Voucher Identities Skeleton */}
      <section className="space-y-4">
        <div className="w-44 h-6 bg-white/10 rounded-md" />

        {/* Row 1: Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="w-28 h-3 bg-white/10 rounded" />
            <div className="h-10 w-full bg-deep-blue-900 border border-deep-blue-700 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="w-28 h-3 bg-white/10 rounded" />
            <div className="h-10 w-full bg-deep-blue-900 border border-deep-blue-700 rounded-lg" />
          </div>
        </div>

        {/* Row 2: Discount Type & Value */}
        <div className="space-y-2">
          <div className="w-24 h-3 bg-white/10 rounded" />
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-28 h-10 bg-deep-blue-900 border border-deep-blue-700 rounded-lg" />
            <div className="w-24 h-10 bg-deep-blue-900 border border-deep-blue-700 rounded-lg" />
            <div className="w-44 h-10 bg-deep-blue-900 border border-deep-blue-700 rounded-lg" />
          </div>
        </div>
      </section>

      {/* 2. Target Section Skeleton (Target Game & User) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: Target Game */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-deep-blue-700/60">
            <div className="w-28 h-4 bg-white/10 rounded" />
            <div className="w-20 h-7 bg-white/10 rounded-lg" />
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skel-target-game-${idx}`}
                className="rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-14 rounded-md bg-white/10 shrink-0" />
                  <div className="space-y-2">
                    <div className="w-36 h-4 bg-white/10 rounded" />
                    <div className="w-14 h-4 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="space-y-1.5 flex flex-col items-end">
                    <div className="w-16 h-3 bg-white/10 rounded" />
                    <div className="w-20 h-4 bg-white/10 rounded" />
                  </div>
                  <div className="w-16 h-7 bg-white/10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: User */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-deep-blue-700/60">
            <div className="w-16 h-4 bg-white/10 rounded" />
            <div className="w-20 h-7 bg-white/10 rounded-lg" />
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skel-target-user-${idx}`}
                className="rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-3 flex items-center justify-between gap-3 h-[76px]"
              >
                <div className="space-y-1.5">
                  <div className="w-44 h-4 bg-white/10 rounded" />
                  <div className="w-16 h-3 bg-white/10 rounded" />
                </div>
                <div className="w-16 h-7 bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Voucher Rules Skeleton */}
      <section className="space-y-4">
        <div className="w-36 h-6 bg-white/10 rounded-md" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`skel-rule-${idx}`} className="space-y-2">
              <div className="w-32 h-3 bg-white/10 rounded" />
              <div className="h-10 w-full bg-deep-blue-900 border border-deep-blue-700 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Date Range Skeleton */}
      <section className="space-y-4">
        <div className="w-32 h-6 bg-white/10 rounded-md" />
        <div className="h-28 w-full bg-deep-blue-900 border border-deep-blue-700 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-36 h-8 bg-white/10 rounded-lg" />
            <div className="w-36 h-8 bg-white/10 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-7 bg-white/10 rounded-full" />
            <div className="w-20 h-7 bg-white/10 rounded-full" />
            <div className="w-20 h-7 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}

