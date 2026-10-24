import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminInstructionClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function AdminInstructionClearModal({
  isOpen,
  onClose,
  onConfirm,
  className,
}: AdminInstructionClearModalProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-instruction-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card (rounded-lg, bg-deep-blue-900, border-deep-blue-700) */}
      <div
        className={cn(
          "relative z-10 w-105 max-w-[95vw] rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <h3
          id="clear-instruction-title"
          className="text-lg font-bold text-white tracking-tight leading-snug"
        >
          Are you sure to clear this instruction?
        </h3>

        <p className="text-label-xs sm:text-sm text-gray-400 font-normal mt-2 leading-relaxed">
          If you clear this file you can't recover it.
        </p>

        {/* Action Buttons: [ Batal ] & [ Clear ] */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-deep-blue-950 hover:bg-deep-blue-800 active:scale-95 border border-deep-blue-700 text-white text-label-xs sm:text-sm font-medium transition-all cursor-pointer shadow-xs"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-label-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
