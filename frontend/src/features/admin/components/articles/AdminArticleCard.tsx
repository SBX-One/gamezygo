import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AdminArticle, AdminArticleStatus } from "../../types/admin-article.types";

export interface AdminArticleCardProps {
  article: AdminArticle;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onEdit?: (article: AdminArticle) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: AdminArticleStatus) => void;
  onPreview?: (article: AdminArticle) => void;
  className?: string;
}

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="2.5 6 5 8.5 9.5 3.5" />
  </svg>
);

// Matching Image 2 Icons
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const PreviewIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UnpublishIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const MoveToTrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export function AdminArticleCard({
  article,
  isSelected = false,
  onToggleSelect,
  onEdit,
  onDelete,
  onStatusChange,
  onPreview,
  className,
}: AdminArticleCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Determine badge styling based on status (Matches Image 2 & Image 3)
  const renderStatusBadge = () => {
    if (article.status === "published") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#0f291e] text-green-400 border border-green-800/40">
          PUBLISHED AT : {article.publishedAt || "22/06/2026"}
        </span>
      );
    }

    if (article.status === "unpublished") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#2a141b] text-rose-400 border border-rose-800/40">
          UNPUBLISH
        </span>
      );
    }

    // Default: draft
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#2a1d13] text-amber-400 border border-amber-700/40">
        DRAFT
      </span>
    );
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col w-full select-none transition-all duration-200",
        className
      )}
    >
      {/* 1. Cover Image Container with Rounded-lg (max lg per user instructions) */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-deep-blue-900 border border-white/5 group-hover:border-white/15 transition-all">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Gradient dark vignette at top for clear overlay icon visibility */}
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Top-Left: Checkbox Overlay Button */}
        <div className="absolute top-3 left-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.(article.id);
            }}
            aria-label={isSelected ? "Batal pilih artikel" : "Pilih artikel"}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md",
              isSelected
                ? "bg-[#1E202B]/90 border border-white/40 text-white"
                : "bg-deep-blue-950/75 border border-white/10 hover:border-white/30 text-transparent"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-[#1E202B] border-white text-white"
                  : "bg-[#13141B]/80 border-deep-blue-700 hover:border-gray-400"
              )}
            >
              {isSelected && <CheckIcon className="w-2.5 h-2.5 text-white" />}
            </div>
          </button>
        </div>

        {/* Top-Right: Kebab Menu Button (More Options) */}
        <div ref={menuRef} className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Pilihan artikel"
            aria-expanded={isMenuOpen}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md",
              isMenuOpen
                ? "bg-[#1E202B]/95 border border-white/40 text-white"
                : "bg-deep-blue-950/75 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-deep-blue-950/90"
            )}
          >
            <MoreVerticalIcon className="w-4 h-4" />
          </button>

          {/* Action Dropdown Menu (Exact Match with Image 2 - max rounded-lg, no shadow) */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150 select-none">
              {/* 1. Edit */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit?.(article);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
              >
                <EditIcon className="w-4.5 h-4.5 text-gray-300" />
                <span>Edit</span>
              </button>

              {/* 2. Preview */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onPreview?.(article);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
              >
                <PreviewIcon className="w-4.5 h-4.5 text-gray-300" />
                <span>Preview</span>
              </button>

              {/* 3. Unpublish / Publish */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onStatusChange?.(
                    article.id,
                    article.status === "published" ? "unpublished" : "published"
                  );
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
              >
                <UnpublishIcon className="w-4.5 h-4.5 text-gray-300" />
                <span>
                  {article.status === "published" ? "Unpublish" : "Publish"}
                </span>
              </button>

              {/* 4. Move to Trash */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete?.(article.id);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
              >
                <MoveToTrashIcon className="w-4.5 h-4.5 text-gray-300" />
                <span>Move to Trash</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Below Cover Image: Status Badge + Category + Title + Footer Meta */}
      <div className="flex flex-col mt-4">
        {/* Status & Category Row */}
        <div className="flex flex-wrap items-center gap-2">
          {renderStatusBadge()}
          {article.category && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-gray-300 border border-white/10">
              {article.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onEdit?.(article)}
          title={article.title}
          className="text-white font-bold text-base sm:text-[17px] leading-snug line-clamp-2 mt-3 cursor-pointer hover:text-indigo-300 transition-colors"
        >
          {article.title}
        </h3>

        {/* Footer Meta Info: Last edited • Views */}
        <div className="flex items-center gap-2 text-label-xs text-gray-400 mt-2.5 sm:mt-3">
          <span>Last edited {article.lastEdited}</span>
          <span className="text-gray-500">•</span>
          <span>{article.views} views</span>
        </div>
      </div>
    </article>
  );
}
