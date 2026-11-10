import * as React from "react";
import { AdminBarChart } from "@/components/admin";
import { MOCK_ADMIN_CHART_DATA } from "../data/admin-mock-data";
import type { AdminProductPerformance } from "../types/admin.types";

export interface AdminPerformanceChartSectionProps {
  isEmpty?: boolean;
  data?: AdminProductPerformance[];
  onAddProduct?: () => void;
  className?: string;
  isLoading?: boolean;
}

export function AdminPerformanceChartSection({
  isEmpty = false,
  data,
  onAddProduct,
  className,
  isLoading = false,
}: AdminPerformanceChartSectionProps) {
  const sourceData = isEmpty ? [] : data || MOCK_ADMIN_CHART_DATA;

  const chartData = sourceData.map((item) => ({
    id: item.id,
    label: item.name,
    fullLabel: item.fullName,
    value: item.revenue,
  }));

  const maxVal = Math.max(0, ...chartData.map((d) => d.value));

  const { dynamicMaxScale, dynamicYTicks } = React.useMemo(() => {
    if (maxVal <= 10) {
      return { dynamicMaxScale: 10, dynamicYTicks: [10, 8, 6, 4, 2, 0] };
    }
    if (maxVal <= 50) {
      return { dynamicMaxScale: 50, dynamicYTicks: [50, 40, 30, 20, 10, 0] };
    }
    if (maxVal <= 100) {
      return { dynamicMaxScale: 100, dynamicYTicks: [100, 80, 60, 40, 20, 0] };
    }
    return {
      dynamicMaxScale: Math.max(900, Math.ceil(maxVal / 100) * 100),
      dynamicYTicks: [900, 800, 600, 400, 200, 100, 0],
    };
  }, [maxVal]);

  if (isLoading) {
    return (
      <div
        className={`rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-6 shadow-lg select-none ${
          className || ""
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="w-56 h-5 rounded bg-white/10 animate-pulse" />
          <div className="w-20 h-6 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex items-end justify-between gap-4 h-64 pt-6 px-4">
          {[40, 75, 55, 90, 65, 80, 45, 95].map((h, i) => (
            <div
              key={`chart-skel-${i}`}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                style={{ height: `${h}%` }}
                className="w-full max-w-[48px] rounded-t-md bg-white/10 animate-pulse"
              />
              <div className="w-10 h-3 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <AdminBarChart
        title="BEST PERFORMANCE PRODUCT"
        data={chartData}
        isEmpty={isEmpty}
        onAddProduct={onAddProduct}
        maxScale={dynamicMaxScale}
        yTicks={dynamicYTicks}
        barColor="#FF5364"
      />
    </div>
  );
}

