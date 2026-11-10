import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard, AdminEmptyState } from "@/components/admin";
import { MOCK_REVENUE_CHART_DATA } from "../../data/admin-revenue-mock-data";
import type { RevenueChartPoint } from "../../types/admin-revenue.types";
import { formatRupiah } from "@/utils/formatters";
import { AdminRevenueDateRangePicker } from "./AdminRevenueDateRangePicker";

export interface AdminRevenueChartCardProps {
  isEmpty?: boolean;
  data?: RevenueChartPoint[];
  onChangeRange?: (start: Date | null, end: Date | null, label: string) => void;
  className?: string;
  isLoading?: boolean;
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export function AdminRevenueChartCard({
  isEmpty = false,
  data = MOCK_REVENUE_CHART_DATA,
  onChangeRange,
  className,
  isLoading = false,
}: AdminRevenueChartCardProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close tooltip on touch / click outside
  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setHoveredIdx(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Header right slot: Interactive Date Range Calendar Picker (Gambar 1 & Gambar 2)
  const headerRight = (
    <AdminRevenueDateRangePicker
      onChangeRange={(start, end, label) => {
        onChangeRange?.(start, end, label);
      }}
      onOpenChange={setIsDatePickerOpen}
    />
  );

  const activeData = data && data.length > 0 ? data : MOCK_REVENUE_CHART_DATA;

  // Dynamically compute yTicks and chart scaling
  const maxVal = Math.max(...activeData.map((d) => d.revenue), 0);
  const ceilScale = maxVal > 0 ? Math.ceil(maxVal * 1.2 / 1000) * 1000 : 1000;

  const yTicks = React.useMemo(() => {
    const step = ceilScale / 5;
    return [
      ceilScale,
      Math.round(step * 4),
      Math.round(step * 3),
      Math.round(step * 2),
      Math.round(step * 1),
      0,
    ];
  }, [ceilScale]);

  const svgWidth = 700;
  const svgHeight = 350;

  const chartPoints = React.useMemo(() => {
    const n = activeData.length;
    return activeData.map((pt, i) => {
      const x = n > 1 ? (i / (n - 1)) * svgWidth : svgWidth / 2;
      const ratio = ceilScale > 0 ? pt.revenue / ceilScale : 0;
      // Reserve top 20px and bottom 10px padding inside plot
      const y = svgHeight - 10 - ratio * (svgHeight - 40);
      return {
        day: pt.day,
        revenue: pt.revenue,
        x,
        y,
      };
    });
  }, [activeData, ceilScale, svgWidth, svgHeight]);

  const linePath = React.useMemo(() => buildSmoothPath(chartPoints), [chartPoints]);
  const areaPath = React.useMemo(() => {
    if (!linePath || chartPoints.length === 0) return "";
    const lastX = chartPoints[chartPoints.length - 1].x;
    const firstX = chartPoints[0].x;
    return `${linePath} L ${lastX.toFixed(1)} ${svgHeight} L ${firstX.toFixed(1)} ${svgHeight} Z`;
  }, [linePath, chartPoints, svgHeight]);

  if (isLoading) {
    return (
      <div
        className={`rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-6 shadow-lg select-none ${
          className || ""
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1.5">
            <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
            <div className="w-48 h-7 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="w-32 h-8 rounded-lg bg-white/10 animate-pulse" />
        </div>
        <div className="h-64 rounded-lg bg-white/5 flex items-center justify-center p-4">
          <div className="w-full h-32 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <AdminCard
      title="REVENUE CHART"
      headerRight={headerRight}
      className={cn("w-full h-full", isDatePickerOpen && "z-50 relative", className)}
      bodyClassName={cn(
        "p-4 sm:p-6 flex flex-col justify-between flex-1 h-full overflow-hidden",
        isEmpty && "items-center justify-center min-h-[340px]"
      )}
    >
      {isEmpty ? (
        <AdminEmptyState
          category="Revenue Chart"
          className="py-8"
        />
      ) : (
        <div
          ref={containerRef}
          className="relative w-full flex-1 flex flex-col justify-between gap-4 h-full overflow-x-auto touch-pan-x"
        >
          {/* Inner content container with min-w-[540px] to preserve optimal aspect ratio on mobile screens */}
          <div className="min-w-[540px] flex-1 flex flex-col justify-between gap-4 h-full">
            {/* Main Chart Graphic Row (Y-Axis + Plot Area) */}
            <div className="relative flex-1 flex min-h-[260px] sm:min-h-[340px] lg:min-h-[380px]">
              {/* Y-Axis Labels (sticky on mobile horizontal scroll) */}
              <div className="w-16 pr-3 flex flex-col justify-between text-right text-label-xs text-gray-400 font-medium select-none py-1 shrink-0 sticky left-0 z-20 bg-deep-blue-950">
                {yTicks.map((tick) => (
                  <div key={tick} className="leading-none">
                    {tick >= 1000000
                      ? `${(tick / 1000000).toFixed(1)}M`
                      : tick >= 1000
                      ? `${(tick / 1000).toFixed(0)}k`
                      : tick}
                  </div>
                ))}
              </div>

              {/* Chart Graphic Area with Gridlines & Curve */}
              <div className="relative flex-1 h-full min-w-0">
                {/* Horizontal Gridlines matching yTicks */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1">
                  {yTicks.map((tick) => (
                    <div
                      key={tick}
                      className="w-full border-b border-deep-blue-700/60"
                    />
                  ))}
                </div>

                {/* SVG Area & Stroke Curve */}
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="revenueAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FF5364" stopOpacity="0.32" />
                      <stop offset="60%" stopColor="#FF5364" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#FF5364" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Fill Area */}
                  {areaPath && (
                    <path
                      d={areaPath}
                      fill="url(#revenueAreaGradient)"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Glowing Line Stroke */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#FF5364"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      className="drop-shadow-[0_2px_8px_rgba(255,83,100,0.45)]"
                    />
                  )}

                  {/* Active Vertical Guideline on Hover / Tap */}
                  {hoveredIdx !== null && chartPoints[hoveredIdx] && (
                    <line
                      x1={chartPoints[hoveredIdx].x}
                      y1={0}
                      x2={chartPoints[hoveredIdx].x}
                      y2={svgHeight}
                      stroke="#FF5364"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="opacity-50"
                    />
                  )}
                </svg>

                {/* Active Indicator Dot rendered as pure HTML circle to prevent SVG non-uniform stretching */}
                {hoveredIdx !== null && chartPoints[hoveredIdx] && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#FF5364] shadow-[0_0_8px_rgba(255,83,100,0.85)] pointer-events-none z-20 transition-transform scale-110"
                    style={{
                      left: `${(chartPoints[hoveredIdx].x / svgWidth) * 100}%`,
                      top: `${(chartPoints[hoveredIdx].y / svgHeight) * 100}%`,
                    }}
                  />
                )}

                {/* Interactive Click / Tap / Hover Hitboxes for each day */}
                <div className="absolute inset-0 flex items-stretch">
                  {chartPoints.map((pt, idx) => (
                    <div
                      key={pt.day}
                      role="button"
                      tabIndex={0}
                      aria-label={`${pt.day}: ${pt.revenue}`}
                      className="flex-1 h-full cursor-pointer relative outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredIdx((prev) => (prev === idx ? null : idx));
                      }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  ))}
                </div>

                {/* Tooltip on Hover / Tap */}
                {hoveredIdx !== null && chartPoints[hoveredIdx] && (
                  <div
                    className="absolute z-20 px-2.5 py-1 rounded-md bg-deep-blue-900 border border-deep-blue-700 text-white text-label-xs font-semibold shadow-xl whitespace-nowrap pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      left: `${(chartPoints[hoveredIdx].x / svgWidth) * 100}%`,
                      top: `${(chartPoints[hoveredIdx].y / svgHeight) * 100}%`,
                    }}
                  >
                    <div className="text-[#FF5364] font-bold">
                      {formatRupiah(chartPoints[hoveredIdx].revenue)}
                    </div>
                    <div className="text-gray-300 text-[10px]">
                      {chartPoints[hoveredIdx].day}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* X-Axis Labels Row */}
            <div className="flex items-center pt-3 border-t border-deep-blue-700/60 shrink-0">
              {/* Sticky Left Spacer to align exactly with Y-Axis */}
              <div className="w-16 shrink-0 sticky left-0 z-20 bg-deep-blue-950" />
              <div className="w-full flex items-center justify-between px-2">
                {activeData.map((item) => (
                  <span
                    key={item.day}
                    className="text-label-xs text-gray-400 font-medium select-none text-center"
                  >
                    {item.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
