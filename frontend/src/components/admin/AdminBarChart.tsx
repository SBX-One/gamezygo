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
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close active tooltip when tapping/clicking outside (essential for mobile & tablet)
  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedIdx(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const handleItemClick = (
    idx: number,
    e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === idx ? null : idx));
  };

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

  // Dimensions: 280px total height with 48px top headroom so floating tooltips are never clipped
  const chartHeight = 280;
  const topHeadroom = 48;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;

  return (
    <AdminCard
      ref={ref}
      title={title}
      headerRight={headerRight}
      headerResponsive={true}
      className={cn("w-full", className)}
      bodyClassName="p-4 sm:p-6"
      {...props}
    >
      <div ref={containerRef} className="relative w-full overflow-x-auto">
        <div className="min-w-135">
          {/* Main Chart Area */}
          <div className="relative" style={{ height: `${chartHeight}px` }}>
            {/* Y-Axis Labels */}
            <div
              className="w-10 pr-2 absolute left-0 bottom-0 flex flex-col justify-between text-right text-label-xs text-gray-500 font-medium select-none"
              style={{ top: `${topHeadroom}px` }}
            >
              {yTicks.map((tick) => (
                <div key={tick} className="leading-none">
                  {tick}
                </div>
              ))}
            </div>

            {/* Gridlines & Bars Container */}
            <div className="relative ml-10 h-full">
              {/* Horizontal Gridlines */}
              <div
                className="absolute inset-x-0 bottom-0 flex flex-col justify-between pointer-events-none"
                style={{ top: `${topHeadroom}px` }}
              >
                {yTicks.map((tick) => (
                  <div
                    key={tick}
                    className="w-full border-b border-deep-blue-700"
                  />
                ))}
              </div>

              {/* Bars Row */}
              <div
                className="absolute inset-x-0 bottom-0 flex items-end justify-around px-4"
                style={{ top: `${topHeadroom}px` }}
              >
                {data.map((item, idx) => {
                  const percentage = Math.min(100, Math.max(0, (item.value / maxScale) * 100));
                  const isHovered = hoveredIdx === idx;
                  const isSelected = selectedIdx === idx;
                  const isActive = isHovered || isSelected;

                  return (
                    <div
                      key={item.id || idx}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.fullLabel || item.label}: ${item.value} poin`}
                      aria-expanded={isActive}
                      onClick={(e) => handleItemClick(idx, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleItemClick(idx, e);
                        }
                      }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className="relative flex flex-col items-center justify-end h-full w-12 sm:w-14 cursor-pointer focus:outline-none group"
                    >
                      {/* Floating Tooltip displaying Game Title & Points */}
                      {isActive && (
                        <div
                          role="tooltip"
                          className="absolute left-1/2 -translate-x-1/2 z-30 px-3 py-2 rounded-lg bg-deep-blue-900/95 backdrop-blur-md border border-deep-blue-700 text-white shadow-2xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center gap-1 min-w-max select-none"
                          style={{
                            bottom: `calc(${percentage}% + 10px)`,
                          }}
                        >
                          {/* Game Name */}
                          <span className="text-label-xs font-semibold text-gray-100 drop-shadow-sm max-w-44 truncate sm:max-w-none">
                            {item.fullLabel || item.label}
                          </span>

                          {/* Points */}
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-[#FF5364] shadow-[0_0_6px_#FF5364]" />
                            <span>
                              Poin:{" "}
                              <strong className="text-[#FF5364] font-bold text-label-xs tracking-wide">
                                {item.value.toLocaleString()}
                              </strong>
                            </span>
                          </div>

                          {/* Downward triangle caret pointing directly to the bar */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-deep-blue-700" />
                        </div>
                      )}

                      {/* Bar Pillar */}
                      <div
                        className={cn(
                          "w-8 sm:w-10 rounded-t-sm transition-all duration-200 cursor-pointer shadow-sm",
                          isActive
                            ? "brightness-125 shadow-[0_0_16px_rgba(255,83,100,0.65)] ring-1 ring-white/50"
                            : "hover:brightness-110"
                        )}
                        style={{
                          height: `${percentage}%`,
                          backgroundColor: barColor,
                          opacity: activeIdx !== null && !isActive ? 0.5 : 1,
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
              {data.map((item, idx) => {
                const isActive = activeIdx === idx;

                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={(e) => handleItemClick(idx, e)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="w-12 sm:w-14 text-center cursor-pointer group/label focus:outline-none"
                    title={item.fullLabel || item.label}
                    aria-label={`Pilih ${item.fullLabel || item.label}`}
                  >
                    <span
                      className={cn(
                        "inline-block text-[11px] font-medium underline underline-offset-2 truncate max-w-full transition-colors",
                        isActive
                          ? "text-white font-semibold decoration-white"
                          : "text-gray-400 decoration-gray-600 hover:text-white hover:decoration-gray-300"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
