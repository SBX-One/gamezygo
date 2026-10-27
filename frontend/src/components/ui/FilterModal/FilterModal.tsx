import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { FilterModalProps } from "./FilterModal.types";

/**
 * Fluent Dismiss Icon (fluent_dismiss-24-regular.svg)
 */
const DismissIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 shrink-0"
    {...props}
  >
    <path
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

const DEFAULT_CATEGORIES = [
  "Hot Deals",
  "Best Seller",
  "New Release",
  "Coming Soon",
];

const DEFAULT_GENRES = [
  "Action",
  "Adventure",
  "Sport-Racing",
  "Fighting",
  "NSFW",
  "Fantasy",
  "RPG",
  "Horror",
  "Multiplayer",
  "Romance",
  "Comedy",
  "Casual",
];

const DEFAULT_LAUNCHERS = ["Steam", "Epic Game", "EA", "PS4"];

const DEFAULT_SORT_OPTIONS = ["Terbaru", "Nama (A - Z)"];

function formatRupiah(amount: number): string {
  if (amount <= 0) return "RP 0";
  return `RP ${amount.toLocaleString("id-ID")}`;
}

export function FilterModal({
  isOpen = true,
  isDialog = true,
  variant = "dialog",
  placement = "navbar",
  onClose,
  onCancel,
  onReset,
  onApply,
  cancelLabel = "Cancel",
  applyLabel = "Apply",
  resetLabel = "Reset",
  title = "Filter & Sort",
  categories = DEFAULT_CATEGORIES,
  genres = DEFAULT_GENRES,
  launchers = DEFAULT_LAUNCHERS,
  sortOptions = DEFAULT_SORT_OPTIONS,
  showPriceRange = true,
  statusOptions,
  paymentOptions,
  platformOptions,
  gameOptions,
  genresLabel = "GENRE",
  platformLabel = "PLATFORM",
  priceLabel = "PRICE RANGE",
  formatPrice,
  statusRadio,
  showCancelButton = true,
  popoverClassName,
  minPrice = 0,
  maxPrice = 200000,
  priceStep = 5000,
  priceRange: propPriceRange,
  onPriceRangeChange,
  selectedCategories: propCategories,
  selectedGenres: propGenres,
  selectedLaunchers: propLaunchers,
  selectedStatus: propStatus,
  selectedPayments: propPayments,
  selectedPlatforms: propPlatforms,
  selectedGames: propGames,
  selectedSort: propSort,
  onToggleCategory,
  onToggleGenre,
  onToggleLauncher,
  onToggleStatus,
  onTogglePayment,
  onTogglePlatform,
  onToggleGame,
  onSelectSort,
  className,
  ref,
  ...props
}: FilterModalProps) {
  // Internal selection states
  const [internalCategories, setInternalCategories] = React.useState<string[]>(
    []
  );
  const [internalGenres, setInternalGenres] = React.useState<string[]>([]);
  const [internalLaunchers, setInternalLaunchers] = React.useState<string[]>([]);
  const [internalStatus, setInternalStatus] = React.useState<string[]>([]);
  const [internalPayments, setInternalPayments] = React.useState<string[]>([]);
  const [internalPlatforms, setInternalPlatforms] = React.useState<string[]>([]);
  const [internalGames, setInternalGames] = React.useState<string[]>([]);
  const [internalSort, setInternalSort] = React.useState<string>("Terbaru");
  const [internalPriceRange, setInternalPriceRange] = React.useState<
    [number, number]
  >([minPrice, maxPrice]);

  const activeCategories = propCategories ?? internalCategories;
  const activeGenres = propGenres ?? internalGenres;
  const activeLaunchers = propLaunchers ?? internalLaunchers;
  const activeStatus = propStatus ?? internalStatus;
  const activePayments = propPayments ?? internalPayments;
  const activePlatforms = propPlatforms ?? internalPlatforms;
  const activeGames = propGames ?? internalGames;
  const activeSort = propSort ?? internalSort;
  const [currentMinPrice, currentMaxPrice] =
    propPriceRange ?? internalPriceRange;

  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock background scroll for modal dialogs (when isOpen and not inline)
  React.useEffect(() => {
    if (!isOpen || variant === "inline") return;

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isOpen, variant]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const handleApply = () => {
    onApply?.({
      categories: activeCategories,
      genres: activeGenres,
      launchers: activeLaunchers,
      status: activeStatus,
      payments: activePayments,
      platforms: activePlatforms,
      games: activeGames,
      priceRange: [currentMinPrice, currentMaxPrice],
      sort: activeSort,
    });
  };

  const handleToggle = (
    item: string,
    currentList: string[],
    setInternal: React.Dispatch<React.SetStateAction<string[]>>,
    callback?: (item: string) => void
  ) => {
    if (callback) {
      callback(item);
    } else {
      setInternal((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  const handleSortSelect = (sort: string) => {
    if (onSelectSort) {
      onSelectSort(sort);
    } else {
      setInternalSort(sort);
    }
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

      const newRange: [number, number] = [clampedVal, currentMaxPrice];
      if (onPriceRangeChange) {
        onPriceRangeChange(newRange);
      } else {
        setInternalPriceRange(newRange);
      }
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

      const newRange: [number, number] = [currentMinPrice, clampedVal];
      if (onPriceRangeChange) {
        onPriceRangeChange(newRange);
      } else {
        setInternalPriceRange(newRange);
      }
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

  // Track click handler
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = (e.currentTarget as HTMLElement) || trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const rawVal = minPrice + ratio * (maxPrice - minPrice);
    const steppedVal = Math.round(rawVal / priceStep) * priceStep;

    const distToMin = Math.abs(steppedVal - currentMinPrice);
    const distToMax = Math.abs(steppedVal - currentMaxPrice);

    let newRange: [number, number];
    if (distToMin < distToMax) {
      const clamped = Math.max(
        minPrice,
        Math.min(steppedVal, currentMaxPrice - priceStep)
      );
      newRange = [clamped, currentMaxPrice];
    } else {
      const clamped = Math.min(
        maxPrice,
        Math.max(steppedVal, currentMinPrice + priceStep)
      );
      newRange = [currentMinPrice, clamped];
    }

    if (onPriceRangeChange) {
      onPriceRangeChange(newRange);
    } else {
      setInternalPriceRange(newRange);
    }
  };

  const handleReset = () => {
    setInternalCategories([]);
    setInternalGenres([]);
    setInternalLaunchers([]);
    setInternalStatus([]);
    setInternalPayments([]);
    setInternalPlatforms([]);
    setInternalGames([]);
    setInternalSort("Terbaru");
    setInternalPriceRange([minPrice, maxPrice]);
    if (onPriceRangeChange) {
      onPriceRangeChange([minPrice, maxPrice]);
    }
    if (onReset) onReset();
  };

  // Range track percentages
  const leftPercent =
    ((currentMinPrice - minPrice) / (maxPrice - minPrice)) * 100;
  const rightPercent =
    100 - ((currentMaxPrice - minPrice) / (maxPrice - minPrice)) * 100;

  if (isDialog && !isOpen) return null;

  const renderInnerContent = (isMobileFull = false) => (
    <>
      {/* 1. STICKY HEADER (Title & Dismiss Button) */}
      <div
        className={cn(
          "shrink-0 sticky top-0 z-20 flex items-center justify-between px-5 sm:px-6 py-4 bg-deep-blue-950/95 backdrop-blur-md border-b border-white/10",
          isMobileFull && "pt-4"
        )}
      >
        <h4 className="text-body-lg font-semibold text-gray-50 tracking-normal">
          {title}
        </h4>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup filter"
            className="text-gray-400 hover:text-gray-50 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/10 outline-none"
          >
            <DismissIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE FILTER CONTENT (Only content scrolls) */}
      <div
        data-modal-scrollable="true"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 sm:p-6 flex flex-col gap-6 sm:gap-8 scrollbar-thin overscroll-contain"
      >

      {/* 2. Top Category Pills */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
              const isSelected = activeCategories.includes(cat);
              return (
                <Button
                  key={cat}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      cat,
                      activeCategories,
                      setInternalCategories,
                      onToggleCategory
                    )
                  }
                >
                  {cat}
                </Button>
              );
            })}
        </div>
      )}

      {/* 3. Main Genres List (or Status for Blogs) */}
      {statusOptions && statusOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            STATUS
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((status) => {
              const isSelected = activeStatus.includes(status);
              return (
                <Button
                  key={status}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      status,
                      activeStatus,
                      setInternalStatus,
                      onToggleStatus
                    )
                  }
                >
                  {status}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3b. Genres List if not using custom status */}
      {!statusOptions && genres && genres.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            {genresLabel}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {genres.map((genre, idx) => {
              const isSelected = activeGenres.includes(genre);
              return (
                <Button
                  key={`${genre}-${idx}`}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      genre,
                      activeGenres,
                      setInternalGenres,
                      onToggleGenre
                    )
                  }
                >
                  {genre}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3c. Optional Radio Status (Matching Catalog / Filter Spec) */}
      {statusRadio && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            STATUS
          </span>
          <div>
            <button
              type="button"
              onClick={() => statusRadio.onChange(!statusRadio.checked)}
              className="inline-flex items-center gap-2.5 text-label-xs sm:text-sm font-medium text-gray-200 hover:text-white cursor-pointer select-none"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                  statusRadio.checked
                    ? "border-gray-300 bg-[#1E202B]"
                    : "border-deep-blue-700 bg-transparent"
                )}
              >
                {statusRadio.checked && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span>{statusRadio.label}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Platform Section (Blog Platform or General Launchers) */}
      {platformOptions && platformOptions.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            {platformLabel}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {platformOptions.map((platform) => {
              const isSelected = activePlatforms.includes(platform);
              return (
                <Button
                  key={platform}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      platform,
                      activePlatforms,
                      setInternalPlatforms,
                      onTogglePlatform
                    )
                  }
                >
                  {platform}
                </Button>
              );
            })}
          </div>
        </div>
      ) : launchers && launchers.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            LAUNCHER
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {launchers.map((launcher) => {
              const isSelected = activeLaunchers.includes(launcher);
              return (
                <Button
                  key={launcher}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      launcher,
                      activeLaunchers,
                      setInternalLaunchers,
                      onToggleLauncher
                    )
                  }
                >
                  {launcher}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 4b. Payment Methods Section */}
      {paymentOptions && paymentOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            METODE PEMBAYARAN
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {paymentOptions.map((opt) => {
              const isSelected = activePayments.includes(opt);
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      opt,
                      activePayments,
                      setInternalPayments,
                      onTogglePayment
                    )
                  }
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4c. Game Section */}
      {gameOptions && gameOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            GAME
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {gameOptions.map((game) => {
              const isSelected = activeGames.includes(game);
              return (
                <Button
                  key={game}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() =>
                    handleToggle(
                      game,
                      activeGames,
                      setInternalGames,
                      onToggleGame
                    )
                  }
                >
                  {game}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Interactive Price Range Section */}
      {showPriceRange && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            {priceLabel}
          </span>
          <div className="flex items-center gap-3 w-full">
            {/* Min Price indicator */}
            <span className="text-body-sm font-semibold text-gray-50 shrink-0 min-w-12 text-left">
              {(formatPrice ?? formatRupiah)(currentMinPrice)}
            </span>

            {/* Interactive Dual Slider Scale & Range Track */}
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              className="relative flex-1 flex items-center h-6 cursor-pointer touch-none mx-2"
            >
              {/* Track Rail background */}
              <div className="w-full h-1.5 rounded-full bg-deep-blue-900 border border-white/5" />

              {/* Active Range Highlight */}
              <div
                className="absolute h-1.5 rounded-full bg-gradient-primary pointer-events-none"
                style={{
                  left: `${leftPercent}%`,
                  right: `${rightPercent}%`,
                }}
              />

              {/* Left Thumb Handle (Drag Min Price) */}
              <div
                onPointerDown={handleMinPointerDown}
                className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-primary shadow-md border-2 border-deep-blue-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
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
                className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-primary shadow-md border-2 border-deep-blue-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                style={{ left: `${100 - rightPercent}%` }}
                role="slider"
                aria-valuemin={currentMinPrice}
                aria-valuemax={maxPrice}
                aria-valuenow={currentMaxPrice}
                aria-label="Harga Maksimum"
              />
            </div>

            {/* Max Price indicator */}
            <span className="text-body-sm font-semibold text-gray-50 shrink-0 min-w-22 text-right">
              {(formatPrice ?? formatRupiah)(currentMaxPrice)}
            </span>
          </div>
        </div>
      )}

      {/* 6. Sort By Section */}
      {sortOptions && sortOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 font-normal uppercase ">
            SORT BY
          </span>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((opt) => {
              const isSelected = activeSort === opt;
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleSortSelect(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      </div>

      {/* 3. STICKY FOOTER ACTIONS (Tombol Cancel & Apply selalu sticky di bawah) */}
      <div className="shrink-0 sticky bottom-0 z-20 flex items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-deep-blue-950/95 backdrop-blur-md border-t border-white/10 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
        {showCancelButton ? (
          <>
            <button
              type="button"
              onClick={handleReset}
              className="text-body-sm font-medium text-gray-400 hover:text-rose-400 transition-colors cursor-pointer underline underline-offset-4 outline-none"
            >
              {resetLabel}
            </button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                className="cursor-pointer min-w-20 justify-center"
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApply}
                className="cursor-pointer min-w-24 justify-center"
              >
                {applyLabel}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="cursor-pointer min-w-20 justify-center"
            >
              {resetLabel}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="cursor-pointer min-w-24 justify-center"
            >
              {applyLabel}
            </Button>
          </div>
        )}
      </div>
    </>
  );

  if (!isOpen) return null;

  // Mode: INLINE (Card embedded directly in page layout)
  if (variant === "inline") {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col min-h-0 max-h-full rounded-2xl bg-deep-blue-950 border border-white/10 text-gray-50 select-none w-full overflow-hidden shadow-2xl overscroll-contain",
          className
        )}
        {...props}
      >
        {renderInnerContent(false)}
      </div>
    );
  }

  // Centered Modal Dialog on all viewports (Mobile, Tablet, Desktop)
  // Backdrop with 50% fade & blur (bg-black/50 backdrop-blur-md)
  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Filter & Sort"}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-md animate-fade-in touch-none overscroll-none"
    >
      {/* Backdrop overlay (klik di luar untuk menutup) */}
      <div
        className="fixed inset-0 touch-none"
        onClick={onClose}
        onTouchMove={(e) => {
          if (e.cancelable) e.preventDefault();
        }}
        aria-hidden="true"
      />

      {/* Floating Card Modal dengan responsive width, border, rounded-2xl, dan shadow-2xl */}
      <div
        ref={ref}
        className={cn(
          "relative z-10 w-full sm:w-[500px] md:w-[540px] max-w-[95vw] max-h-[85vh] flex flex-col rounded-2xl bg-deep-blue-950 border border-white/10 text-gray-50 select-none overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 overscroll-contain",
          className
        )}
        {...props}
      >
        {renderInnerContent(false)}
      </div>
    </div>
  );

  return isMounted && typeof document !== "undefined"
    ? createPortal(modalNode, document.body)
    : null;
}
