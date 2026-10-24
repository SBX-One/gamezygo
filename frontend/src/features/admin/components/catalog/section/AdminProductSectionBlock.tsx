import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  GripSixDotsIcon,
  EditPencilIcon,
  CloseXIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "./AdminSectionIcons";
import { AdminSectionGameCard } from "./AdminSectionGameCard";
import { AdminSectionAddGameCard } from "./AdminSectionAddGameCard";
import type { ProductSection } from "../../../types/admin-section.types";

export interface AdminProductSectionBlockProps {
  section: ProductSection;
  index: number;
  totalSections: number;
  isDragging: boolean;
  dropIndicator: "top" | "bottom" | null;
  onTitleChange: (newTitle: string) => void;
  onClearTitle: () => void;
  onEditSection: () => void;
  onClearSection: () => void;
  onDeleteSection: () => void;
  onAddGame: () => void;
  onRemoveGame: (gameId: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  // Drag and Drop
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  className?: string;
}

export function AdminProductSectionBlock({
  section,
  index,
  totalSections,
  isDragging,
  dropIndicator,
  onTitleChange,
  onClearTitle,
  onEditSection,
  onClearSection,
  onDeleteSection,
  onAddGame,
  onRemoveGame,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  className,
}: AdminProductSectionBlockProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "relative transition-all duration-200",
        isDragging && "opacity-40 scale-[0.99]",
        className
      )}
    >
      {/* Top Drop Indicator (Notion-style visual drop indicator) */}
      {dropIndicator === "top" && (
        <div className="absolute -top-3 left-0 right-0 h-1 bg-deep-blue-300 rounded-full shadow-[0_0_12px_rgba(96,96,164,0.9)] z-20 animate-pulse pointer-events-none" />
      )}

      {/* Main Container with Left Notion Drag Handle */}
      <div className="flex items-start gap-3 sm:gap-4 group/section">
        {/* Left Column: Notion-Style 6-dot Drag Handle + Quick Order Controls */}
        <div className="flex flex-col items-center pt-2.5 shrink-0 select-none">
          <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            title="Tahan & geser untuk memindahkan urutan section (seperti Notion)"
            className="p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-deep-blue-900 active:cursor-grabbing cursor-grab transition-colors"
          >
            <GripSixDotsIcon className="w-4 h-5" />
          </div>

          {/* Quick accessible Move Up / Move Down buttons on hover */}
          <div className="flex flex-col items-center gap-0.5 mt-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              title="Pindah ke atas"
              className="p-1 rounded text-gray-500 hover:text-gray-300 disabled:opacity-20 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowUpIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalSections - 1}
              onClick={onMoveDown}
              title="Pindah ke bawah"
              className="p-1 rounded text-gray-500 hover:text-gray-300 disabled:opacity-20 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowDownIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section Body */}
        <div className="flex-1 min-w-0">
          {/* Top Bar: Title Input + 3 Action Buttons (Images 2 & 3) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Title Input Pill Container */}
            <div className="relative flex items-center bg-deep-blue-900 border border-deep-blue-700 hover:border-deep-blue-600 focus-within:border-deep-blue-500 rounded-lg px-3.5 py-1.5 transition-colors">
              <input
                type="text"
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Section header"
                className="bg-transparent text-gray-50 text-label-xs sm:text-sm font-semibold focus:outline-none pr-6 placeholder:text-gray-500 w-[180px] sm:w-[240px]"
              />
              {section.title && (
                <button
                  type="button"
                  onClick={onClearTitle}
                  title="Clear title"
                  className="absolute right-2.5 p-0.5 rounded text-gray-400 hover:text-gray-50 transition-colors cursor-pointer"
                >
                  <CloseXIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 3 Action Buttons (Matching Images 2 & 3 using Button variant='inactive') */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Button
                type="button"
                variant="inactive"
                size="sm"
                onClick={onEditSection}
                className="font-medium gap-2"
              >
                <EditPencilIcon className="w-3.5 h-3.5" />
                <span>Edit Section</span>
              </Button>

              <Button
                type="button"
                variant="inactive"
                size="sm"
                onClick={onClearSection}
                className="font-medium"
              >
                Clear Section
              </Button>

              <Button
                type="button"
                variant="inactive"
                size="sm"
                onClick={onDeleteSection}
                className="font-medium"
              >
                Delete Section
              </Button>
            </div>
          </div>

          {/* Subtle Horizontal Divider Line */}
          <div className="w-full h-px bg-deep-blue-700 my-5" />

          {/* Horizontal Game Cards Row */}
          <div className="flex items-start gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none">
            {section.products.map((game) => (
              <AdminSectionGameCard
                key={game.id}
                product={game}
                onRemove={() => onRemoveGame(game.id)}
              />
            ))}

            {/* The + ADD GAME dashed card (Matching Images 2 & 3) */}
            <AdminSectionAddGameCard onClick={onAddGame} />
          </div>
        </div>
      </div>

      {/* Bottom Drop Indicator (Notion-style visual drop indicator) */}
      {dropIndicator === "bottom" && (
        <div className="absolute -bottom-3 left-0 right-0 h-1 bg-deep-blue-300 rounded-full shadow-[0_0_12px_rgba(96,96,164,0.9)] z-20 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
