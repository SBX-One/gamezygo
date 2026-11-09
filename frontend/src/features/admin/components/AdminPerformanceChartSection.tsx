import * as React from "react";
import { AdminBarChart } from "@/components/admin";
import { MOCK_ADMIN_CHART_DATA } from "../data/admin-mock-data";
import type { AdminProductPerformance } from "../types/admin.types";

export interface AdminPerformanceChartSectionProps {
  isEmpty?: boolean;
  data?: AdminProductPerformance[];
  onAddProduct?: () => void;
  className?: string;
}

export function AdminPerformanceChartSection({
  isEmpty = false,
  data,
  onAddProduct,
  className,
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

