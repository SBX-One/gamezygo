import * as React from "react";
import { cn } from "@/lib/utils";
import type { VoucherAnalyticsSummary } from "../../../types/admin-voucher-analytics.types";

export interface AdminVoucherAnalyticsOverviewProps {
  summary: VoucherAnalyticsSummary;
  className?: string;
}

const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export function AdminVoucherAnalyticsOverview({
  summary,
  className,
}: AdminVoucherAnalyticsOverviewProps) {
  const isZeroUsage = summary.totalUsage === 0;
  const showBadge = !isZeroUsage && Boolean(summary.discountPercentage);

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full select-none font-sans",
        className
      )}
    >
      {/* Left: Voucher Name and Optional Discount Percentage Badge (Matching Image 3 & Image 2) */}
      <div className="lg:col-span-6 flex flex-col justify-center py-2">
        <span className="text-[11px] sm:text-label-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
          VOUCHER NAME :
        </span>
        <div className="flex items-center gap-3.5 flex-wrap">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {summary.voucherCode}
          </h2>

          {showBadge && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-xs font-semibold bg-[#12281D] text-[#22C55E] border border-[#22C55E]/30 shadow-xs">
              <ArrowUpIcon className="w-3 h-3 text-[#22C55E]" />
              <span>{summary.discountPercentage}%</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Metric Cards (TOTAL USAGE & TOTAL BURN - Matching Image 3 when 0) */}
      <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: TOTAL USAGE */}
        <div className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="px-5 py-3 border-b border-deep-blue-700/80 bg-deep-blue-900/40">
            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              TOTAL USAGE
            </span>
          </div>
          <div className="px-5 py-5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {summary.totalUsage}
            </span>
            {!isZeroUsage && (
              <span className="text-base sm:text-lg font-medium text-gray-400">
                Times
              </span>
            )}
          </div>
        </div>

        {/* Card 2: TOTAL BURN */}
        <div className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="px-5 py-3 border-b border-deep-blue-700/80 bg-deep-blue-900/40">
            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              TOTAL BURN
            </span>
          </div>
          <div className="px-5 py-5 flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isZeroUsage ? "IDR 0" : summary.totalBurn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
