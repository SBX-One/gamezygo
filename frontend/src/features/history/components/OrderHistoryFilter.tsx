import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface OrderHistoryFilterProps {
  isOpen: boolean;
  onClose: () => void;
  statusOptions?: string[];
  selectedStatus?: string[];
  onToggleStatus?: (status: string) => void;
  paymentOptions?: string[];
  selectedPayments?: string[];
  onTogglePayment?: (payment: string) => void;
  minPrice?: number;
  maxPrice?: number;
  priceStep?: number;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  sortOptions?: string[];
  selectedSort?: string;
  onSelectSort?: (sort: string) => void;
  onReset?: () => void;
  onApply?: () => void;
  className?: string;
}

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

function formatRupiah(amount: number): string {
  if (amount <= 0) return "RP 0";
  return `RP ${amount.toLocaleString("id-ID")}`;
}

export function OrderHistoryFilter({
  isOpen,
  onClose,
  statusOptions = ["Berhasil", "Pending", "Gagal"],
  selectedStatus = [],
  onToggleStatus,
  paymentOptions = ["BCA Virtual", "BRI Virtual", "QRIS", "BNI Virtual"],
  selectedPayments = [],
  onTogglePayment,
  minPrice = 0,
  maxPrice = 1000000,
  priceStep = 25000,
  priceRange = [0, 1000000],
  onPriceRangeChange,
  sortOptions = ["Terbaru", "Nama (A - Z)"],
  selectedSort = "Terbaru",
  onSelectSort,
  onReset,
  onApply,
  className,
}: OrderHistoryFilterProps) {
  const [currentMinPrice, currentMaxPrice] = priceRange;
  const trackRef = React.useRef<HTMLDivElement>(null);

  // Scroll lock ONLY active on mobile viewport (< sm) when modal is open
  React.useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      // Only lock on mobile dialog
      if (window.innerWidth >= 640) return;
      const card = document.getElementById("order-history-filter-modal");
      if (card && card.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 640) return;
      const card = document.getElementById("order-history-filter-modal");
      if (card && card.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

      if (onPriceRangeChange) {
        onPriceRangeChange([clampedVal, currentMaxPrice]);
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

      if (onPriceRangeChange) {
        onPriceRangeChange([currentMinPrice, clampedVal]);
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

  // Track click to snap nearest thumb
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
    }
  };

  const leftPercent =
    ((currentMinPrice - minPrice) / (maxPrice - minPrice)) * 100;
  const rightPercent =
    100 - ((currentMaxPrice - minPrice) / (maxPrice - minPrice)) * 100;

  // Filter content body
  const FilterContent = (
    <div className="flex flex-col gap-6 text-gray-50 select-none w-full">
      {/* 1. Header (Filter & Sort title + close button + separator) */}
      <div className="flex items-center justify-between pb-4 border-b-gradient-secondary">
        <h4 className="text-body-lg font-semibold text-gray-50 tracking-normal">
          Filter & Sort
        </h4>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup filter"
          className="text-gray-400 hover:text-gray-50 transition-colors p-1 cursor-pointer outline-none"
        >
          <DismissIcon />
        </button>
      </div>

      {/* 2. Status Section */}
      {statusOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 uppercase ">
            STATUS
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((opt) => {
              const isSelected = selectedStatus.includes(opt);
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => onToggleStatus && onToggleStatus(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Metode Pembayaran Section */}
      {paymentOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 uppercase ">
            METODE PEMBAYARAN
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {paymentOptions.map((opt) => {
              const isSelected = selectedPayments.includes(opt);
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => onTogglePayment && onTogglePayment(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Price Range Section */}
      <div className="flex flex-col gap-3">
        <span className="text-body-sm text-gray-400 uppercase ">
          PRICE RANGE
        </span>

        <div className="flex items-center gap-3 pt-1">
          {/* Min Price indicator */}
          <span className="text-body-sm font-semibold text-gray-50 shrink-0 min-w-16">
            {formatRupiah(currentMinPrice)}
          </span>

          {/* Dual Range Slider Track */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className="relative flex-1 h-1.5 rounded-full bg-deep-blue-900 cursor-pointer flex items-center"
          >
            {/* Active Range Highlight */}
            <div
              className="absolute h-full rounded-full bg-gradient-primary pointer-events-none"
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

      {/* 5. Sort By Section */}
      {sortOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-body-sm text-gray-400 uppercase ">
            SORT BY
          </span>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((opt) => {
              const isSelected = selectedSort === opt;
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  className="w-full justify-center text-gray-400"
                  onClick={() => onSelectSort && onSelectSort(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="cursor-pointer"
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => {
            if (onApply) onApply();
            onClose();
          }}
          className="cursor-pointer"
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Modal Dialog (< sm Viewport) - Same concept as TransactionDetailModal */}
      <div
        className="sm:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden animate-fade-in touch-none"
        onClick={onClose}
      >
        <div
          id="order-history-filter-modal"
          role="dialog"
          aria-modal="true"
          className="w-full  max-h-[85vh] overflow-y-auto rounded-xl bg-deep-blue-950 border border-gradient-secondary p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {FilterContent}
        </div>
      </div>

      {/* 2. Desktop Dropdown Popover (>= sm Viewport) - Anchored under Filter button, freely scrollable */}
      <div className="hidden sm:block bg-deep-blue-950 ">
        {/* Invisible click-outside backdrop below navbar header */}
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={onClose}
        />

        {/* Anchored Popover Card */}
        <div
          id="order-history-filter-dropdown"
          role="dialog"
          aria-modal="false"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute right-0 top-12 z-35",
            "w-110 md:w-115 max-h-[calc(100vh-120px)] overflow-y-auto",
            "rounded-lg bg-deep-blue-950  backdrop-blur-xl border border-gradient-secondary p-6",
            "scrollbar-thin shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150",
            className
          )}
        >
          {FilterContent}
        </div>
      </div>
    </>
  );
}

export default OrderHistoryFilter;
