import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminAnnouncementItem } from "../../types/admin-announcement.types";

export interface AdminAnnouncementCardProps {
  item: AdminAnnouncementItem;
  index: number;
  isDragging?: boolean;
  dropPosition?: "top" | "bottom" | null;
  onUpdate: (updated: AdminAnnouncementItem) => void;
  onDelete: (item: AdminAnnouncementItem) => void;
  onDragStart: (index: number, e: React.DragEvent) => void;
  onDragOver: (index: number, e: React.DragEvent) => void;
  onDragLeave: (index: number) => void;
  onDrop: (index: number, e: React.DragEvent) => void;
  onDragEnd: () => void;
  className?: string;
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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

export function AdminAnnouncementCard({
  item,
  index,
  isDragging,
  dropPosition,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  className,
}: AdminAnnouncementCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Toggle published status
  const handleTogglePublish = () => {
    onUpdate({
      ...item,
      isPublished: !item.isPublished,
      lastEdit: "Just now",
    });
  };

  // Change image via file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdate({
          ...item,
          imageUrl: dataUrl,
          lastEdit: "Just now",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      ref={cardRef}
      onDragOver={(e) => onDragOver(index, e)}
      onDragLeave={() => onDragLeave(index)}
      onDrop={(e) => onDrop(index, e)}
      className={cn(
        "relative w-full flex flex-col gap-4 transition-all duration-200",
        isDragging && "opacity-40 scale-[0.99] pointer-events-none",
        className
      )}
    >
      {/* Drop Indicator - Top */}
      {dropPosition === "top" && !isDragging && (
        <div className="w-full h-1 bg-linear-to-r from-indigo-500 via-rose-500 to-indigo-500 rounded-full -mt-2 mb-2 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />
      )}

      {/* 1. Top Controls Bar: [ Page Link ✕ ] ... [ Delete ] [ Publish ] */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Page Link Input with Clear button */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={item.pageLink}
            onChange={(e) =>
              onUpdate({
                ...item,
                pageLink: e.target.value,
                lastEdit: "Just now",
              })
            }
            placeholder="Page Link"
            className="h-9 w-52 sm:w-64 px-3.5 pr-8 bg-[#181A26] border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
          />
          {item.pageLink && (
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  ...item,
                  pageLink: "",
                  lastEdit: "Just now",
                })
              }
              className="absolute right-2.5 p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Clear page link"
              aria-label="Clear page link"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Right: Delete button & Publish toggle switch */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="px-4 py-1.5 rounded-lg bg-[#181A26] hover:bg-[#222534] border border-white/10 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>

          {/* Publish Switch */}
          <div
            onClick={handleTogglePublish}
            className="flex items-center gap-2 cursor-pointer select-none"
            role="switch"
            aria-checked={item.isPublished}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTogglePublish();
              }
            }}
          >
            <div
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-white/10 bg-[#181A26] p-0.5 transition-colors"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full transition-transform shadow-xs",
                  item.isPublished
                    ? "translate-x-4 bg-[#DF3848]"
                    : "translate-x-0 bg-gray-500"
                )}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-white">
              Publish
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full-width horizontal divider line under controls */}
      <div className="w-full border-b border-deep-blue-700/80" />

      {/* 3. Drag handle + Banner Image */}
      <div className="flex items-center gap-3 sm:gap-4 w-full pt-1">
        {/* Drag handle (6-dot icon - draggable) */}
        <div
          draggable
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
          className="p-2 -ml-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing rounded-lg hover:bg-white/5 transition-all select-none shrink-0"
          title="Drag untuk mengubah urutan pengumuman"
          aria-label="Drag untuk mengubah urutan"
        >
          <GripVerticalIcon className="w-5 h-5" />
        </div>

        {/* Banner image with 'Change Image' button */}
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/40 group shadow-lg">
          <img
            src={item.imageUrl}
            alt="Announcement Banner"
            className="w-full h-44 sm:h-56 md:h-64 object-cover object-center rounded-2xl"
          />

          {/* Hidden File Input for Change Image */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Change Image Button Overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-3.5 right-3.5 px-3.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-xs border border-white/15 text-white text-xs font-medium transition-all shadow-md cursor-pointer"
          >
            Change Image
          </button>
        </div>
      </div>

      {/* Drop Indicator - Bottom */}
      {dropPosition === "bottom" && !isDragging && (
        <div className="w-full h-1 bg-linear-to-r from-indigo-500 via-rose-500 to-indigo-500 rounded-full mt-2 -mb-2 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />
      )}
    </div>
  );
}
