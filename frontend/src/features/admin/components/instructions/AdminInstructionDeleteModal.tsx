import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminInstructionDeleteModalProps {
  isOpen: boolean;
  templateTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function AdminInstructionDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  className,
}: AdminInstructionDeleteModalProps) {
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
      aria-labelledby="delete-template-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card (rounded-lg, bg-deep-blue-900) */}
      <div
        className={cn(
          "relative z-10 w-105 max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <h3
          id="delete-template-title"
          className="text-lg font-bold text-white tracking-tight leading-snug"
        >
          Are you sure to delete this template?
        </h3>

        <p className="text-label-xs sm:text-sm text-gray-400 font-normal mt-2 leading-relaxed">
          If you delete this file you cannot recover it.
        </p>

        {/* Action Buttons: [ Batal ] & [ Delete ] */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
