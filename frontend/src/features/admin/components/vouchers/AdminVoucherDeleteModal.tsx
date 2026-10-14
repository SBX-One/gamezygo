import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminVoucherDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucherCode?: string;
  selectedCount?: number;
  className?: string;
}

export function AdminVoucherDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  voucherCode,
  selectedCount,
  className,
}: AdminVoucherDeleteModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMultiple = selectedCount !== undefined && selectedCount > 1;

  // Exact matching Image 1: "Are you sure to delete these voucher?" / "Are you sure to delete this voucher?"
  const title = isMultiple
    ? "Are you sure to delete these voucher?"
    : voucherCode
    ? "Are you sure to delete this voucher?"
    : "Are you sure to delete these voucher?";

  // Exact matching Image 1: "If you delete this voucher you can’t recover it."
  const description = "If you delete this voucher you can’t recover it.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-115 max-w-[95vw] rounded-2xl bg-[#0F111A] border border-white/10 p-6 sm:p-7 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left",
          className
        )}
      >
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed font-normal">
          {description}
        </p>

        {/* Action Buttons (Matching Image 1: [Batal] [Delete]) */}
        <div className="flex items-center justify-end gap-3 mt-7">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#181A22] hover:bg-[#222533] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm select-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
