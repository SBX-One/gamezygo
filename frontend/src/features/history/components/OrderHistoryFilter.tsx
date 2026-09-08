import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { OrderStatus, HistoryFilterState } from "../types";

export interface OrderHistoryFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: HistoryFilterState;
  onFilterChange: (state: HistoryFilterState) => void;
  onReset: () => void;
  onApply: () => void;
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

const STATUS_CHOICES: OrderStatus[] = ["Berhasil", "Pending", "Gagal"];
const PAYMENT_CHOICES = [
  "BCA Virtual",
  "BRI Virtual",
  "QRIS",
  "BNI Virtual",
];
const SORT_CHOICES = ["Terbaru", "Nama (A - Z)"];

function formatRupiah(amount: number): string {
  if (amount <= 0) return "RP 0";
  return `RP ${amount.toLocaleString("id-ID")}`;
}

export function OrderHistoryFilter({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onReset,
  onApply,
  className,
}: OrderHistoryFilterProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const minLimit = 0;
  const maxLimit = 1000000;
  const step = 25000;

  const currentMin = filterState.priceRange[0];
  const currentMax = filterState.priceRange[1];

  const leftPercent = ((currentMin - minLimit) / (maxLimit - minLimit)) * 100;
  const rightPercent = 100 - ((currentMax - minLimit) / (maxLimit - minLimit)) * 100;

  const toggleStatus = (status: OrderStatus) => {
    const exists = filterState.status.includes(status);
    const newStatus = exists
      ? filterState.status.filter((s) => s !== status)
      : [...filterState.status, status];
    onFilterChange({ ...filterState, status: newStatus });
  };

  const togglePayment = (method: string) => {
    const exists = filterState.paymentMethods.includes(method);
    const newMethods = exists
      ? filterState.paymentMethods.filter((m) => m !== method)
      : [...filterState.paymentMethods, method];
    onFilterChange({ ...filterState, paymentMethods: newMethods });
  };

  const setSort = (sort: string) => {
    onFilterChange({ ...filterState, sortBy: sort });
  };

  const handlePointerDown = (type: "min" | "max") => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const rawVal = minLimit + ratio * (maxLimit - minLimit);
      const steppedVal = Math.round(rawVal / step) * step;

      let newMin = filterState.priceRange[0];
      let newMax = filterState.priceRange[1];

      if (type === "min") {
        newMin = Math.min(steppedVal, newMax - step);
        newMin = Math.max(minLimit, newMin);
      } else {
        newMax = Math.max(steppedVal, newMin + step);
        newMax = Math.min(maxLimit, newMax);
      }

      onFilterChange({ ...filterState, priceRange: [newMin, newMax] as [number, number] });
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for click away */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute right-0 top-0 z-50 w-full max-w-90 sm:max-w-100 flex flex-col gap-6 rounded-lg bg-deep-blue-950 border border-white/10 p-6 shadow-2xl backdrop-blur-md select-none",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-h5 font-semibold text-gray-50">Filter & Sort</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup filter"
            className="p-1 rounded-md text-gray-400 hover:text-gray-50 transition-colors cursor-pointer"
          >
            <DismissIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Status Section */}
        <div className="flex flex-col gap-3">
          <span className="text-body-xs font-semibold uppercase tracking-wider text-gray-400">
            STATUS
          </span>
          <div className="flex flex-wrap gap-2.5">
            {STATUS_CHOICES.map((status) => {
              const isSelected = filterState.status.includes(status);
              return (
                <Button
                  key={status}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => toggleStatus(status)}
                  className="rounded-lg px-4 py-2 font-medium"
                >
                  {status}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 2. Metode Pembayaran Section */}
        <div className="flex flex-col gap-3">
          <span className="text-body-xs font-semibold uppercase tracking-wider text-gray-400">
            METODE PEMBAYARAN
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {PAYMENT_CHOICES.map((method) => {
              const isSelected = filterState.paymentMethods.includes(method);
              return (
                <Button
                  key={method}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => togglePayment(method)}
                  className="rounded-lg px-3 py-2 text-center justify-center font-medium"
                >
                  {method}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 3. Price Range Section */}
        <div className="flex flex-col gap-3">
          <span className="text-body-xs font-semibold uppercase tracking-wider text-gray-400">
            PRICE RANGE
          </span>
          <div className="flex items-center gap-3 w-full">
            <span className="text-body-sm font-semibold text-gray-100 shrink-0 min-w-14">
              {formatRupiah(currentMin)}
            </span>

            <div
              ref={trackRef}
              className="relative flex-1 flex items-center h-6 cursor-pointer touch-none"
            >
              {/* Rail Track */}
              <div className="w-full h-1.5 rounded-full bg-deep-blue-900 border border-white/10" />

              {/* Range Active Line */}
              <div
                className="absolute h-1.5 rounded-full bg-gradient-primary pointer-events-none"
                style={{
                  left: `${leftPercent}%`,
                  right: `${rightPercent}%`,
                }}
              />

              {/* Min Thumb */}
              <div
                onPointerDown={handlePointerDown("min")}
                className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-primary border-2 border-deep-blue-950 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                style={{ left: `${leftPercent}%` }}
                role="slider"
                aria-label="Harga Minimum"
                aria-valuenow={currentMin}
              />

              {/* Max Thumb */}
              <div
                onPointerDown={handlePointerDown("max")}
                className="absolute translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-primary border-2 border-deep-blue-950 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                style={{ left: `${100 - rightPercent}%` }}
                role="slider"
                aria-label="Harga Maksimum"
                aria-valuenow={currentMax}
              />
            </div>

            <span className="text-body-sm font-semibold text-gray-100 shrink-0 min-w-22 text-right">
              {formatRupiah(currentMax)}
            </span>
          </div>
        </div>

        {/* 4. Sort By Section */}
        <div className="flex flex-col gap-3">
          <span className="text-body-xs font-semibold uppercase tracking-wider text-gray-400">
            SORT BY
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {SORT_CHOICES.map((opt) => {
              const isSelected = filterState.sortBy === opt;
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => setSort(opt)}
                  className="rounded-lg px-3 py-2 text-center justify-center font-medium"
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="rounded-lg px-5 py-2 cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onApply}
            className="rounded-lg px-6 py-2 cursor-pointer font-semibold"
          >
            Apply
          </Button>
        </div>
      </div>
    </>
  );
}
