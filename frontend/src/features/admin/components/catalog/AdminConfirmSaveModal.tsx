import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export interface AdminConfirmSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
}

export function AdminConfirmSaveModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Simpan Perubahan Produk?",
  description = "Apakah Anda yakin ingin menyimpan seluruh perubahan pada detail dan konfigurasi produk ini ke database?",
  confirmText = "Simpan Perubahan",
  cancelText = "Batal",
  className,
}: AdminConfirmSaveModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-save-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-full max-w-[440px] rounded-lg bg-deep-blue-950 border border-white/10 p-6 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-gray-200 flex flex-col gap-4",
          className
        )}
      >
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3
            id="confirm-save-title"
            className="text-base sm:text-lg font-bold text-white tracking-tight"
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-deep-blue-800/80">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
            className="cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className="cursor-pointer"
          >
            {isLoading ? "Menyimpan..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

