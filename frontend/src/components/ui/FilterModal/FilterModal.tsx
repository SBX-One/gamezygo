import * as React from "react";
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
  isDialog = false,
  variant = "dropdown",
  onClose,
  onReset,
  onApply,
  title = "Filter & Sort",
  categories,
  genres,
  launchers,
  sortOptions = DEFAULT_SORT_OPTIONS,
  showPriceRange = true,
  statusOptions,
  paymentOptions,
  platformOptions,
  gameOptions,
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
  // Determine if this is a custom specialized filter (like History or Blog)
  const isCustomFilter = Boolean(
    statusOptions || paymentOptions || platformOptions || gameOptions
  );

  const activeCategoriesList =
    categories ?? (isCustomFilter ? undefined : DEFAULT_CATEGORIES);
  const activeGenresList =
    genres ?? (isCustomFilter ? undefined : DEFAULT_GENRES);
  const activeLaunchersList =
    launchers ?? (isCustomFilter ? undefined : DEFAULT_LAUNCHERS);

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

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
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

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
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
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
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

  const ModalContent = (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-8 p-6 rounded-lg bg-deep-blue-950 border border-gradient-secondary text-gray-50 select-none w-full",
        variant === "inline" && className
      )}
      {...props}
    >
      {/* 1. Header (Filter & Sort title + close button + separator) */}
      <div className="flex items-center justify-between pb-4 border-b-gradient-secondary">
        <h4 className="text-body-lg font-semibold text-gray-50 tracking-normal">
          {title}
        </h4>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup filter"
            className="text-gray-400 hover:text-gray-50 transition-colors cursor-pointer p-1 rounded-md"
          >
            <DismissIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Top Category Pills */}
      {activeCategoriesList && activeCategoriesList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeCategoriesList.map((cat) => {
            const isSelected = activeCategories.includes(cat);
            return (
              <Button
                key={cat}
                type="button"
                variant={isSelected ? "active" : "inactive"}
                size="sm"
                className="text-gray-400"
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

      {/* 3. Main Genres List (or Status for Blogs / History) */}
      {statusOptions && statusOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
            STATUS
          </span>
          <div className="flex items-center gap-2 w-full">
            {statusOptions.map((status) => {
              const isSelected = activeStatus.includes(status);
              return (
                <Button
                  key={status}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="flex-1 justify-center text-gray-400"
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
      {!statusOptions && activeGenresList && activeGenresList.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
            GENRE
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {activeGenresList.map((genre, idx) => {
              const isSelected = activeGenres.includes(genre);
              return (
                <Button
                  key={`${genre}-${idx}`}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="text-gray-400"
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

      {/* 4. Platform Section (Blog Platform or General Launchers) */}
      {platformOptions && platformOptions.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
            PLATFORM
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
                  className="text-gray-400"
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
      ) : activeLaunchersList && activeLaunchersList.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
            LAUNCHER
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {activeLaunchersList.map((launcher) => {
              const isSelected = activeLaunchers.includes(launcher);
              return (
                <Button
                  key={launcher}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="text-gray-400"
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

      {/* 4b. Game Section */}
      {gameOptions && gameOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
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
                  className="text-gray-400"
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

      {/* 4c. Payment Method Section (History / Checkout Filter) */}
      {paymentOptions && paymentOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
            METODE PEMBAYARAN
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {paymentOptions.map((method) => {
              const isSelected = activePayments.includes(method);
              return (
                <Button
                  key={method}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="text-gray-400"
                  onClick={() =>
                    handleToggle(
                      method,
                      activePayments,
                      setInternalPayments,
                      onTogglePayment
                    )
                  }
                >
                  {method}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Interactive Price Range Section */}
      {showPriceRange && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
            PRICE RANGE
          </span>
          <div className="flex items-center gap-3 w-full">
            {/* Min Price indicator */}
            <span className="text-body-sm font-semibold text-gray-50 shrink-0 min-w-12 text-left">
              {formatRupiah(currentMinPrice)}
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
              {formatRupiah(currentMaxPrice)}
            </span>
          </div>
        </div>
      )}

      {/* 6. Sort By Section */}
      {sortOptions && sortOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400  uppercase ">
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
                  className="w-full justify-center text-gray-400"
                  onClick={() => handleSortSelect(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Actions (Reset: Secondary SM, Apply: Primary SM) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleReset}
          className="cursor-pointer"
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onApply}
          className="cursor-pointer"
        >
          Apply
        </Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (variant === "dialog" || (isDialog && variant !== "dropdown")) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="fixed inset-0" onClick={onClose} />
        <div className="relative z-10 w-full max-w-md">
          {ModalContent}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return ModalContent;
  }

  // Default: Dropdown Popover matching Image 3
  return (
    <>
      {/* Invisible overlay for click-outside to close */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
      />

      {/* Floating Dropdown Card */}
      <div
        className={cn(
          "fixed sm:absolute right-4 sm:right-8 lg:right-20 top-20 sm:top-38 z-50",
          "w-[calc(100vw-32px)] sm:w-115 max-h-[calc(100vh-100px)] overflow-y-auto",
          "rounded-lg  bg-[#0D121F]/98 backdrop-blur-xl",
          "scrollbar-thin animate-in fade-in slide-in-from-top-2 duration-150",
          className
        )}
      >
        {ModalContent}
      </div>
    </>
  );
}
