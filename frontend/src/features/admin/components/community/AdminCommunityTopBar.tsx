import * as React from "react";
import { cn } from "@/lib/utils";
import { FilterModal } from "@/components/ui/FilterModal";
import { Button } from "@/components/ui/Button";
import type { CommunityPlatformTag } from "../../types/admin-community.types";

export interface AdminCommunityTopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: CommunityPlatformTag;
  onSelectTag: (tag: CommunityPlatformTag) => void;
  tagOptions?: CommunityPlatformTag[];
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
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z"
      fill="currentColor"
    />
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

const DEFAULT_TAG_OPTIONS: CommunityPlatformTag[] = [
  "All",
  "WhatsApp",
  "Telegram",
  "Discord",
];

export function AdminCommunityTopBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  tagOptions,
  onAddNew,
  className,
}: AdminCommunityTopBarProps) {
  const resolvedTagOptions = React.useMemo(() => {
    if (!tagOptions || tagOptions.length === 0) return DEFAULT_TAG_OPTIONS;
    const withoutAll = tagOptions.filter((t) => t.toLowerCase() !== "all");
    return ["All", ...withoutAll];
  }, [tagOptions]);
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
        "w-full flex items-center justify-between gap-2.5 sm:gap-4 pb-4 border-b border-white/10 select-none",
        className
      )}
    >
      {/* Left: Search Input & Filter Button */}
      <div className="flex-1 sm:flex-initial flex items-center gap-2.5 sm:gap-4 min-w-0">
        {/* Search input with search icon & clear button */}
        <div className="relative flex-1 sm:flex-initial sm:w-64 min-w-0 flex items-center">
          <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari komunitas"
            className="w-full h-10 pl-9 pr-8 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Filter Button with Dropdown */}
        <div ref={filterRef} className={cn("relative shrink-0", isFilterOpen && "z-30")}>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-lg border transition-all cursor-pointer shrink-0 relative",
              selectedTag !== "All" || isFilterOpen
                ? "bg-[#1E202B] border-gray-400 text-white"
                : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white hover:border-gray-500"
            )}
            title="Filter by platform"
            aria-label="Filter by platform"
          >
            <FilterIcon className="w-4 h-4" />
            {selectedTag !== "All" && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5364]" />
            )}
          </button>

          {/* Base FilterModal (Matching Gambar 1) */}
          <FilterModal
            isOpen={isFilterOpen}
            variant="dropdown"
            placement="content"
            onClose={() => setIsFilterOpen(false)}
            title="Filter & Sort"
            categories={[]}
            launchers={[]}
            showPriceRange={false}
            genresLabel="PLATFORM"
            genres={resolvedTagOptions}
            selectedGenres={[selectedTag]}
            onToggleGenre={(tag) => {
              onSelectTag(tag as CommunityPlatformTag);
            }}
            sortOptions={[]}
            showCancelButton={false}
            onReset={() => {
              onSelectTag("All");
              setIsFilterOpen(false);
            }}
            onApply={(values) => {
              if (values?.genres && values.genres.length > 0) {
                onSelectTag(values.genres[0] as CommunityPlatformTag);
              }
              setIsFilterOpen(false);
            }}
            popoverClassName="w-80 sm:w-96 !h-auto max-h-[90vh] top-11 left-0 shadow-2xl"
          />
        </div>
      </div>

      {/* Right: + Add New Button (Primary Button with only + on mobile & tablet) */}
      <Button
        variant="primary"
        size="sm"
        onClick={onAddNew}
        className="h-10 px-3 md:px-4 shrink-0 !gap-1.5 whitespace-nowrap"
        aria-label="Add New Community"
      >
        <PlusIcon className="w-4 h-4 shrink-0" />
        <span className="hidden md:inline">Add New</span>
      </Button>
    </div>
  );
}
