import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { PreOrderItem } from "../../types/admin-preorder.types";

export interface AdminPreOrderPublishModalProps {
  isOpen: boolean;
  item: PreOrderItem | null;
  onClose: () => void;
  onConfirm: (item: PreOrderItem) => void;
  className?: string;
}

export function AdminPreOrderPublishModal({
  isOpen,
  item,
  onClose,
  onConfirm,
  className,
}: AdminPreOrderPublishModalProps) {
  // Handle escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
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

  if (!isOpen || !item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-full max-w-[440px] rounded-2xl bg-[#13151F] border border-white/10 p-6 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left",
          className
        )}
      >
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          Continue to List this product?
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-2 font-normal leading-relaxed">
          Produk <span className="text-white font-semibold">{item.title}</span>{" "}
          akan dipindahkan ke katalog toko dan segera aktif untuk pembelian
          pelanggan.
        </p>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1E202B] hover:bg-[#272A38] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none"
          >
            Batal
          </button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm(item);
              onClose();
            }}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md"
          >
            Continue to List
          </Button>
        </div>
      </div>
    </div>
  );
}
