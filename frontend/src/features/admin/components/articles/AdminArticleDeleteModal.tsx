import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminArticleDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function AdminArticleDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure to delete this article?",
  description = "If you delete this article you can't recover it.",
  className,
}: AdminArticleDeleteModalProps) {
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
          "w-full max-w-105 rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 select-none animate-in zoom-in-95 duration-150 text-left",
          className
        )}
      >
        {/* Title (Matching Image 4) */}
        <h3
          id="delete-dialog-title"
          className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
        >
          {title}
        </h3>

        {/* Subtitle (Matching Image 4) */}
        <p className="text-label-xs sm:text-sm text-gray-400 mt-2 font-normal leading-relaxed">
          {description}
        </p>

        {/* Actions (Matching Image 4) */}
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
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
