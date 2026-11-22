import * as React from "react";
import { cn } from "@/lib/utils";
import type { ArticleBlockType } from "../../types/admin-article.types";

export interface AdminArticleEditorToolbarProps {
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  activeHeading?: ArticleBlockType | null;
  onSelectHeading?: (type: ArticleBlockType) => void;
  activeList?: "bullet-list" | "numbered-list" | null;
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

/* Icons */
const UndoIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const RedoIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
  </svg>
);

const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);

const AlignCenterIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const AlignRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 7h16" />
    <path d="M10 7v10" />
    <path d="M14 7v10" />
    <line x1="3" y1="20" x2="21" y2="20" />
  </svg>
);

export function AdminArticleEditorToolbar({
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
}: AdminArticleEditorToolbarProps) {
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = React.useState(false);
  const headingMenuRef = React.useRef<HTMLDivElement>(null);

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
        "w-full flex items-center justify-between flex-wrap gap-2 px-4 py-3 bg-deep-blue-900 border-b border-white/10 select-none text-gray-300",
        className
      )}
    >
      {/* Left: Undo & Redo (Matching Image 2) */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
          className="h-8 w-8 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <UndoIcon />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
          className="h-8 w-8 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <RedoIcon />
        </button>
      </div>

      {/* Center/Right Toolbar items grouped (Matching Image 2 & 5) */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* Zoom Controls: — 100% + */}
        <div className="flex items-center gap-2 text-label-xs font-semibold text-white">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom Out"
            className="p-1 hover:text-white text-gray-400 cursor-pointer transition-colors"
          >
            —
          </button>
          <span className="min-w-[40px] text-center">{zoom}%</span>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom In"
            className="p-1 hover:text-white text-gray-400 cursor-pointer transition-colors"
          >
            +
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* Heading Dropdown H (Matching Image 5) */}
        <div ref={headingMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsHeadingMenuOpen(!isHeadingMenuOpen)}
            aria-label="Heading options"
            className={cn(
              "h-8 min-w-[32px] px-2 rounded-lg border text-label-xs font-bold transition-colors flex items-center justify-center cursor-pointer",
              isHeadingMenuOpen || activeHeading
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            {activeHeading ? activeHeading.toUpperCase() : "H"}
          </button>

          {/* Heading Dropdown Popup (Image 5 exact match) */}
          {isHeadingMenuOpen && (
            <div className="absolute left-0 top-10 z-50 w-36 rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-1.5 shadow-none animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
              {(["h1", "h2", "h3", "h4"] as const).map((hType) => (
                <button
                  key={hType}
                  type="button"
                  onClick={() => {
                    onSelectHeading?.(hType);
                    setIsHeadingMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-label-xs font-medium transition-colors text-left cursor-pointer",
                    activeHeading === hType
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
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
            "h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
            activeList
              ? "bg-[#1E202E] border-white/30 text-white"
              : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
          )}
        >
          <ListIcon />
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* Inline Formatting: B, I, U, S */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleBold}
            aria-label="Bold"
            className={cn(
              "h-8 w-8 rounded-lg border text-label-xs font-bold transition-colors flex items-center justify-center cursor-pointer",
              isBold
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            B
          </button>
          <button
            type="button"
            onClick={onToggleItalic}
            aria-label="Italic"
            className={cn(
              "h-8 w-8 rounded-lg border text-label-xs italic font-serif transition-colors flex items-center justify-center cursor-pointer",
              isItalic
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            I
          </button>
          <button
            type="button"
            onClick={onToggleUnderline}
            aria-label="Underline"
            className={cn(
              "h-8 w-8 rounded-lg border text-label-xs underline transition-colors flex items-center justify-center cursor-pointer",
              isUnderline
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            U
          </button>
          <button
            type="button"
            onClick={onToggleStrike}
            aria-label="Strikethrough"
            className={cn(
              "h-8 w-8 rounded-lg border text-label-xs line-through transition-colors flex items-center justify-center cursor-pointer",
              isStrike
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            S
          </button>
          <button
            type="button"
            onClick={onClearFormat}
            aria-label="Clear formatting"
            className="h-8 w-8 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ClearFormatIcon />
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* Alignment: Left, Center, Right */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAlignChange?.("left")}
            aria-label="Align Left"
            className={cn(
              "h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
              align === "left"
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            <AlignLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => onAlignChange?.("center")}
            aria-label="Align Center"
            className={cn(
              "h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
              align === "center"
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            <AlignCenterIcon />
          </button>
          <button
            type="button"
            onClick={() => onAlignChange?.("right")}
            aria-label="Align Right"
            className={cn(
              "h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
              align === "right"
                ? "bg-[#1E202E] border-white/30 text-white"
                : "bg-[#161823] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
            )}
          >
            <AlignRightIcon />
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* Insert Table Grid Icon */}
        <button
          type="button"
          onClick={onInsertTable}
          aria-label="Insert Table"
          className="h-8 w-8 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <TableIcon />
        </button>
      </div>
    </div>
  );
}
