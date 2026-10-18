import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminCommunityItem } from "../../types/admin-community.types";

export interface AdminCommunityDeleteModalProps {
  isOpen: boolean;
  item?: AdminCommunityItem | null;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function AdminCommunityDeleteModal({
  isOpen,
  item,
  onClose,
  onConfirm,
  className,
}: AdminCommunityDeleteModalProps) {
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
      aria-labelledby="delete-community-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-[440px] max-w-[95vw] rounded-xl bg-[#13151F] border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <h3
          id="delete-community-title"
          className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
        >
          Are you sure to remove this from list?
        </h3>

        <p className="text-xs sm:text-sm text-gray-400 font-normal mt-2 leading-relaxed">
          {item ? (
            <>
              You are about to remove{" "}
              <span className="text-white font-medium">"{item.name}"</span>. If
              you remove this section you can’t recover it.
            </>
          ) : (
            "If you remove this section you can’t recover it."
          )}
        </p>

        {/* Action Buttons: [ Batal ] & [ Remove ] */}
        <div className="flex items-center justify-end gap-3 mt-6 sm:mt-7">
          <Button
            variant="inactive"
            size="sm"
            onClick={onClose}
            className="px-5 py-2.5"
          >
            Batal
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
