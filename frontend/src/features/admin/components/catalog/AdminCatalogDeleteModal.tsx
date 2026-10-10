import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminCatalogDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function AdminCatalogDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure to delete this product?",
  description = "If you delete this file you can’t recover it.",
  className,
}: AdminCatalogDeleteModalProps) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-full max-w-[420px] rounded-2xl bg-[#13151F] border border-white/10 p-6 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left",
          className
        )}
      >
        {/* Title */}
        <h3
          id="delete-dialog-title"
          className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
        >
          {title}
        </h3>

        {/* Subtitle / Warning Note */}
        <p className="text-xs sm:text-sm text-gray-400 mt-2 font-normal leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1E202B] hover:bg-[#272A38] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DF3848] to-[#FF5364] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer select-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
