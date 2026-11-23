import * as React from "react";
import { cn } from "@/lib/utils";
import type { VoucherRevenueChartPoint } from "../../../types/admin-voucher-analytics.types";
import { AdminVoucherDateRangePicker } from "./AdminVoucherDateRangePicker";
import { FluentBookIcon } from "@/components/admin";

export interface AdminVoucherRevenueChartProps {
  data?: VoucherRevenueChartPoint[];
  onDateRangeChange?: (range: {
    preset?: string;
    startDay?: number;
    endDay?: number;
    startDate?: string;
    endDate?: string;
  }) => void;
  className?: string;
}

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function formatYTick(val: number): string {
  if (val >= 1_000_000) {
    const formatted = (val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1);
    return `${formatted}M`;
  }
  if (val >= 1_000) {
    const formatted = (val / 1_000).toFixed(val % 1_000 === 0 ? 0 : 1);
    return `${formatted}k`;
  }
  return String(val);
}

function formatChartCurrency(val: number): string {
  return `IDR ${Number(val || 0).toLocaleString("id-ID")}`;
}

export function AdminVoucherRevenueChart({
  data = [],
  onDateRangeChange,
  className,
}: AdminVoucherRevenueChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [selectedRangeLabel, setSelectedRangeLabel] = React.useState<string>("Tanggal");
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Dynamic scale calculation based on actual revenue data
  const maxVal = Math.max(...data.map((d) => d.revenue), 0);
  const maxScale = React.useMemo(() => {
    if (maxVal <= 0) return 1000;
    // Round up to clean multiple
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
    const ceiling = Math.ceil((maxVal * 1.15) / magnitude) * magnitude;
    return Math.max(ceiling, 1000);
  }, [maxVal]);

  const yTicks = React.useMemo(() => {
    if (maxVal <= 0) {
      return [1000, 800, 500, 200, 100, 0];
    }
    const step = maxScale / 5;
    return [
      Math.round(maxScale),
      Math.round(step * 4),
      Math.round(step * 3),
      Math.round(step * 2),
      Math.round(step * 1),
      0,
    ];
  }, [maxVal, maxScale]);

  // SVG coordinate calculations for smooth spline
  const svgWidth = 840;
  const svgHeight = 290;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((item, idx) => {
    const x =
      paddingX +
      (idx / Math.max(1, data.length - 1)) * (svgWidth - paddingX * 2);
    const normalizedVal = Math.max(0, Math.min(maxScale, item.revenue));
    const y =
      svgHeight -
      paddingY -
      (normalizedVal / maxScale) * (svgHeight - paddingY * 2);
    return { x, y, item };
  });

  // Build Catmull-Rom smooth curve SVG path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${
          points[0].x
        } ${svgHeight - paddingY} Z`
      : "";

  const isEmpty = data.length === 0;

  return (
    <div
      className={cn(
        "rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-visible shadow-xs select-none relative",
        isDatePickerOpen && "z-50",
        className
      )}
    >
      {/* 1. Header: REVENUE CHART + Tanggal Popover Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-deep-blue-700/80 bg-deep-blue-900/40 rounded-t-2xl relative">
        <h3 className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase">
          REVENUE CHART
        </h3>

        {/* Date Filter Trigger Button with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDatePickerOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-deep-blue-900 hover:bg-deep-blue-800 border border-deep-blue-700 text-label-xs sm:text-sm font-semibold text-white transition-all cursor-pointer shadow-xs"
          >
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>{selectedRangeLabel}</span>
          </button>

          {/* Date Range Picker Popover (Matching Image 2) */}
          <AdminVoucherDateRangePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onSelectRange={(preset, startDay, endDay) => {
              setSelectedRangeLabel(preset || "Tanggal");
              setIsDatePickerOpen(false);
              onDateRangeChange?.({
                preset,
                startDay,
                endDay,
              });
            }}
          />
        </div>
      </div>

      {/* 2. Chart Body or Empty State */}
      {isEmpty ? (
        <div className="py-16 sm:py-20 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 mb-4 shadow-inner">
            <FluentBookIcon className="w-7 h-7 text-slate-200" />
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
            Tidak ada Riwayat
          </h4>
          <p className="text-label-xs sm:text-sm text-slate-400 font-normal">
            Tidak ditemukan riwayat untuk kategori Revenue Chart.
          </p>
        </div>
      ) : (
        <div className="p-6 pt-7 pb-6 relative overflow-hidden rounded-b-2xl">
          <div className="relative flex">
            {/* Y-Axis Scale Ticks */}
            <div className="flex flex-col justify-between items-end pr-5 text-[11px] sm:text-label-xs font-medium text-gray-500 h-65 select-none shrink-0 w-14">
              {yTicks.map((val) => (
                <span key={val} className="leading-none font-mono">
                  {formatYTick(val)}
                </span>
              ))}
            </div>

            {/* Chart Plot Area with Grid Lines and SVG */}
            <div className="relative flex-1 h-65">
              {/* Horizontal Grid lines matching ticks */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yTicks.map((val) => (
                  <div
                    key={val}
                    className="w-full border-t border-deep-blue-700/35"
                  />
                ))}
              </div>

              {/* SVG Area Chart */}
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="voucherRevenueAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#DF3848" stopOpacity="0.28" />
                    <stop offset="50%" stopColor="#DF3848" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#DF3848" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gradient Area Fill */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill="url(#voucherRevenueAreaGradient)"
                    className="transition-all duration-300"
                  />
                )}

                {/* Stroke Smooth Curve Line (matching crimson stroke in Image 4) */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#DF3848"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                )}

                {/* Interactive Data Points on Line */}
                {points.map((pt, idx) => (
                  <g key={`${pt.item.day}-${idx}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredIdx === idx ? 5.5 : 3.5}
                      fill={hoveredIdx === idx ? "#FFFFFF" : "#DF3848"}
                      stroke={hoveredIdx === idx ? "#DF3848" : "#141622"}
                      strokeWidth={hoveredIdx === idx ? 2.5 : 1.5}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Box */}
              {hoveredIdx !== null && points[hoveredIdx] && (
                <div
                  className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full -top-2 bg-[#0F111A] border border-deep-blue-700/80 rounded-lg px-3 py-2 shadow-xl text-center"
                  style={{
                    left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
                    top: `${(points[hoveredIdx].y / svgHeight) * 100}%`,
                  }}
                >
                  <div className="text-[10px] text-gray-400 font-medium mb-0.5">
                    {points[hoveredIdx].item.day}
                  </div>
                  <div className="text-label-xs font-bold text-white whitespace-nowrap">
                    {formatChartCurrency(points[hoveredIdx].item.revenue)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between items-center pl-14 pr-4 mt-3 text-label-xs font-medium text-gray-400 select-none">
            {data.map((item, idx) => (
              <span
                key={`${item.day}-${idx}`}
                className={cn(
                  "transition-colors text-center w-14 truncate",
                  hoveredIdx === idx ? "text-white font-bold" : "text-gray-400"
                )}
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
