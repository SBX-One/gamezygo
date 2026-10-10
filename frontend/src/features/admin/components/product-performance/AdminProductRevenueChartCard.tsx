import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "@/components/admin";
import { MOCK_PRODUCT_REVENUE_CHART_DATA } from "../../data/admin-product-performance-mock-data";
import type { ProductRevenueChartPoint } from "../../types/admin-product-performance.types";

export interface AdminProductRevenueChartCardProps {
  data?: ProductRevenueChartPoint[];
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

export function AdminProductRevenueChartCard({
  data = MOCK_PRODUCT_REVENUE_CHART_DATA,
  className,
}: AdminProductRevenueChartCardProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  // Exact Y-Ticks matching Gambar 2
  const yTicks = [1100, 1000, 900, 800, 500, 200, 100, 0];
  const maxScale = 1100;

  // Header right slot: Tanggal calendar button (Gambar 2)
  const headerRight = (
    <button
      type="button"
      className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#141622] hover:bg-[#1b1e2c] border border-white/10 text-sm font-semibold text-white transition-all shadow-sm cursor-pointer select-none"
    >
      <CalendarIcon className="w-4 h-4 text-gray-400" />
      <span>Tanggal</span>
    </button>
  );

  // SVG coordinate calculations for smooth spline
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 20;
  const paddingY = 15;

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

  return (
    <AdminCard
      title="REVENUE CHART"
      headerRight={headerRight}
      className={cn("w-full", className)}
      bodyClassName="p-4 sm:p-6 flex flex-col justify-between"
    >
      <div className="relative w-full">
        <div className="flex h-64 sm:h-72 lg:h-80">
          {/* Y-Axis Labels */}
          <div className="w-10 pr-2 flex flex-col justify-between text-right text-[11px] text-gray-400 font-medium select-none py-1 shrink-0">
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
                  className="drop-shadow-[0_2px_8px_rgba(255,83,100,0.4)]"
                />
              )}

              {/* Interactive Data Point Dots */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === idx ? 5 : 3}
                  className={cn(
                    "transition-all duration-200 cursor-pointer",
                    hoveredIdx === idx
                      ? "fill-white stroke-[#FF5364] stroke-2"
                      : "fill-[#FF5364] opacity-80"
                  )}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </svg>

            {/* Tooltip on Hover */}
            {hoveredIdx !== null && points[hoveredIdx] && (
              <div
                className="absolute z-20 px-2.5 py-1 rounded-md bg-deep-blue-900 border border-deep-blue-700 text-white text-xs font-semibold shadow-xl whitespace-nowrap pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
                  top: `${(points[hoveredIdx].y / svgHeight) * 100}%`,
                }}
              >
                <div className="text-[#FF5364] font-bold">
                  {points[hoveredIdx].item.revenue}
                </div>
                <div className="text-gray-300 text-[10px]">
                  {points[hoveredIdx].item.day}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* X-Axis Labels Row */}
        <div className="flex pl-10 pt-3 border-t border-deep-blue-700/60 mt-1">
          <div className="w-full flex items-center justify-between px-3">
            {data.map((item) => (
              <span
                key={item.day}
                className="text-xs text-gray-400 font-medium select-none"
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
