import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "./AdminCard";
import { AdminDropdown } from "./AdminDropdown";
import { Pill } from "@/components/ui/Pill";
import type { AdminTimeframeOption } from "@/features/admin/types/admin.types";

export interface AdminStatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  headerRight?: React.ReactNode;
  /** Option 1: Dropdown timeframe selector at header right */
  timeframes?: AdminTimeframeOption[];
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  /** Option 2: Info icon button at header right */
  hasInfoIcon?: boolean;
  infoTooltip?: string;
  onInfoClick?: () => void;
  /** Option 3: Trend Badge / Pill rendered alongside subtitle */
  badge?: {
    text: string;
    trend?: "up" | "down";
  };
  valueClassName?: string;
  subtitleClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}


const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5 text-gray-400 hover:text-white transition-colors"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3 h-3 shrink-0"
    {...props}
  >
    <path d="M4.20853 10.733C4.07728 10.878 4.00789 11.0686 4.01517 11.2641C4.02245 11.4596 4.10581 11.6445 4.24748 11.7794C4.38916 11.9143 4.57792 11.9885 4.77353 11.9862C4.96913 11.9839 5.15609 11.9052 5.29453 11.767L11.2485 5.516V20.25C11.2485 20.4489 11.3275 20.6397 11.4682 20.7803C11.6089 20.921 11.7996 21 11.9985 21C12.1974 21 12.3882 20.921 12.5289 20.7803C12.6695 20.6397 12.7485 20.4489 12.7485 20.25V5.516L18.7035 11.767C18.7714 11.8384 18.8527 11.8957 18.9427 11.9356C19.0328 11.9756 19.1298 11.9974 19.2283 11.9999C19.3268 12.0023 19.4248 11.9854 19.5167 11.95C19.6086 11.9146 19.6927 11.8614 19.764 11.7935C19.8354 11.7256 19.8927 11.6443 19.9327 11.5543C19.9726 11.4642 19.9945 11.3672 19.9969 11.2687C19.9994 11.1703 19.9824 11.0723 19.947 10.9803C19.9116 10.8884 19.8584 10.8044 19.7905 10.733L12.7235 3.313C12.5692 3.15092 12.365 3.04528 12.1435 3.013C12.0476 2.99566 11.9493 2.996 11.8535 3.014C11.6328 3.04671 11.4293 3.15231 11.2755 3.314L4.20853 10.733Z" />
  </svg>
);

const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3 h-3 shrink-0"
    {...props}
  >
    <path d="M19.7915 13.267C19.9227 13.122 19.9921 12.9314 19.9848 12.7359C19.9775 12.5404 19.8942 12.3555 19.7525 12.2206C19.6108 12.0857 19.4221 12.0115 19.2265 12.0138C19.0309 12.0161 18.8439 12.0948 18.7055 12.233L12.7515 18.484V3.75C12.7515 3.55109 12.6725 3.36032 12.5318 3.21967C12.3911 3.07902 12.2004 3 12.0015 3C11.8026 3 11.6118 3.07902 11.4711 3.21967C11.3305 3.36032 11.2515 3.55109 11.2515 3.75V18.484L5.29653 12.233C5.22864 12.1616 5.14732 12.1043 5.05731 12.0644C4.96729 12.0244 4.87023 12.0026 4.77174 12.0001C4.67325 11.9977 4.57523 12.0146 4.48332 12.05C4.3914 12.0854 4.30733 12.1386 4.236 12.2065C4.16467 12.2744 4.10734 12.3557 4.06737 12.4457C4.02741 12.5358 4.00552 12.6328 4.00307 12.7313C4.00063 12.8297 4.01767 12.9277 4.05309 13.0197C4.08851 13.1116 4.14168 13.1956 4.20953 13.267L11.2765 20.687C11.4308 20.8491 11.635 20.9547 11.8565 20.987C11.9524 21.0043 12.0507 21.004 12.1465 20.986C12.3672 20.9533 12.5707 20.8477 12.7245 20.686L19.7915 13.267Z" />
  </svg>
);

export function AdminStatCard({
  title,
  value,
  subtitle,
  headerRight,
  timeframes,
  selectedTimeframe = "today",
  onTimeframeChange,
  hasInfoIcon = false,
  infoTooltip,
  onInfoClick,
  badge,
  valueClassName,
  subtitleClassName,
  className,
  ref,
  ...props
}: AdminStatCardProps) {
  // Compute header right slot if options provided
  const computedHeaderRight =
    headerRight ||
    (timeframes ? (
      <AdminDropdown
        options={timeframes}
        selectedValue={selectedTimeframe}
        onSelect={onTimeframeChange}
      />
    ) : hasInfoIcon ? (

      <div className="group relative">
        <button
          type="button"
          onClick={onInfoClick}
          aria-label="Info keterangan"
          className="p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
        >
          <InfoIcon />
        </button>
        {infoTooltip && (
          <div className="absolute right-0 top-6 hidden group-hover:block z-30 px-2.5 py-1 bg-deep-blue-900 border border-deep-blue-700 rounded-md text-[11px] text-gray-200 shadow-xl whitespace-nowrap">
            {infoTooltip}
          </div>
        )}
      </div>
    ) : null);

  return (
    <AdminCard
      ref={ref}
      title={title}
      headerRight={computedHeaderRight}
      className={cn("h-full flex flex-col justify-between", className)}
      bodyClassName="flex-1 px-6 py-8 flex flex-col justify-between gap-6"
      {...props}
    >
      <div
        className={cn(
          "text-h3 font-semibold text-gradient-heading  w-fit",
          valueClassName
        )}
      >
        {value}
      </div>

      {(badge || subtitle) && (
        <div className="flex items-center gap-3 flex-wrap">
          {badge && (
            <Pill
              size="xs"
              variant={badge.trend === "down" ? "error" : "success"}
              leftIcon={
                badge.trend === "down" ? (
                  <ArrowDownIcon className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpIcon className="w-3.5 h-3.5" />
                )
              }
              className="h-[22px] px-2 py-0 text-xs font-semibold"
            >
              {badge.text}
            </Pill>
          )}

          {subtitle && (
            <span
              className={cn(
                "text-body-sm text-gray-400 uppercase",
                subtitleClassName
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </AdminCard>
  );
}
