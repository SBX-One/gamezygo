import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard, AdminDropdown, AdminEmptyState } from "@/components/admin";
import {
  MOCK_INCOME_SPREAD_PRODUCT_TYPE,
  MOCK_INCOME_SPREAD_PRODUCTS,
} from "../../data/admin-revenue-mock-data";
import { ADMIN_TIMEFRAMES } from "../../data/admin-mock-data";
import { Button } from "@/components/ui";

import type { IncomeSpreadSegment } from "../../types/admin-revenue.types";

export interface AdminIncomeSpreadCardProps {
  isEmpty?: boolean;
  productTypes?: IncomeSpreadSegment[];
  products?: IncomeSpreadSegment[];
  timeframe?: string;
  onTimeframeChange?: (val: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function AdminIncomeSpreadCard({
  isEmpty = false,
  productTypes,
  products,
  timeframe: externalTimeframe,
  onTimeframeChange,
  className,
  isLoading = false,
}: AdminIncomeSpreadCardProps) {
  const [activeTab, setActiveTab] = React.useState<"type" | "product">("type");
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [internalTimeframe, setInternalTimeframe] = React.useState("this_week");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedTimeframe = externalTimeframe ?? internalTimeframe;
  const handleTimeframeChange = onTimeframeChange ?? setInternalTimeframe;

  // Close selection on click/tap outside
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

  if (isLoading) {
    return (
      <div
        className={`rounded-xl border border-deep-blue-700/60 bg-deep-blue-900/60 p-6 shadow-lg select-none ${
          className || ""
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="w-40 h-5 rounded bg-white/10 animate-pulse" />
          <div className="w-24 h-8 rounded-lg bg-white/10 animate-pulse" />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6">
          <div className="w-40 h-40 rounded-full border-8 border-white/10 animate-pulse shrink-0" />
          <div className="space-y-3 w-full sm:w-48">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`spread-skel-${idx}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10 animate-pulse" />
                  <div className="w-20 h-4 rounded bg-white/10 animate-pulse" />
                </div>
                <div className="w-10 h-4 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const headerRight = (
    <AdminDropdown
      options={ADMIN_TIMEFRAMES}
      selectedValue={selectedTimeframe}
      onSelect={handleTimeframeChange}
      onOpenChange={setIsDropdownOpen}
    />
  );

  const currentSegments =
    activeTab === "type"
      ? (productTypes && productTypes.length > 0 ? productTypes : MOCK_INCOME_SPREAD_PRODUCT_TYPE)
      : (products && products.length > 0 ? products : MOCK_INCOME_SPREAD_PRODUCTS);

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const activeSlice = activeIdx !== null ? currentSegments[activeIdx] : null;

  // Generate mathematically exact circular SVG pie paths
  const totalPercentage = currentSegments.reduce((sum, s) => sum + s.percentage, 0);
  const cx = 100;
  const cy = 100;
  const radius = 86;

  let cumulativeAngle = -90; // Start at 12 o'clock (-90 degrees)

  const pieSlices = currentSegments.map((seg, idx) => {
    // If percentage is 0 or less, or no total percentage, nothing to render
    if (seg.percentage <= 0 || totalPercentage <= 0) {
      return {
        ...seg,
        path: "",
        idx,
      };
    }

    const angle = (seg.percentage / totalPercentage) * 360;

    // When a single slice takes 100% (or nearly 100%), an SVG arc from (x,y) to (x,y) collapses to 0.
    // In SVG spec, an arc with start == end renders nothing.
    // We must draw a full 360-degree circle using two 180-degree arcs:
    if (angle >= 359.99) {
      const path = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius} Z`;
      return {
        ...seg,
        path,
        idx,
      };
    }

    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;

    return {
      ...seg,
      path,
      idx,
    };
  });

  return (
    <AdminCard
      title="INCOME SPREAD"
      headerRight={headerRight}
      className={cn("w-full h-full", isDropdownOpen && "z-50 relative", className)}
      bodyClassName="p-4 sm:p-6 flex flex-col justify-between gap-6"
    >
      {/* 1. Graphic Area (Pie Chart vs Empty State Header) */}
      {isEmpty ? (
        <AdminEmptyState
          category="Income Spread"
          className="py-4"
        />
      ) : (
        <div ref={containerRef} className="flex flex-col items-center justify-center py-2 gap-3">
          {/* Active Detail Header / Hint */}
          <div className="h-6 flex items-center justify-center">
            {activeSlice ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deep-blue-900 border border-deep-blue-700 text-label-xs font-semibold text-white shadow-md animate-in fade-in duration-150">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeSlice.color }}
                />
                <span>{activeSlice.label}:</span>
                <span className="text-[#FF5364] font-bold">{activeSlice.percentage}%</span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-500 select-none">
                Hover atau klik bagian diagram untuk melihat detail
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-44 h-44 sm:w-48 sm:h-48 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] overflow-visible"
            >
              {/* Perfectly Formed Circular Slices */}
              {totalPercentage <= 0 ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  className="fill-deep-blue-900 stroke-deep-blue-700/60 stroke-2"
                />
              ) : (
                pieSlices.map((slice) => {
                  if (!slice.path) return null;
                  const isActive = activeIdx === slice.idx;

                  return (
                    <path
                      key={slice.id}
                      d={slice.path}
                      fill={slice.color}
                      role="button"
                      tabIndex={0}
                      aria-label={`${slice.label}: ${slice.percentage}%`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIdx((prev) => (prev === slice.idx ? null : slice.idx));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedIdx((prev) => (prev === slice.idx ? null : slice.idx));
                        }
                      }}
                      onMouseEnter={() => setHoveredIdx(slice.idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={cn(
                        "transition-all duration-200 cursor-pointer outline-none",
                        isActive
                          ? "brightness-125 stroke-white/50 stroke-1.5 filter drop-shadow-[0_0_12px_rgba(255,83,100,0.6)]"
                          : activeIdx !== null
                          ? "opacity-60 hover:opacity-95"
                          : "hover:brightness-110"
                      )}
                    />
                  );
                })
              )}
            </svg>
          </div>
        </div>
      )}

      {/* 2. Filter Switcher Pills */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={activeTab === "type" ? "primary" : "inactive"}
          size="xs"
          onClick={() => {
            setActiveTab("type");
            setSelectedIdx(null);
          }}
          className="px-4 py-1"
        >
          Product type
        </Button>
        <Button
          type="button"
          variant={activeTab === "product" ? "primary" : "inactive"}
          size="xs"
          onClick={() => {
            setActiveTab("product");
            setSelectedIdx(null);
          }}
          className="px-4 py-1"
        >
          Product
        </Button>
      </div>

      {/* 3. Breakdown Legend Cards */}
      <div className="space-y-2.5">
        {isEmpty ? (
          <>
            <div className="flex items-center justify-between px-4 py-3 rounded-lg text-gradient-heading  bg-deep-blue-900/40 border border-deep-blue-700/60">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm bg-[#FF5364]" />
                <span className="text-label-xs sm:text-body-sm font-semibold">
                  Paket
                </span>
              </div>
              <span className="text-label-xs sm:text-body-sm font-semibold ">
                -%
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-deep-blue-900/40 border text-gradient-heading  border-deep-blue-700/60">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-deep-blue-700/80 bg-transparent" />
                <span className="text-label-xs sm:text-body-sm font-semibold ">
                  Game Satuan
                </span>
              </div>
              <span className="text-label-xs sm:text-body-sm font-semibold ">
                -%
              </span>
            </div>
          </>
        ) : (
          currentSegments.map((seg, idx) => {
            const isActive = activeIdx === idx;

            return (
              <div
                key={seg.id}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx((prev) => (prev === idx ? null : idx));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedIdx((prev) => (prev === idx ? null : idx));
                  }
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg border transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-deep-blue-800/80 border-[#FF5364] shadow-sm"
                    : "bg-deep-blue-900/40 border-deep-blue-700/60 hover:bg-deep-blue-900/80 hover:border-deep-blue-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-3.5 h-3.5 rounded-full shrink-0 shadow-sm transition-transform",
                      isActive && "scale-125"
                    )}
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className={cn(
                    "text-label-xs sm:text-body-sm font-semibold transition-colors",
                    isActive ? "text-[#FF5364]" : "text-gradient-heading w-fit"
                  )}>
                    {seg.label}
                  </span>
                </div>
                <span className="text-label-xs sm:text-body-sm font-bold text-gradient-heading w-fit">
                  {seg.percentage}%
                </span>
              </div>
            );
          })
        )}
      </div>
    </AdminCard>
  );
}
