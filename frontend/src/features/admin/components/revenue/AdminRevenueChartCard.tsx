import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard, AdminEmptyState } from "@/components/admin";
import { MOCK_REVENUE_CHART_DATA } from "../../data/admin-revenue-mock-data";
import type { RevenueChartPoint } from "../../types/admin-revenue.types";

import { AdminRevenueDateRangePicker } from "./AdminRevenueDateRangePicker";

export interface AdminRevenueChartCardProps {
  isEmpty?: boolean;
  data?: RevenueChartPoint[];
  className?: string;
}

export function AdminRevenueChartCard({
  isEmpty = false,
  data = MOCK_REVENUE_CHART_DATA,
  className,
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

  // Exact 10 Y-Ticks matching Gambar 1 & Gambar 3
  const yTicks = [1300, 1200, 1100, 1000, 900, 800, 500, 200, 100, 0];

  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Header right slot: Interactive Date Range Calendar Picker (Gambar 1 & Gambar 2)
  const headerRight = (
    <AdminRevenueDateRangePicker
      onChangeRange={(_start, _end, _label) => {
        // Range updated callback hook
      }}
      onOpenChange={setIsDatePickerOpen}
    />
  );

  // High-precision smooth spline path matching Gambar 1 & Gambar 3
  const svgWidth = 700;
  const svgHeight = 350;

  const linePath =
    "M 0 350 C 30 310, 60 275, 85 265 C 115 250, 145 220, 180 220 C 220 220, 260 238, 295 238 C 335 238, 375 195, 410 175 C 445 155, 475 130, 510 130 C 550 130, 580 205, 615 210 C 640 215, 660 200, 680 200 C 690 200, 696 205, 700 208";
  const areaPath = `${linePath} L 700 350 L 0 350 Z`;

  // Interactive day points along the curve for hover / tap inspection
  const chartPoints = [
    { day: "Senin", revenue: 0, x: 0, y: 350 },
    { day: "Selasa", revenue: 600, x: 180, y: 220 },
    { day: "Rabu", revenue: 520, x: 295, y: 238 },
    { day: "Kamis", revenue: 850, x: 410, y: 175 },
    { day: "Jumat", revenue: 970, x: 510, y: 130 },
    { day: "Sabtu", revenue: 720, x: 615, y: 210 },
    { day: "Minggu", revenue: 750, x: 680, y: 200 },
  ];

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
              <div className="w-12 pr-3 flex flex-col justify-between text-right text-label-xs text-gray-400 font-medium select-none py-1 shrink-0 sticky left-0 z-20 bg-deep-blue-950">
                {yTicks.map((tick) => (
                  <div key={tick} className="leading-none">
                    {tick}
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
                      {chartPoints[hoveredIdx].revenue}
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
              <div className="w-12 shrink-0 sticky left-0 z-20 bg-deep-blue-950" />
              <div className="w-full flex items-center justify-between px-2">
                {data.map((item) => (
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
