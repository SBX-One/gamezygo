import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminButton } from "@/components/admin";
import { SteamIcon } from "./AdminGameRequestIcons";
import type { AdminGameRequestItem } from "../../types/admin-game-request.types";

export interface AdminGameRequestDetailModalProps {
  isOpen: boolean;
  item: AdminGameRequestItem | null;
  onClose: () => void;
  onAccept?: (item: AdminGameRequestItem) => void;
  onDecline?: (item: AdminGameRequestItem) => void;
  className?: string;
}

export function AdminGameRequestDetailModal({
  isOpen,
  item,
  onClose,
  onAccept,
  onDecline,
  className,
}: AdminGameRequestDetailModalProps) {
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

  if (!isOpen || !item) return null;

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
          "w-125 max-w-[95vw] rounded-2xl bg-[#0F111A] border border-white/10 p-6 sm:p-7 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left font-sans space-y-6",
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-deep-blue-700 pb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              Detail Game Request
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              {item.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-deep-blue-900/60 border border-deep-blue-700">
              <span className="text-[11px] font-medium text-gray-400 block mb-1">
                Total Request
              </span>
              <span className="text-sm font-bold text-white">
                {item.requestCount} Request
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-deep-blue-900/60 border border-deep-blue-700">
              <span className="text-[11px] font-medium text-gray-400 block mb-1">
                First Request
              </span>
              <span className="text-xs font-mono font-medium text-gray-200">
                {item.firstRequest}
              </span>
            </div>
          </div>

          {/* Steam Store Link Box */}
          <div className="p-3.5 rounded-xl bg-deep-blue-900/40 border border-deep-blue-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <SteamIcon className="w-5 h-5 text-white shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Steam Store Page
                </span>
                <span className="text-[11px] text-gray-400 block truncate font-mono">
                  {item.steamUrl || "Steam Community Catalog"}
                </span>
              </div>
            </div>
            <a
              href={
                item.steamUrl ||
                `https://store.steampowered.com/search/?term=${encodeURIComponent(
                  item.name
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#161823] hover:bg-[#1E202E] border border-white/10 text-xs font-medium text-white transition-colors shrink-0 cursor-pointer"
            >
              Buka Steam ↗
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-deep-blue-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181A22] hover:bg-[#222533] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2.5">
            {onDecline && (
              <AdminButton
                variant="dark"
                size="sm"
                onClick={() => {
                  onDecline(item);
                  onClose();
                }}
                className="border-white/10 bg-[#161823] hover:bg-[#1E202E]"
              >
                Decline
              </AdminButton>
            )}
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept(item);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-[#BA343C] hover:bg-[#CF3C45] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm select-none"
              >
                Accept
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
