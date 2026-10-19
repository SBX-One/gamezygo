import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
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

const DismissIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Outline Star Icon matching Figma design system (review.tsx)
 */
const StarOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 shrink-0"
    {...props}
  >
    <path
      d="M10.788 3.102C11.283 2.099 12.714 2.099 13.209 3.102L15.567 7.88L20.84 8.646C21.947 8.806 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.283 21.342C6.293 21.862 5.135 21.022 5.323 19.919L6.224 14.668L2.409 10.948C1.608 10.168 2.05 8.807 3.157 8.646L8.43 7.88L10.788 3.102Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Filled Star Icon matching Figma design system (review.tsx)
 */
const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 fill-white text-white shrink-0"
    {...props}
  >
    <path d="M10.788 3.102C11.283 2.099 12.714 2.099 13.209 3.102L15.567 7.88L20.84 8.646C21.947 8.806 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.283 21.342C6.293 21.862 5.135 21.022 5.323 19.919L6.224 14.668L2.409 10.948C1.608 10.168 2.05 8.807 3.157 8.646L8.43 7.88L10.788 3.102Z" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="2.5 6 5 8.5 9.5 3.5" />
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
  // Star rating state: number of stars (1 to 5) or null for all
  const [selectedStar, setSelectedStar] = React.useState<number | null>(
    filters.star
  );
  // Hover preview state
  const [hoverStar, setHoverStar] = React.useState<number | null>(null);

  const [selectedStatuses, setSelectedStatuses] = React.useState<ReviewStatus[]>(
    filters.statuses
  );
  const [priceRange, setPriceRange] = React.useState<[number, number]>(
    filters.priceRange
  );
  const [sortBy, setSortBy] = React.useState<"terbaru" | "name_asc">(
    filters.sortBy || "terbaru"
  );

  const modalRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const currentMinPrice = priceRange[0] ?? minPrice;
  const currentMaxPrice = priceRange[1] ?? maxPrice;

  // Active star count to display: hover takes precedence over selected
  const activeStarCount = hoverStar ?? selectedStar ?? 0;

  // Sync state whenever modal opens or filters prop changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStar(filters.star);
      setHoverStar(null);
      setSelectedStatuses(filters.statuses);
      setPriceRange(filters.priceRange);
      setSortBy(filters.sortBy || "terbaru");
    }
  }, [isOpen, filters]);

  // Close on outside click or Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Click star handler: clicking star 3 sets 3 stars; clicking 3 again resets to null
  const handleStarClick = (starNum: number) => {
    if (selectedStar === starNum) {
      setSelectedStar(null);
      setHoverStar(null);
    } else {
      setSelectedStar(starNum);
    }
  };

  const toggleStatus = (status: ReviewStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Interactive Drag for Left Thumb (Min Price)
  const handleMinPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const track = (target.parentElement as HTMLElement) || trackRef.current;

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
        Math.min(steppedVal, currentMaxPrice - priceStep)
      );
      setPriceRange([clampedVal, currentMaxPrice]);
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

  // Interactive Drag for Right Thumb (Max Price)
  const handleMaxPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const track = (target.parentElement as HTMLElement) || trackRef.current;

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
        Math.max(steppedVal, currentMinPrice + priceStep)
      );
      setPriceRange([currentMinPrice, clampedVal]);
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

  // Calculations for dual slider percentages
  const totalRange = maxPrice - minPrice;
  const leftPercent = Math.max(
    0,
    Math.min(100, ((currentMinPrice - minPrice) / totalRange) * 100)
  );
  const rightPercent = Math.max(
    0,
    Math.min(100, ((maxPrice - currentMaxPrice) / totalRange) * 100)
  );
  const rightThumbPosPercent = 100 - rightPercent;

  const handleApply = () => {
    onApply({
      ...filters,
      star: selectedStar,
      statuses: selectedStatuses,
      priceRange: [currentMinPrice, currentMaxPrice],
      sortBy,
    });
    onClose();
  };

  const handleResetInternal = () => {
    setSelectedStar(null);
    setHoverStar(null);
    setSelectedStatuses(["Posted", "Draft", "Archive"]);
    setPriceRange([minPrice, maxPrice]);
    setSortBy("terbaru");
    onReset();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sort-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-end sm:pt-20 sm:pr-8 p-4 select-none font-sans"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Popover / Modal Box (Matching Image 2 & Admin Dashboard deep-blue-950 theme) */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-10 w-[440px] max-w-[95vw] bg-deep-blue-950 border border-deep-blue-700 rounded-lg p-6 sm:p-7 flex flex-col gap-6 animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Header: Title + Close Icon */}
        <div className="flex items-center justify-between">
          <h3
            id="filter-sort-modal-title"
            className="text-lg font-bold text-white tracking-tight"
          >
            Filter & Sort
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-lg"
            aria-label="Tutup Filter"
          >
            <DismissIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: STAR with Cumulative Selection */}
        <div className="flex flex-col gap-2.5">
          <span className="text-body-sm text-gray-400 font-normal uppercase tracking-wider">
            STAR
          </span>
          <div
            className="flex items-center gap-2.5"
            onMouseLeave={() => setHoverStar(null)}
          >
            {[1, 2, 3, 4, 5].map((starNum) => {
              // If user selects 3, stars 1, 2, and 3 are ALL filled!
              const isFilled = starNum <= activeStarCount;
              return (
                <button
                  key={starNum}
                  type="button"
                  onClick={() => handleStarClick(starNum)}
                  onMouseEnter={() => setHoverStar(starNum)}
                  className={cn(
                    "flex-1 h-11 rounded-lg border flex items-center justify-center transition-all cursor-pointer select-none",
                    isFilled
                      ? "bg-deep-blue-900 border-deep-blue-600 text-white"
                      : "bg-deep-blue-950 border border-deep-blue-700 text-gray-400 hover:border-deep-blue-600 hover:bg-deep-blue-900"
                  )}
                  title={`${starNum} Star`}
                  aria-label={`${starNum} Star`}
                >
                  {isFilled ? (
                    <StarFilledIcon />
                  ) : (
                    <StarOutlineIcon className="text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: STATUS */}
        <div className="flex flex-col gap-2.5">
          <span className="text-body-sm text-gray-400 font-normal uppercase tracking-wider">
            STATUS
          </span>
          <div className="flex flex-col gap-3">
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
                      "w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0",
                      isChecked
                        ? "border-[#FF5364] bg-[#FF5364]"
                        : "border-deep-blue-700 bg-deep-blue-950 group-hover:border-deep-blue-600"
                    )}
                  >
                    {isChecked && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-body-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: PRICE RANGE with Dual Slider */}
        <div className="flex flex-col gap-2.5">
          <span className="text-body-sm text-gray-400 font-normal uppercase tracking-wider">
            PRICE RANGE
          </span>
          <div className="flex items-center gap-3 w-full">
            {/* Min Price indicator */}
            <span className="text-body-sm font-semibold text-white shrink-0 min-w-14 text-left">
              {formatRupiah(currentMinPrice)}
            </span>

            {/* Interactive Dual Slider Scale & Range Track */}
            <div
              ref={trackRef}
              className="relative flex-1 flex items-center h-6 cursor-pointer touch-none mx-2"
            >
              {/* Track Rail background */}
              <div className="w-full h-1.5 rounded-full bg-deep-blue-900 border border-deep-blue-700/60" />

              {/* Active Range Highlight */}
              <div
                className="absolute h-1.5 rounded-full bg-linear-to-r from-[#DF3848] to-[#BA343C] pointer-events-none"
                style={{
                  left: `${leftPercent}%`,
                  right: `${rightPercent}%`,
                }}
              />

              {/* Left Thumb Handle (Drag Min Price) */}
              <div
                onPointerDown={handleMinPointerDown}
                className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-primary border-2 border-deep-blue-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                style={{ left: `${leftPercent}%` }}
                role="slider"
                aria-valuemin={minPrice}
                aria-valuemax={currentMaxPrice}
                aria-valuenow={currentMinPrice}
                aria-label="Harga Minimum"
              />

              {/* Right Thumb Handle (Drag Max Price) */}
              <div
                onPointerDown={handleMaxPointerDown}
                className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-primary border-2 border-deep-blue-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                style={{ left: `${rightThumbPosPercent}%` }}
                role="slider"
                aria-valuemin={currentMinPrice}
                aria-valuemax={maxPrice}
                aria-valuenow={currentMaxPrice}
                aria-label="Harga Maksimum"
              />
            </div>

            {/* Max Price indicator */}
            <span className="text-body-sm font-semibold text-white shrink-0 min-w-24 text-right">
              {formatRupiah(currentMaxPrice)}
            </span>
          </div>
        </div>

        {/* Section 4: SORT BY */}
        <div className="flex flex-col gap-2.5">
          <span className="text-body-sm text-gray-400 font-normal uppercase tracking-wider">
            SORT BY
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSortBy("terbaru")}
              className={cn(
                "w-full h-11 rounded-lg border text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer",
                sortBy === "terbaru"
                  ? "bg-deep-blue-900 border-deep-blue-600 text-white"
                  : "bg-deep-blue-950 hover:bg-deep-blue-900 border-deep-blue-700 text-gray-400 hover:text-white"
              )}
            >
              Terbaru
            </button>
            <button
              type="button"
              onClick={() => setSortBy("name_asc")}
              className={cn(
                "w-full h-11 rounded-lg border text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer",
                sortBy === "name_asc"
                  ? "bg-deep-blue-900 border-deep-blue-600 text-white"
                  : "bg-deep-blue-950 hover:bg-deep-blue-900 border-deep-blue-700 text-gray-400 hover:text-white"
              )}
            >
              Nama (A - Z)
            </button>
          </div>
        </div>

        {/* Bottom Actions: [ Reset ]  [ Apply ] (Using standard Button component) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={handleResetInternal}
            className="min-w-20 justify-center"
          >
            Reset
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApply}
            className="min-w-24 justify-center"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
