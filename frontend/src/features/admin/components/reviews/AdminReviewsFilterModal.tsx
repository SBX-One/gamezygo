import * as React from "react";
import { cn } from "@/lib/utils";
import type {
  AdminReviewFilterState,
  ReviewStatus,
} from "../../types/admin-review.types";

export interface AdminReviewsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdminReviewFilterState;
  onApply: (newFilters: AdminReviewFilterState) => void;
  onReset: () => void;
  minPrice?: number;
  maxPrice?: number;
  priceStep?: number;
  className?: string;
}

const StarOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.788 3.102C11.283 2.099 12.714 2.099 13.209 3.102L15.567 7.88L20.84 8.646C21.947 8.806 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.283 21.342C6.293 21.862 5.135 21.022 5.323 19.919L6.224 14.668L2.409 10.948C1.608 10.168 2.05 8.807 3.157 8.646L8.43 7.88L10.788 3.102Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.788 3.102C11.283 2.099 12.714 2.099 13.209 3.102L15.567 7.88L20.84 8.646C21.947 8.806 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.283 21.342C6.293 21.862 5.135 21.022 5.323 19.919L6.224 14.668L2.409 10.948C1.608 10.168 2.05 8.807 3.157 8.646L8.43 7.88L10.788 3.102Z"
    />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function formatRupiah(amount: number): string {
  if (amount <= 0) return "RP 0";
  return `RP ${amount.toLocaleString("id-ID")}`;
}

export function AdminReviewsFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  minPrice = 0,
  maxPrice = 200000,
  priceStep = 5000,
  className,
}: AdminReviewsFilterModalProps) {
  const [selectedStar, setSelectedStar] = React.useState<number | null>(
    filters.star
  );
  const [hoverStar, setHoverStar] = React.useState<number | null>(null);
  const [selectedStatuses, setSelectedStatuses] = React.useState<ReviewStatus[]>(
    filters.statuses
  );
  const [priceMin, setPriceMin] = React.useState(filters.priceRange[0]);
  const [priceMax, setPriceMax] = React.useState(filters.priceRange[1]);
  const [sortBy, setSortBy] = React.useState<"terbaru" | "name_asc">(
    filters.sortBy
  );

  React.useEffect(() => {
    if (isOpen) {
      setSelectedStar(filters.star);
      setSelectedStatuses(filters.statuses);
      setPriceMin(filters.priceRange[0]);
      setPriceMax(filters.priceRange[1]);
      setSortBy(filters.sortBy);
    }
  }, [isOpen, filters]);

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStarClick = (star: number) => {
    setSelectedStar((prev) => (prev === star ? null : star));
  };

  const toggleStatus = (status: ReviewStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Dual Slider drag handlers
  const handleMinPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const track = trackRef.current;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (moveEvent.clientX - rect.left) / rect.width)
      );
      const rawVal = minPrice + ratio * (maxPrice - minPrice);
      const steppedVal = Math.round(rawVal / priceStep) * priceStep;
      const clampedVal = Math.max(
        minPrice,
        Math.min(steppedVal, priceMax - priceStep)
      );
      setPriceMin(clampedVal);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        target.releasePointerCapture(upEvent.pointerId);
      } catch {}
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleMaxPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const track = trackRef.current;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (moveEvent.clientX - rect.left) / rect.width)
      );
      const rawVal = minPrice + ratio * (maxPrice - minPrice);
      const steppedVal = Math.round(rawVal / priceStep) * priceStep;
      const clampedVal = Math.min(
        maxPrice,
        Math.max(steppedVal, priceMin + priceStep)
      );
      setPriceMax(clampedVal);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        target.releasePointerCapture(upEvent.pointerId);
      } catch {}
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const leftPercent = Math.max(
    0,
    Math.min(100, ((priceMin - minPrice) / (maxPrice - minPrice)) * 100)
  );
  const rightPercent = Math.max(
    0,
    Math.min(100, ((maxPrice - priceMax) / (maxPrice - minPrice)) * 100)
  );
  const rightThumbPosPercent = Math.max(
    0,
    Math.min(100, ((priceMax - minPrice) / (maxPrice - minPrice)) * 100)
  );

  const handleResetClick = () => {
    setSelectedStar(null);
    setSelectedStatuses([]);
    setPriceMin(minPrice);
    setPriceMax(maxPrice);
    setSortBy("terbaru");
    onReset();
    onClose();
  };

  const handleApplyClick = () => {
    onApply({
      ...filters,
      star: selectedStar,
      statuses: selectedStatuses,
      priceRange: [priceMin, priceMax],
      sortBy,
    });
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-xl bg-deep-blue-950 border border-deep-blue-700/80 shadow-2xl p-5 sm:p-6 flex flex-col gap-5 select-none animate-in fade-in zoom-in-95 duration-150 text-white",
        className
      )}
    >
      {/* 1. Header: "Filter & Sort" + Close X Icon */}
      <div className="flex items-center justify-between pb-3.5 border-b border-deep-blue-700/80">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Filter & Sort
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Filter"
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 2. STAR Section (Matching Image 1 & Reusing Image 2 Star Buttons) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider block">
          STAR
        </label>
        <div
          className="grid grid-cols-5 gap-2 sm:gap-2.5"
          onMouseLeave={() => setHoverStar(null)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverStar ?? selectedStar ?? 0) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverStar(star)}
                className={cn(
                  "h-11 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 outline-none border",
                  isFilled
                    ? "bg-deep-blue-900 border-gray-400 text-white"
                    : "bg-deep-blue-900 border-deep-blue-700/60 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                )}
                aria-label={`Pilih rating ${star} bintang`}
              >
                {isFilled ? (
                  <StarFilledIcon className="w-5 h-5 fill-white text-white" />
                ) : (
                  <StarOutlineIcon className="w-5 h-5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STATUS Section (Checklist matching Image 1) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider block">
          STATUS
        </label>
        <div className="flex flex-col gap-3 pt-0.5">
          {(["Posted", "Draft", "Archive"] as ReviewStatus[]).map((status) => {
            const isChecked = selectedStatuses.includes(status);
            return (
              <div
                key={status}
                onClick={() => toggleStatus(status)}
                className="flex items-center gap-3 cursor-pointer select-none group"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded border transition-all flex items-center justify-center shrink-0",
                    isChecked
                      ? "border-[#DF3848] bg-[#DF3848]"
                      : "border-deep-blue-700 bg-transparent group-hover:border-gray-400"
                  )}
                >
                  {isChecked && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <span className="text-body-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRICE RANGE Section (Dual Slider matching Image 1) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider block">
          PRICE RANGE
        </label>
        <div className="flex items-center gap-3 w-full">
          {/* Min Price indicator */}
          <span className="text-body-sm font-semibold text-white shrink-0 min-w-12 text-left">
            {formatRupiah(priceMin)}
          </span>

          {/* Dual Slider Track */}
          <div
            ref={trackRef}
            className="relative flex-1 flex items-center h-6 cursor-pointer touch-none mx-2"
          >
            {/* Background Rail */}
            <div className="w-full h-1.5 rounded-full bg-deep-blue-900 border border-deep-blue-700/60" />

            {/* Red Active Range Bar */}
            <div
              className="absolute h-1.5 rounded-full bg-linear-to-r from-[#DF3848] to-[#BA343C] pointer-events-none"
              style={{
                left: `${leftPercent}%`,
                right: `${rightPercent}%`,
              }}
            />

            {/* Left Thumb Handle (Min Price) */}
            <div
              onPointerDown={handleMinPointerDown}
              className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-linear-to-r from-[#DF3848] to-[#BA343C] border-2 border-deep-blue-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-md"
              style={{ left: `${leftPercent}%` }}
              role="slider"
              aria-valuemin={minPrice}
              aria-valuemax={priceMax}
              aria-valuenow={priceMin}
              aria-label="Harga Minimum"
            />

            {/* Right Thumb Handle (Max Price) */}
            <div
              onPointerDown={handleMaxPointerDown}
              className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-linear-to-r from-[#DF3848] to-[#BA343C] border-2 border-deep-blue-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-md"
              style={{ left: `${rightThumbPosPercent}%` }}
              role="slider"
              aria-valuemin={priceMin}
              aria-valuemax={maxPrice}
              aria-valuenow={priceMax}
              aria-label="Harga Maksimum"
            />
          </div>

          {/* Max Price indicator */}
          <span className="text-body-sm font-semibold text-white shrink-0 min-w-20 text-right">
            {formatRupiah(priceMax)}
          </span>
        </div>
      </div>

      {/* 5. SORT BY Section (Matching Image 1) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider block">
          SORT BY
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setSortBy("terbaru")}
            className={cn(
              "h-10 rounded-lg border text-label-xs font-semibold transition-all cursor-pointer",
              sortBy === "terbaru"
                ? "bg-[#1E202B] border-gray-400 text-white"
                : "bg-deep-blue-900 border-deep-blue-700/60 text-gray-400 hover:text-white hover:border-gray-500 font-medium"
            )}
          >
            Terbaru
          </button>
          <button
            type="button"
            onClick={() => setSortBy("name_asc")}
            className={cn(
              "h-10 rounded-lg border text-label-xs font-semibold transition-all cursor-pointer",
              sortBy === "name_asc"
                ? "bg-[#1E202B] border-gray-400 text-white"
                : "bg-deep-blue-900 border-deep-blue-700/60 text-gray-400 hover:text-white hover:border-gray-500 font-medium"
            )}
          >
            Nama (A - Z)
          </button>
        </div>
      </div>

      {/* 6. Footer Buttons: [ Reset ]  [ Apply ] (Matching Image 1) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleResetClick}
          className="px-5 h-9 rounded-lg bg-deep-blue-900 hover:bg-deep-blue-800 text-gray-200 hover:text-white text-label-xs font-semibold transition-colors cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApplyClick}
          className="px-6 h-9 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-label-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
