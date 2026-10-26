import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminAnnouncementDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function AdminAnnouncementDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  className,
}: AdminAnnouncementDeleteModalProps) {
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
      aria-labelledby="delete-announcement-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-[440px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-7 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <h3
          id="delete-announcement-title"
          className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
        >
          Are you sure to remove this from list?
        </h3>

        <p className="text-label-xs sm:text-sm text-gray-400 font-normal mt-2 leading-relaxed">
          If you remove this section you can’t recover it.
        </p>

        {/* Action Buttons: [ Batal ] & [ Remove ] */}
        <div className="flex items-center justify-end gap-3 mt-6 sm:mt-7">
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
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
