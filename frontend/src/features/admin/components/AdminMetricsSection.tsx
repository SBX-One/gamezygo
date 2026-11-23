import * as React from "react";
import { AdminHeroStatCard, AdminStatCard } from "@/components/admin";
import {
  MOCK_ADMIN_HERO_STAT,
  MOCK_ADMIN_STAT_CARDS,
  EMPTY_ADMIN_HERO_STAT,
  EMPTY_ADMIN_STAT_CARDS,
  ADMIN_TIMEFRAMES,
} from "../data/admin-mock-data";
import type { AdminMetricData } from "../types/admin.types";

export interface AdminMetricsSectionProps {
  isEmpty?: boolean;
  heroStat?: AdminMetricData;
  statCards?: AdminMetricData[];
  onTimeframeChange?: (timeframe: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function AdminMetricsSection({
  isEmpty = false,
  heroStat,
  statCards,
  onTimeframeChange,
  className,
  isLoading = false,
}: AdminMetricsSectionProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("today");

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        {/* Hero Card Skeleton */}
        <div className="rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-6 flex flex-col justify-between gap-6 shadow-lg select-none">
          <div className="flex items-center justify-between">
            <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
            <div className="w-24 h-8 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="w-64 h-9 rounded bg-white/10 animate-pulse" />
            <div className="w-48 h-4 rounded bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* 3 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`stat-skel-${idx}`}
              className="rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-5 flex flex-col justify-between h-[120px] shadow-lg"
            >
              <div className="w-28 h-4 rounded bg-white/10 animate-pulse" />
              <div className="w-36 h-7 rounded bg-white/10 animate-pulse" />
              <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeHero =
    heroStat || (isEmpty ? EMPTY_ADMIN_HERO_STAT : MOCK_ADMIN_HERO_STAT);
  const activeStats =
    statCards || (isEmpty ? EMPTY_ADMIN_STAT_CARDS : MOCK_ADMIN_STAT_CARDS);

  const handleTimeframeChange = (val: string) => {
    setSelectedTimeframe(val);
    onTimeframeChange?.(val);
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* 1. Large Hero Revenue Card - elevated z-20 so dropdown menu floats over stat cards below */}
      <div className="relative z-20 has-[[aria-expanded='true']]:z-40">
        <AdminHeroStatCard
          title={activeHero.title}
          value={activeHero.value}
          subtitle={activeHero.subtitle}
          badge={activeHero.badge}
          timeframes={ADMIN_TIMEFRAMES}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeChange}
        />
      </div>

      {/* 2. Three Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 has-[[aria-expanded='true']]:z-40 items-stretch">
        {activeStats.map((stat) => (
          <AdminStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}

