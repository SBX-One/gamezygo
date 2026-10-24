import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminFaqDeleteModalProps {
  isOpen: boolean;
  questionTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function AdminFaqDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  className,
}: AdminFaqDeleteModalProps) {
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
      aria-labelledby="delete-faq-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-[440px] max-w-[95vw] rounded-lg bg-[#13151F] border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <h3
          id="delete-faq-title"
          className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
        >
          Are you sure to remove this from list?
        </h3>

        <p className="text-label-xs sm:text-sm text-gray-400 font-normal mt-2 leading-relaxed">
          If you remove this section you can’t recover it.
        </p>

        {/* Action Buttons: [ Batal ] & [ Remove ] */}
        <div className="flex items-center justify-end gap-3 mt-6 sm:mt-7">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#181A26] hover:bg-[#222534] border border-white/10 text-white text-label-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-label-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

