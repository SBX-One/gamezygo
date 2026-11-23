import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminReviewItem } from "../../types/admin-review.types";

export interface AdminReviewPostConfirmModalProps {
  isOpen: boolean;
  review: AdminReviewItem | null;
  onClose: () => void;
  onConfirm: (review: AdminReviewItem) => void;
  className?: string;
}

export function AdminReviewPostConfirmModal({
  isOpen,
  review,
  onClose,
  onConfirm,
  className,
}: AdminReviewPostConfirmModalProps) {
  // ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-sans"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Confirmation Dialog Box (Matching Image 2: deep-blue-950, wider container, single-line text) */}
      <div
        className={cn(
          "relative z-10 w-[480px] sm:w-[500px] max-w-[95vw] bg-deep-blue-950 border border-deep-blue-700 rounded-lg p-6 sm:p-7 flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Title (Matching Image 2: "Post this review?") */}
        <h3
          id="post-confirm-title"
          className="text-xl font-bold text-white tracking-tight"
        >
          Post this review?
        </h3>

        {/* Subtitle (Matching Image 2: "If you post this review, customer can see it in their page.") */}
        <p className="text-sm text-gray-400 font-normal mt-2.5 mb-6 leading-relaxed">
          If you post this review, customer can see it in their page.
        </p>

        {/* Action Buttons Row: [ Batal ]  [ Post ] (Matching Image 2) */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={onClose}
            className="min-w-20 justify-center"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onConfirm(review)}
            className="min-w-20 justify-center"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
