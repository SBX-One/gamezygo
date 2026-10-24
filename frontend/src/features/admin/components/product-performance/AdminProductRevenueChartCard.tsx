import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard, AdminEmptyState } from "@/components/admin";
import { AdminRevenueDateRangePicker } from "../revenue/AdminRevenueDateRangePicker";
import { MOCK_PRODUCT_REVENUE_CHART_DATA } from "../../data/admin-product-performance-mock-data";
import type { ProductRevenueChartPoint } from "../../types/admin-product-performance.types";

export interface AdminProductRevenueChartCardProps {
  isEmpty?: boolean;
  data?: ProductRevenueChartPoint[];
  className?: string;
  onDateRangeChange?: (start: Date | null, end: Date | null, label: string) => void;
}

export function AdminProductRevenueChartCard({
  isEmpty = false,
  data = MOCK_PRODUCT_REVENUE_CHART_DATA,
  className,
  onDateRangeChange,
}: AdminProductRevenueChartCardProps) {
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

  // Exact 8 Y-Ticks matching Gambar 1 & Gambar 2
  const yTicks = [1100, 1000, 900, 800, 500, 200, 100, 0];

  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Header right slot: Shared interactive Date Range Calendar Picker (exact match to Revenue)
  const headerRight = (
    <AdminRevenueDateRangePicker
      onChangeRange={(start, end, label) => {
        onDateRangeChange?.(start, end, label);
      }}
      onOpenChange={setIsDatePickerOpen}
    />
  );

  // SVG coordinate calculations for smooth spline
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 24;
  const paddingY = 16;

  // Piecewise interpolation matching the 8 Y-tick grid intervals
  const getYCoordinate = (revenue: number) => {
    if (revenue >= 1100) return paddingY;
    if (revenue <= 0) return svgHeight - paddingY;

    for (let i = 0; i < yTicks.length - 1; i++) {
      const high = yTicks[i];
      const low = yTicks[i + 1];
      if (revenue <= high && revenue >= low) {
        const t = (high - revenue) / (high - low);
        const frac = (i + t) / (yTicks.length - 1);
        return paddingY + frac * (svgHeight - paddingY * 2);
      }
    }
    return svgHeight - paddingY;
  };

  const points = data.map((item, idx) => {
    const x =
      paddingX +
      (idx / Math.max(1, data.length - 1)) * (svgWidth - paddingX * 2);
    const y = getYCoordinate(item.revenue);
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

  return (
    <AdminCard
      title="REVENUE CHART"
      headerRight={headerRight}
      className={cn("w-full", isDatePickerOpen && "z-50 relative", className)}
      bodyClassName={cn(
        "p-4 sm:p-6 flex flex-col justify-between gap-4",
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
          className="relative w-full flex flex-col justify-between gap-4 overflow-x-auto touch-pan-x"
        >
          {/* Inner content container with min-w-[540px] to preserve optimal aspect ratio on mobile screens */}
          <div className="min-w-[540px] flex flex-col justify-between gap-4">
            {/* Main Chart Graphic Row (Y-Axis + Plot Area) with explicit responsive height */}
            <div className="relative flex h-64 sm:h-72 lg:h-80">
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

                {/* SVG Area & Stroke Curve (preserveAspectRatio="none" only for vector paths) */}
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="productRevenueAreaGradient"
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
                      fill="url(#productRevenueAreaGradient)"
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
                </svg>

                {/* Vertical Dashed Line Indicator on Hover / Tap */}
                {hoveredIdx !== null && points[hoveredIdx] && (
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none border-l border-dashed border-[#FF5364]/60 z-10"
                    style={{
                      left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
                    }}
                  />
                )}

                {/* Data Point Dots rendered as pure HTML circles: NEVER stretched into ovals */}
                {points.map((pt, idx) => {
                  const isHovered = hoveredIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-150 z-20",
                        isHovered
                          ? "w-3.5 h-3.5 bg-white border-2 border-[#FF5364] shadow-[0_0_8px_rgba(255,83,100,0.85)] scale-110"
                          : "w-2 h-2 bg-[#FF5364] opacity-85"
                      )}
                      style={{
                        left: `${(pt.x / svgWidth) * 100}%`,
                        top: `${(pt.y / svgHeight) * 100}%`,
                      }}
                    />
                  );
                })}

                {/* Interactive Click / Tap / Hover Hitboxes for each day */}
                <div className="absolute inset-0 flex items-stretch z-20">
                  {points.map((pt, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      aria-label={`${pt.item.day}: ${pt.item.revenue}`}
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
                {hoveredIdx !== null && points[hoveredIdx] && (
                  <div
                    className="absolute z-30 px-2.5 py-1 rounded-md bg-deep-blue-900 border border-deep-blue-700 text-white text-label-xs font-semibold shadow-xl whitespace-nowrap pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2.5 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
                      top: `${(points[hoveredIdx].y / svgHeight) * 100}%`,
                    }}
                  >
                    <div className="text-[#FF5364] font-bold text-center">
                      {points[hoveredIdx].item.revenue}
                    </div>
                    <div className="text-gray-300 text-[10px] text-center">
                      {points[hoveredIdx].item.day}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* X-Axis Labels Row */}
            <div className="flex items-center pt-3 border-t border-deep-blue-700/60 shrink-0">
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
