import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "./AdminCard";
import { AdminDropdown } from "./AdminDropdown";
import { Pill } from "@/components/ui/Pill";
import type { AdminTimeframeOption } from "@/features/admin/types/admin.types";

export interface AdminHeroStatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: {
    text: string;
    trend?: "up" | "down";
  };
  timeframes?: AdminTimeframeOption[];
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  ref?: React.Ref<HTMLDivElement>;
}

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

const TrendingDownIcon = (props: React.SVGProps<SVGSVGElement>) => (

  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export function AdminHeroStatCard({
  title,
  value,
  subtitle,
  badge,
  timeframes = [
    { label: "Hari Ini", value: "today" },
    { label: "Kemarin", value: "yesterday" },
    { label: "Minggu ini", value: "this_week" },
    { label: "Bulan ini", value: "this_month" },
    { label: "Tahun ini", value: "this_year" },
  ],
  selectedTimeframe = "today",
  onTimeframeChange,
  className,
  ref,
  ...props
}: AdminHeroStatCardProps) {
  const headerRight = (
    <AdminDropdown
      options={timeframes}
      selectedValue={selectedTimeframe}
      onSelect={onTimeframeChange}
    />
  );


  return (
    <AdminCard
      ref={ref}
      title={title}
      headerRight={headerRight}
      className={cn("w-full", className)}
      bodyClassName="flex flex-col gap-6 py-8 px-6"
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-h3 font-semibold text-gradient-primary w-fit">
          {value}
        </h2>

        {badge && (
          <Pill
            size="xs"
            variant={badge.trend === "down" ? "error" : "success"}
            leftIcon={
              badge.trend === "down" ? (
                <TrendingDownIcon className="w-3.5 h-3.5" />
              ) : (
                <ArrowUpIcon className="w-3.5 h-3.5" />
              )
            }
            className="h-[22px] px-2 py-0 text-xs font-semibold"
          >
            {badge.text}
          </Pill>
        )}
      </div>

      {subtitle && (
        <div className="text-body-sm text-gray-400 uppercase">
          {subtitle}
        </div>
      )}
    </AdminCard>
  );
}
