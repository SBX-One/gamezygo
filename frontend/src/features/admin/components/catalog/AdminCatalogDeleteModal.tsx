import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

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
      className="fixed w-full inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-fit  rounded-lg bg-deep-blue-950 border border-white/10 p-6 shadow-2xl select-none animate-in zoom-in-95 duration-150 ",
          className
        )}
      >
        <div className="flex flex-col gap-2">

        {/* Title */}
        <h3
          id="delete-dialog-title"
          className="text-h3 sm:text-h4 font-semibold text-white"
        >
          {title}
        </h3>

        {/* Subtitle / Warning Note */}
        <p className="text-label-xs sm:text-body-md text-gray-400 ">
          {description}
        </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 ">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className=""
          >
            Batal
          </Button>
          <Button
            variant={"primary"}
            size={"sm"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-7"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
