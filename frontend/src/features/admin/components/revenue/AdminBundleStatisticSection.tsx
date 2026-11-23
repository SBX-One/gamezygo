import * as React from "react";
import { AdminCard } from "@/components/admin";
import {
  MOCK_BUNDLE_STATISTIC,
  EMPTY_BUNDLE_STATISTIC,
} from "../../data/admin-revenue-mock-data";
import type { BundleStatisticData } from "../../types/admin-revenue.types";

export interface AdminBundleStatisticSectionProps {
  isEmpty?: boolean;
  data?: BundleStatisticData;
  className?: string;
  isLoading?: boolean;
}

const ArrowUpBigIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 shrink-0"
    {...props}
  >
    <path d="M4.20853 10.733C4.07728 10.878 4.00789 11.0686 4.01517 11.2641C4.02245 11.4596 4.10581 11.6445 4.24748 11.7794C4.38916 11.9143 4.57792 11.9885 4.77353 11.9862C4.96913 11.9839 5.15609 11.9052 5.29453 11.767L11.2485 5.516V20.25C11.2485 20.4489 11.3275 20.6397 11.4682 20.7803C11.6089 20.921 11.7996 21 11.9985 21C12.1974 21 12.3882 20.921 12.5289 20.7803C12.6695 20.6397 12.7485 20.4489 12.7485 20.25V5.516L18.7035 11.767C18.7714 11.8384 18.8527 11.8957 18.9427 11.9356C19.0328 11.9756 19.1298 11.9974 19.2283 11.9999C19.3268 12.0023 19.4248 11.9854 19.5167 11.95C19.6086 11.9146 19.6927 11.8614 19.764 11.7935C19.8354 11.7256 19.8927 11.6443 19.9327 11.5543C19.9726 11.4642 19.9945 11.3672 19.9969 11.2687C19.9994 11.1703 19.9824 11.0723 19.947 10.9803C19.9116 10.8884 19.8584 10.8044 19.7905 10.733L12.7235 3.313C12.5692 3.15092 12.365 3.04528 12.1435 3.013C12.0476 2.99566 11.9493 2.996 11.8535 3.014C11.6328 3.04671 11.4293 3.15231 11.2755 3.314L4.20853 10.733Z" />
  </svg>
);

export function AdminBundleStatisticSection({
  isEmpty = false,
  data,
  className,
  isLoading = false,
}: AdminBundleStatisticSectionProps) {
  const activeData = isEmpty
    ? EMPTY_BUNDLE_STATISTIC
    : data || MOCK_BUNDLE_STATISTIC;

  if (isLoading) {
    return (
      <AdminCard
        title="BUNDLE STATISTIC"
        className={className}
        bodyClassName="p-4 sm:p-6 select-none"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 1. Left Highlight Box Skeleton */}
          <div className="rounded-lg border border-deep-blue-700/60 p-4 sm:p-6 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <div className="w-28 sm:w-32 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-40 sm:w-48 h-8 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-deep-blue-700/40">
              <div className="space-y-1.5">
                <div className="w-20 h-3 rounded bg-white/10 animate-pulse" />
                <div className="w-24 sm:w-28 h-6 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="w-20 h-3 rounded bg-white/10 animate-pulse" />
                <div className="w-24 sm:w-28 h-6 rounded bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 2. Right Subs Metrics Rows Skeleton (sesuai struktur konten asli) */}
          <div className="flex flex-col divide-y divide-deep-blue-700/60 px-2 sm:px-4 justify-center">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`bundle-subs-skel-${idx}`}
                className="flex items-center justify-between py-5 gap-4"
              >
                <div className="w-36 sm:w-44 h-4 rounded bg-white/10 animate-pulse" />
                <div className="w-16 sm:w-20 h-4 rounded bg-white/10 animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard
      title="BUNDLE STATISTIC"
      className={className}
      bodyClassName="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* 1. Left Highlight Box (Gambar 4) */}
        <div className="rounded-lg  border border-deep-blue-700/60 p-6 flex flex-col justify-between gap-6">
          <div className="flex items-center gap-3 flex-wrap">
            {isEmpty ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-gray-400 inline-block rounded-full" />
                <span className="text-h2 sm:text-h3 font-semibold text-white">
                  0%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-green-500">
                <ArrowUpBigIcon />
                <span className="text-h2 sm:text-h3 font-semibold">
                  {activeData.percentageIncrease}%
                </span>
              </div>
            )}

            {isEmpty ? (
              <span className="text-body-sm  text-gray-400 uppercase">
                NAIK <span className="font-semibold text-white">IDR 0</span> DARI BULAN LALU
              </span>
            ) : (
              <span className="text-label-xs font-semibold text-gray-300 uppercase">
                {activeData.amountIncreaseText}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-deep-blue-700/40">
            <div>
              <div className="text-body-xs text-gray-400 uppercase mb-1">
                LAST MONTH :
              </div>
              <div className="text-h5 font-semibold text-white">
                {activeData.lastMonthAmount}
              </div>
            </div>
            <div>
              <div className="text-body-xs text-gray-400 uppercase mb-1">
                THIS MONTH :
              </div>
              <div className="text-h5 font-semibold text-white">
                {activeData.thisMonthAmount}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Right Subs Metrics Rows */}
        <div className="flex flex-col  divide-y divide-deep-blue-700/60 px-2 sm:px-4">
          <div className="flex items-center justify-between py-5">
            <span className="text-body-xs  text-gray-400 uppercase">
              TOTAL ACTIVE SUBS
            </span>
            <span className="text-body-sm font-semibold text-white">
              {activeData.totalActiveSubs}
            </span>
          </div>

          <div className="flex items-center justify-between py-5">
            <span className="text-body-xs  text-gray-400 uppercase">
              TOTAL SUBS LAST MONTH
            </span>
            <span className="text-body-sm font-semibold text-white">
              {activeData.totalSubsLastMonth}
            </span>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
