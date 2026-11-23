import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base glassmorphic skeleton shimmer block matching dark-mode Gamezygo theme.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg bg-white/5 border border-white/10",
        className
      )}
      {...props}
    />
  );
}

export interface ProductCardSkeletonProps {
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/**
 * Skeleton placeholder matching ProductCard vertical and horizontal layouts.
 */
export function ProductCardSkeleton({
  orientation = "vertical",
  className,
}: ProductCardSkeletonProps) {
  if (orientation === "horizontal") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "w-full rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-4 animate-pulse",
          className
        )}
      >
        <div className="w-24 sm:w-28 h-32 rounded-lg bg-white/10 shrink-0" />
        <div className="flex-1 space-y-3 min-w-0">
          <div className="h-5 w-3/4 rounded bg-white/10" />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-white/10" />
            <div className="h-5 w-14 rounded-full bg-white/10" />
          </div>
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-9 w-full rounded-lg bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden flex flex-col animate-pulse",
        className
      )}
    >
      <div className="w-full aspect-[3/4] bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-4/5 rounded bg-white/10" />
        <div className="flex gap-1.5">
          <div className="h-4 w-14 rounded-full bg-white/10" />
          <div className="h-4 w-12 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-5 w-12 rounded bg-white/10" />
        </div>
        <div className="h-9 w-full rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

export interface ListRowSkeletonProps {
  className?: string;
}

/**
 * Generic row skeleton for library, history, wishlist, and request lists.
 */
export function ListRowSkeleton({ className }: ListRowSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-4 animate-pulse",
        className
      )}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-14 h-14 rounded-lg bg-white/10 shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/10" />
        </div>
      </div>
      <div className="h-8 w-24 rounded-lg bg-white/10 shrink-0" />
    </div>
  );
}

