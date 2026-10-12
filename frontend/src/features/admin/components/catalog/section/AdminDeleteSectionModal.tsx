import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminDeleteSectionModalProps {
  isOpen: boolean;
  sectionTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function AdminDeleteSectionModal({
  isOpen,
  sectionTitle,
  onClose,
  onConfirm,
  className,
}: AdminDeleteSectionModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-[420px] max-w-[95vw] rounded-2xl bg-deep-blue-950 border border-deep-blue-700 p-6 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left",
          className
        )}
      >
        <h3 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight leading-snug">
          Hapus section &quot;{sectionTitle}&quot;?
        </h3>

        <p className="text-xs sm:text-sm text-gray-400 mt-2 font-normal leading-relaxed">
          Section ini beserta susunan game di dalamnya akan dihapus dari halaman toko dan landing page.
        </p>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="cursor-pointer min-w-20 justify-center"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="cursor-pointer min-w-20 justify-center shadow-md"
          >
            Delete Section
          </Button>
        </div>
      </div>
    </div>
  );
}
