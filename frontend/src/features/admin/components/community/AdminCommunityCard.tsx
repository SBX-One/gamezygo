import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminCommunityItem } from "../../types/admin-community.types";

const FALLBACK_COMMUNITY_IMAGE =
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg";

export interface AdminCommunityCardProps {
  item: AdminCommunityItem;
  index: number;
  isDragging?: boolean;
  isBusy?: boolean;
  dropPosition?: "top" | "bottom" | null;
  onEdit: (item: AdminCommunityItem) => void;
  onDelete: (item: AdminCommunityItem) => void;
  onToggleActive?: (item: AdminCommunityItem, nextActive: boolean) => void;
  onDragStart: (index: number, e: React.DragEvent) => void;
  onDragOver: (index: number, e: React.DragEvent) => void;
  onDragLeave: (index: number) => void;
  onDrop: (index: number, e: React.DragEvent) => void;
  onDragEnd: () => void;
  className?: string;
}

const GripVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="5" r="1.5" fill="currentColor" />
    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
    <circle cx="9" cy="19" r="1.5" fill="currentColor" />
    <circle cx="15" cy="5" r="1.5" fill="currentColor" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export function AdminCommunityCard({
  item,
  index,
  isDragging,
  isBusy = false,
  dropPosition,
  onEdit,
  onDelete,
  onToggleActive,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  className,
}: AdminCommunityCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);

  const tagsList = React.useMemo(() => {
    if (Array.isArray(item.tags) && item.tags.length > 0) {
      return item.tags;
    }
    if (!item.tag) return [];
    return item.tag
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [item.tags, item.tag]);

  const effectiveImageSrc =
    item.imageUrl && failedSrc !== item.imageUrl
      ? item.imageUrl
      : FALLBACK_COMMUNITY_IMAGE;

  return (
    <div
      ref={cardRef}
      onDragOver={(e) => onDragOver(index, e)}
      onDragLeave={() => onDragLeave(index)}
      onDrop={(e) => onDrop(index, e)}
      className={cn(
        "relative w-full flex flex-col transition-all duration-200 select-none",
        isDragging && "opacity-40 scale-[0.99] border-dashed border-indigo-500/50",
        isBusy && "opacity-75 pointer-events-none",
        className
      )}
    >
      {/* Drop Indicator - Top */}
      {dropPosition === "top" && !isDragging && (
        <div className="w-full h-1 bg-linear-to-r from-indigo-500 via-rose-500 to-indigo-500 rounded-full -mt-1.5 mb-1.5 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />
      )}

      {/* Main Card Row */}
      <div className="w-full flex items-center justify-between gap-4 p-3 sm:p-4 rounded-lg bg-deep-blue-900 border border-deep-blue-700 hover:border-deep-blue-600 transition-colors shadow-xs">
        {/* Left Side: Drag Handle + Cover Image + Community Info */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div
            draggable={!isBusy}
            onDragStart={(e) => {
              if (cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                e.dataTransfer.setDragImage(
                  cardRef.current,
                  e.clientX - rect.left,
                  e.clientY - rect.top
                );
              }
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", `${index}`);
              onDragStart(index, e);
            }}
            onDragEnd={onDragEnd}
            className="p-1.5 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-md transition-all shrink-0"
            title="Tarik untuk memindahkan urutan komunitas"
            aria-label="Tarik untuk memindahkan urutan komunitas"
          >
            <GripVerticalIcon />
          </div>

          {/* Cover Image (3:4 vertical poster) */}
          <div className="relative w-12 h-16 sm:w-14 sm:h-18.5 rounded-lg overflow-hidden shrink-0 border border-deep-blue-700 bg-deep-blue-950">
            <Image
              src={effectiveImageSrc}
              alt={item.name}
              fill
              unoptimized
              sizes="64px"
              className="object-cover object-center"
              onError={() => {
                if (item.imageUrl && failedSrc !== item.imageUrl) {
                  setFailedSrc(item.imageUrl);
                }
              }}
            />
          </div>

          {/* Title, Link & Tag Pills */}
          <div className="flex flex-col min-w-0 gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-normal truncate">
                {item.name}
              </h3>
              {onToggleActive ? (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onToggleActive(item, !item.isActive)}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer shrink-0",
                    item.isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  )}
                  title={
                    item.isActive
                      ? "Klik untuk menonaktifkan"
                      : "Klik untuk mengaktifkan"
                  }
                >
                  {item.isActive ? "Aktif" : "Nonaktif"}
                </button>
              ) : (
                !item.isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
                    Nonaktif
                  </span>
                )
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {tagsList.length > 0 ? (
                tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-xs font-medium bg-deep-blue-950 border border-deep-blue-700 text-gray-300 w-fit"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">Tanpa tag</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Edit & Delete buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Button
            variant="inactive"
            size="sm"
            disabled={isBusy}
            onClick={() => onEdit(item)}
            leftIcon={<EditIcon className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>

          <Button
            variant="inactive"
            size="sm"
            disabled={isBusy}
            onClick={() => onDelete(item)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Drop Indicator - Bottom */}
      {dropPosition === "bottom" && !isDragging && (
        <div className="w-full h-1 bg-linear-to-r from-indigo-500 via-rose-500 to-indigo-500 rounded-full mt-1.5 -mb-1.5 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />
      )}
    </div>
  );
}
