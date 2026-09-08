import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { OrderHistoryItem, OrderStatus } from "../types";

export interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderHistoryItem | null;
  onStatusUpdated?: (updatedOrder: OrderHistoryItem) => void;
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

export function TransactionDetailModal({
  isOpen,
  onClose,
  order,
  onStatusUpdated,
  className,
}: TransactionDetailModalProps) {
  const [prevOrderId, setPrevOrderId] = React.useState<string | undefined>(order?.id);
  const [transactionIdInput, setTransactionIdInput] = React.useState(
    order?.transactionId || "E908YRH3H3UR3B"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>(
    order?.status || "Pending"
  );

  // Synchronize state during render when order changes (React 19 pattern)
  if (order && order.id !== prevOrderId) {
    setPrevOrderId(order.id);
    setTransactionIdInput(order.transactionId || "E908YRH3H3UR3B");
    setCurrentStatus(order.status);
  }

  if (!isOpen || !order) return null;

  const handleCheckStatus = () => {
    setIsLoading(true);
    // Simulate checking status and rotating or validating
    setTimeout(() => {
      setIsLoading(false);
      // If currently pending, transition to Berhasil
      const nextStatus: OrderStatus =
        currentStatus === "Pending" ? "Berhasil" : currentStatus;
      setCurrentStatus(nextStatus);
      if (onStatusUpdated) {
        onStatusUpdated({
          ...order,
          transactionId: transactionIdInput,
          status: nextStatus,
        });
      }
    }, 600);
  };

  // Determine stepper active states
  const isBerhasil = currentStatus === "Berhasil";
  const isPending = currentStatus === "Pending";
  const isGagal = currentStatus === "Gagal";

  const isStep1Active = isBerhasil || isPending;
  const isStep2Active = isBerhasil;
  const isStep3Active = isBerhasil;

  return (
    <>
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity"
        onClick={onClose}
      />

      {/* 2. Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-detail-title"
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-126 rounded-lg bg-deep-blue-950 border border-white/10 p-6 shadow-2xl flex flex-col gap-8 select-none",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title + Status Badge + Close Button */}
        <div className="flex items-center justify-between border-b border-b-gradient-secondary pb-3">
          <div className="flex items-center gap-3">
            <h3
              id="transaction-detail-title"
              className="text-h6 font-semibold text-gray-50 tracking-normal"
            >
              Detail Transaksi
            </h3>

            {isBerhasil && (
              <Pill
                variant="success"
                size="xs"
                className="px-2.5 py-0.5 text-label-xs font-medium"
              >
                Berhasil
              </Pill>
            )}
            {isPending && (
              <Pill
                variant="warning"
                size="xs"
                className="px-2.5 py-0.5 text-label-xs font-medium"
              >
                Pending
              </Pill>
            )}
            {isGagal && (
              <Pill
                variant="error"
                size="xs"
                className="px-2.5 py-0.5 text-label-xs font-medium"
              >
                Gagal
              </Pill>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1 rounded-md text-gray-400 hover:text-gray-50 transition-colors cursor-pointer"
          >
            <DismissIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: ID TRANSAKSI */}
        <div className="flex flex-col gap-2">
          <span className="text-body-sm uppercase  text-gray-400">
            ID TRANSAKSI
          </span>
          <div className="flex items-center gap-2.5 w-full">
            <input
              type="text"
              value={transactionIdInput}
              onChange={(e) => setTransactionIdInput(e.target.value)}
              placeholder="Masukkan ID Transaksi..."
              className="flex-1 rounded-lg bg-deep-blue-900 border border-white/10 px-4 py-2.5 text-body-sm font-mono text-gray-50 outline-none focus:border-brand-primary-default transition-colors placeholder:text-gray-500"
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              onClick={handleCheckStatus}
              className="rounded-lg px-5 py-2.5 font-semibold shrink-0 cursor-pointer shadow-xs"
            >
              Cek Status
            </Button>
          </div>
        </div>

        {/* Section 2: DETAIL PESANAN */}
        <div className="flex flex-col gap-3 border-b border-b-gradient-secondary pb-6">
          <span className="text-body-sm uppercase  text-gray-400">
            DETAIL PESANAN
          </span>
          <div className="flex flex-col gap-2.5 text-body-sm">
            <div className="flex items-center justify-between text-gray-200">
              <span className="text-gray-300">Item(s) Subtotal</span>
              <span className="font-medium text-gray-100">{order.formattedPrice}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-gray-50">Pajak</span>
              <span>-</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-gray-50">Pajak</span>
              <span>-</span>
            </div>
          </div>
        </div>

        {/* Section 3: TOTAL BELANJA BOX */}
        <div className="rounded-lg bg-deep-blue-900 border border-white/10 px-5 py-3.5 flex items-center justify-between shadow-inner">
          <span className="font-semibold text-body-md text-gray-100">
            Total Belanja
          </span>
          <span className="font-bold text-body-md text-gray-50">
            {order.formattedPrice}
          </span>
        </div>

        {/* Section 4: PROGRESS STEPPER */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {/* Step 1: Order dibuat */}
          <div className="flex flex-col gap-2 items-start text-left">
            <div
              className={cn(
                "h-0.5 w-full rounded-full transition-all duration-300",
                isStep1Active ? "bg-pale-red-500" : "bg-white/10"
              )}
            />
            <span
              className={cn(
                "text-label-xs transition-colors",
                isStep1Active ? "text-gray-100 font-medium" : "text-gray-500"
              )}
            >
              Order dibuat
            </span>
          </div>

          {/* Step 2: Pembayaran */}
          <div className="flex flex-col gap-2 items-start text-left">
            <div
              className={cn(
                "h-0.5 w-full rounded-full transition-all duration-300",
                isStep2Active ? "bg-pale-red-500" : "bg-white/10"
              )}
            />
            <span
              className={cn(
                "text-label-xs transition-colors",
                isStep2Active ? "text-gray-100 font-medium" : "text-gray-500"
              )}
            >
              Pembayaran
            </span>
          </div>

          {/* Step 3: Redeem Tersedia */}
          <div className="flex flex-col gap-2 items-start text-left">
            <div
              className={cn(
                "h-0.5 w-full rounded-full transition-all duration-300",
                isStep3Active ? "bg-pale-red-500" : "bg-white/10"
              )}
            />
            <span
              className={cn(
                "text-label-xs transition-colors",
                isStep3Active ? "text-gray-100 font-medium" : "text-gray-500"
              )}
            >
              Redeem Tersedia
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
