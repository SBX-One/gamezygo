import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminGameRequestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "accept" | "decline" | "accept-all" | "decline-all" | "cancel";
  targetName?: string;
  count?: number;
  className?: string;
}

export function AdminGameRequestActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  targetName,
  count,
  className,
}: AdminGameRequestActionModalProps) {
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

  const isAccept = actionType === "accept" || actionType === "accept-all";
  const isBatch = actionType === "accept-all" || actionType === "decline-all";

  const getTitle = () => {
    if (actionType === "cancel") {
      return "Are you sure to cancel this product?";
    }
    if (isAccept) {
      if (isBatch || !targetName) {
        return "Are you sure to accept these product?";
      }
      return `Are you sure to accept this product?`;
    }
    if (isBatch || !targetName) {
      return "Are you sure to decline these product?";
    }
    return `Are you sure to decline this product?`;
  };

  const getDescription = () => {
    if (actionType === "cancel") {
      return "This product will be moved back to the Requested section.";
    }
    if (isAccept) {
      return "If you accept this product you can cancel it in Accepted section.";
    }
    return "If you decline this product you can cancel it in Declined section.";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-115 max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-7 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left font-sans",
          className
        )}
      >
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {getTitle()}
        </h3>
        <p className="text-label-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
          {getDescription()}
        </p>

        <div className="flex items-center justify-end gap-3 mt-7">
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
            {isAccept ? "Accept" : actionType === "cancel" ? "Cancel Product" : "Decline"}
          </Button>
        </div>
      </div>
    </div>
  );
}
