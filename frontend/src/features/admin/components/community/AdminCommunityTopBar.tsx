import * as React from "react";
import { cn } from "@/lib/utils";
import type { CommunityPlatformTag } from "../../types/admin-community.types";

export interface AdminCommunityTopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: CommunityPlatformTag;
  onSelectTag: (tag: CommunityPlatformTag) => void;
  onAddNew: () => void;
  className?: string;
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TAG_OPTIONS: CommunityPlatformTag[] = [
  "All",
  "Whatsapp",
  "Telegram",
  "Discord",
];

export function AdminCommunityTopBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  onAddNew,
  className,
}: AdminCommunityTopBarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn(
        "w-full flex items-center justify-between gap-3 pb-4 border-b border-white/10 select-none",
        className
      )}
    >
      {/* Left: Search Input & Filter Button */}
      <div className="flex items-center gap-3">
        {/* Search input with search icon & clear button */}
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari komunitas"
            className="w-56 sm:w-68 md:w-76 h-10 pl-9.5 pr-8 bg-[#181A26] border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Filter Button with Dropdown */}
        <div ref={filterRef} className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-lg border transition-colors cursor-pointer shrink-0",
              selectedTag !== "All"
                ? "bg-[#181A26] border-[#DF3848] text-white"
                : "bg-[#181A26] hover:bg-[#222534] border-white/10 text-gray-400 hover:text-white"
            )}
            title="Filter by platform"
            aria-label="Filter by platform"
          >
            <FilterIcon />
            {selectedTag !== "All" && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DF3848] rounded-full border-2 border-[#13151F]" />
            )}
          </button>

          {/* Filter Popover Dropdown */}
          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-44 rounded-xl bg-[#181A26] border border-white/10 shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-400 border-b border-white/5 mb-1">
                Filter Platform
              </div>
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onSelectTag(tag);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer",
                      isSelected
                        ? "bg-[#DF3848]/20 text-[#DF3848] font-semibold"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{tag}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DF3848]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: + Add New Button */}
      <button
        type="button"
        onClick={onAddNew}
        className="inline-flex items-center gap-1.5 px-4 sm:px-5 h-10 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0"
      >
        <PlusIcon />
        <span>Add New</span>
      </button>
    </div>
  );
}
