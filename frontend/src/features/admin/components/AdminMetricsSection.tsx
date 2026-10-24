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
}

export function AdminMetricsSection({
  isEmpty = false,
  heroStat,
  statCards,
  onTimeframeChange,
  className,
}: AdminMetricsSectionProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("today");

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

