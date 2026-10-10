import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "./AdminCard";
import { AdminEmptyState } from "./AdminEmptyState";

export interface AdminBarChartItem {
  id: string;
  label: string;
  fullLabel?: string;
  value: number;
}

export interface AdminBarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: string;
  data: AdminBarChartItem[];
  headerRight?: React.ReactNode;
  maxScale?: number;
  yTicks?: number[];
  barColor?: string;
  isEmpty?: boolean;
  onAddProduct?: () => void;
  emptyActionLabel?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function AdminBarChart({
  title = "BEST PERFORMANCE PRODUCT",
  data,
  headerRight,
  maxScale = 900,
  yTicks = [900, 800, 600, 400, 200, 100, 0],
  barColor = "#FF5364",
  isEmpty = false,
  onAddProduct,
  emptyActionLabel = "Tambah Produk",
  className,
  ref,
  ...props
}: AdminBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const isChartEmpty = isEmpty || !data || data.length === 0;

  if (isChartEmpty) {
    return (
      <AdminCard
        ref={ref}
        title={title}
        headerRight={headerRight}
        className={cn("w-full", className)}
        bodyClassName="py-16 sm:py-20 flex items-center justify-center"
        {...props}
      >
        <AdminEmptyState
          category="Best Performance Product"
          actionLabel={emptyActionLabel}
          actionIcon={<PlusIcon className="w-4 h-4 text-gray-300" />}
          onAction={onAddProduct}
        />
      </AdminCard>
    );
  }

  // SVG dimensions & padding
  const chartHeight = 260;

  return (
    <AdminCard
      ref={ref}
      title={title}
      headerRight={headerRight}
      className={cn("w-full", className)}
      bodyClassName="p-4 sm:p-6"
      {...props}
    >

      <div className="relative w-full overflow-x-auto">
        <div className="min-w-135">
          {/* Main Chart Area */}
          <div className="relative flex" style={{ height: `${chartHeight}px` }}>
            {/* Y-Axis Labels */}
            <div className="w-10 pr-2 flex flex-col justify-between text-right text-xs text-gray-500 font-medium select-none py-1">
              {yTicks.map((tick) => (
                <div key={tick} className="leading-none">
                  {tick}
                </div>
              ))}
            </div>

            {/* Gridlines & Bars Container */}
            <div className="relative flex-1 h-full">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1">
                {yTicks.map((tick) => (
                  <div
                    key={tick}
                    className="w-full border-b border-deep-blue-700"
                  />
                ))}
              </div>

              {/* Bars Row */}
              <div className="absolute inset-0 flex items-end justify-around px-4">
                {data.map((item, idx) => {
                  const percentage = Math.min(100, (item.value / maxScale) * 100);
                  const isHovered = hoveredIdx === idx;

                  return (
                    <div
                      key={item.id || idx}
                      className="relative flex flex-col items-center justify-end h-full w-12 sm:w-14 group"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Interactive Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-10 z-20 px-2.5 py-1 rounded-md bg-deep-blue-900 border border-deep-blue-700 text-white text-xs font-semibold shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                          <span className="text-[#FF5364] mr-1">{item.value}</span>
                          <span className="text-gray-300">
                            {item.fullLabel || item.label}
                          </span>
                        </div>
                      )}

                      {/* Bar Pillar */}
                      <div
                        className="w-8 sm:w-10 rounded-t-sm transition-all duration-300 cursor-pointer shadow-sm hover:brightness-110"
                        style={{
                          height: `${percentage}%`,
                          backgroundColor: barColor,
                          opacity: hoveredIdx !== null && !isHovered ? 0.7 : 1,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels Row */}
          <div className="flex pl-10 pt-3 border-t border-deep-blue-700">
            <div className="w-full flex items-center justify-around px-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="w-12 sm:w-14 text-center"
                  title={item.fullLabel || item.label}
                >
                  <span className="inline-block text-[11px] text-gray-400 font-medium underline underline-offset-2 hover:text-white cursor-pointer truncate max-w-full">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
