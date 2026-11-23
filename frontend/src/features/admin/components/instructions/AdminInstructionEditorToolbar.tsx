import * as React from "react";
import { cn } from "@/lib/utils";
import type { InstructionBlockType } from "../../types/admin-instruction.types";

export interface AdminInstructionEditorToolbarProps {
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  activeHeading?: InstructionBlockType | null;
  onSelectHeading?: (type: InstructionBlockType) => void;
  activeList?: "bullet-list" | "numbered-list" | "step" | null;
  onToggleList?: () => void;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrike?: boolean;
  onToggleBold?: () => void;
  onToggleItalic?: () => void;
  onToggleUnderline?: () => void;
  onToggleStrike?: () => void;
  onClearFormat?: () => void;
  align?: "left" | "center" | "right";
  onAlignChange?: (align: "left" | "center" | "right") => void;
  onInsertTable?: () => void;
  className?: string;
}

/* Toolbar Icons */
const UndoIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const RedoIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
  </svg>
);

const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="9" y1="6" x2="20" y2="6" />
    <line x1="9" y1="12" x2="20" y2="12" />
    <line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

const AlignLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);

const AlignCenterIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const AlignRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="6" y1="18" x2="21" y2="18" />
  </svg>
);

const TableIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const ClearFormatIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 7h16" />
    <path d="M10 7v10" />
    <path d="M14 7v10" />
    <line x1="3" y1="20" x2="21" y2="20" />
  </svg>
);

export function AdminInstructionEditorToolbar({
  canUndo = true,
  canRedo = true,
  onUndo,
  onRedo,
  zoom = 100,
  onZoomChange,
  activeHeading,
  onSelectHeading,
  activeList,
  onToggleList,
  isBold = false,
  isItalic = false,
  isUnderline = false,
  isStrike = false,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrike,
  onClearFormat,
  align = "left",
  onAlignChange,
  onInsertTable,
  className,
}: AdminInstructionEditorToolbarProps) {
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = React.useState(false);
  const [headingMenuPos, setHeadingMenuPos] = React.useState({ top: 0, left: 0 });
  const headingMenuRef = React.useRef<HTMLDivElement>(null);
  const headingBtnRef = React.useRef<HTMLButtonElement>(null);

  const handleToggleHeadingMenu = () => {
    if (!isHeadingMenuOpen && headingBtnRef.current) {
      const rect = headingBtnRef.current.getBoundingClientRect();
      setHeadingMenuPos({
        top: rect.bottom + 6,
        left: Math.max(10, Math.min(rect.left, window.innerWidth - 160)),
      });
    }
    setIsHeadingMenuOpen(!isHeadingMenuOpen);
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headingMenuRef.current &&
        !headingMenuRef.current.contains(event.target as Node)
      ) {
        setIsHeadingMenuOpen(false);
      }
    }
    if (isHeadingMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHeadingMenuOpen]);

  const handleZoomIn = () => {
    if (onZoomChange && zoom < 150) onZoomChange(zoom + 10);
  };

  const handleZoomOut = () => {
    if (onZoomChange && zoom > 60) onZoomChange(zoom - 10);
  };

  return (
    <div
      className={cn(
        "w-full flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-deep-blue-950 border-b border-deep-blue-700 select-none text-gray-300 font-sans min-w-0 overflow-hidden",
        className
      )}
    >
      {/* 1. Left Pinned Section (Undo, Redo, Zoom In/Out) - Dikecualikan dari overflow (Gambar 4) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Undo & Redo */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            className="h-7 w-7 rounded-lg border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <UndoIcon />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            className="h-7 w-7 rounded-lg border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <RedoIcon />
          </button>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-deep-blue-700 shrink-0" />

        {/* Zoom Controls: — 100% + (Always visible & pinned, excluded from scroll) */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-label-xs font-semibold text-white shrink-0">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom Out"
            className="p-1 hover:text-white text-gray-400 cursor-pointer transition-colors"
          >
            —
          </button>
          <span className="min-w-[36px] text-center text-label-xs font-medium text-gray-200">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom In"
            className="p-1 hover:text-white text-gray-400 cursor-pointer transition-colors"
          >
            +
          </button>
        </div>

        {/* Divider between Zoom and Tools */}
        <div className="h-4 w-px bg-deep-blue-700 shrink-0" />
      </div>

      {/* 2. Tools Section (Horizontal scrollable overflow-x-auto on mobile, flex-nowrap) */}
      <div className="flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 pl-1">
        <div className="flex items-center gap-2 sm:gap-2.5 w-max">
          {/* Heading Dropdown H */}
          <div ref={headingMenuRef} className="relative shrink-0">
            <button
              ref={headingBtnRef}
              type="button"
              onClick={handleToggleHeadingMenu}
              aria-label="Heading options"
              className={cn(
                "h-7 min-w-[28px] px-2 rounded-lg border text-label-xs font-bold transition-colors flex items-center justify-center cursor-pointer",
                isHeadingMenuOpen || activeHeading
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              {activeHeading ? activeHeading.toUpperCase() : "H"}
            </button>

            {/* Heading Dropdown Popup */}
            {isHeadingMenuOpen && (
              <div
                style={{ top: headingMenuPos.top, left: headingMenuPos.left }}
                className="fixed z-50 w-36 rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
              >
                {(["h1", "h2", "h3", "h4"] as const).map((hType) => (
                  <button
                    key={hType}
                    type="button"
                    onClick={() => {
                      onSelectHeading?.(hType);
                      setIsHeadingMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-label-xs font-medium transition-colors text-left cursor-pointer",
                      activeHeading === hType
                        ? "bg-deep-blue-800 text-white"
                        : "text-gray-300 hover:bg-deep-blue-800/60 hover:text-white"
                    )}
                  >
                    <span className="text-[11px] font-bold text-gray-400">
                      {hType.toUpperCase()}
                    </span>
                    <span>Heading {hType.slice(1)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List Button */}
          <button
            type="button"
            onClick={onToggleList}
            aria-label="Toggle List"
            className={cn(
              "h-7 w-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0",
              activeList
                ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
            )}
          >
            <ListIcon />
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-deep-blue-700 shrink-0" />

          {/* Inline Formatting: B, I, U, S, Clear Format */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onToggleBold}
              aria-label="Bold"
              className={cn(
                "h-7 w-7 rounded-lg border text-label-xs font-bold transition-colors flex items-center justify-center cursor-pointer",
                isBold
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              B
            </button>
            <button
              type="button"
              onClick={onToggleItalic}
              aria-label="Italic"
              className={cn(
                "h-7 w-7 rounded-lg border text-label-xs italic font-serif transition-colors flex items-center justify-center cursor-pointer",
                isItalic
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              I
            </button>
            <button
              type="button"
              onClick={onToggleUnderline}
              aria-label="Underline"
              className={cn(
                "h-7 w-7 rounded-lg border text-label-xs underline transition-colors flex items-center justify-center cursor-pointer",
                isUnderline
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              U
            </button>
            <button
              type="button"
              onClick={onToggleStrike}
              aria-label="Strikethrough"
              className={cn(
                "h-7 w-7 rounded-lg border text-label-xs line-through transition-colors flex items-center justify-center cursor-pointer",
                isStrike
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              S
            </button>
            <button
              type="button"
              onClick={onClearFormat}
              aria-label="Clear formatting"
              className="h-7 w-7 rounded-lg border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ClearFormatIcon />
            </button>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-deep-blue-700 shrink-0" />

          {/* Alignment: Left, Center, Right */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onAlignChange?.("left")}
              aria-label="Align Left"
              className={cn(
                "h-7 w-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
                align === "left"
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              <AlignLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => onAlignChange?.("center")}
              aria-label="Align Center"
              className={cn(
                "h-7 w-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
                align === "center"
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              <AlignCenterIcon />
            </button>
            <button
              type="button"
              onClick={() => onAlignChange?.("right")}
              aria-label="Align Right"
              className={cn(
                "h-7 w-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
                align === "right"
                  ? "bg-deep-blue-800 border-deep-blue-600 text-white"
                  : "bg-deep-blue-900/60 border-deep-blue-700 text-gray-300 hover:text-white hover:border-deep-blue-600"
              )}
            >
              <AlignRightIcon />
            </button>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-deep-blue-700 shrink-0" />

          {/* Insert Table Grid Icon */}
          <button
            type="button"
            onClick={onInsertTable}
            aria-label="Insert Table"
            className="h-7 w-7 rounded-lg border border-deep-blue-700 bg-deep-blue-900/60 hover:bg-deep-blue-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <TableIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
