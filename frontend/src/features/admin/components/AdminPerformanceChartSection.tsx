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

  return (
    <div className={className}>
      <AdminBarChart
        title="BEST PERFORMANCE PRODUCT"
        data={chartData}
        isEmpty={isEmpty}
        onAddProduct={onAddProduct}
        maxScale={900}
        yTicks={[900, 800, 600, 400, 200, 100, 0]}
        barColor="#FF5364"
      />
    </div>
  );
}

