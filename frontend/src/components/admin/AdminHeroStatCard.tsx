import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "./AdminCard";
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

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
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
    { label: "7 Hari Terakhir", value: "7d" },
    { label: "30 Hari Terakhir", value: "30d" },
    { label: "Bulan Ini", value: "month" },
    { label: "Tahun Ini", value: "year" },
  ],
  selectedTimeframe = "today",
  onTimeframeChange,
  className,
  ref,
  ...props
}: AdminHeroStatCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const activeLabel =
    timeframes.find((t) => t.value === selectedTimeframe)?.label || "Hari Ini";

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerRight = (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1E202B] border border-deep-blue-700 text-xs font-medium text-gray-200 hover:text-white hover:bg-[#252837] transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
      >
        <span>{activeLabel}</span>
        <ChevronDownIcon
          className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 rounded-lg bg-deep-blue-900 border border-deep-blue-700 py-1 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-100">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              type="button"
              onClick={() => {
                onTimeframeChange?.(tf.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between",
                selectedTimeframe === tf.value
                  ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <span>{tf.label}</span>
              {selectedTimeframe === tf.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminCard
      ref={ref}
      title={title}
      headerRight={headerRight}
      className={cn("w-full", className)}
      bodyClassName="flex flex-col gap-4 py-6"
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {value}
        </h2>

        {badge && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none",
              badge.trend === "down"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            )}
          >
            {badge.trend === "down" ? (
              <TrendingDownIcon className="w-3.5 h-3.5" />
            ) : (
              <TrendingUpIcon className="w-3.5 h-3.5" />
            )}
            <span>{badge.text}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
          {subtitle}
        </div>
      )}
    </AdminCard>
  );
}
