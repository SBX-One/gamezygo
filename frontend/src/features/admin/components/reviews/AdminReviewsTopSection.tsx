import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { AdminReviewsFilterModal } from "./AdminReviewsFilterModal";
import type {
  AdminReviewFilterState,
  ReviewStatus,
} from "../../types/admin-review.types";

export interface AdminReviewsTopSectionProps {
  totalCount: number;
  isPostedViewActive?: boolean;
  onTogglePostedView: () => void;
  className?: string;
}

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export function AdminReviewsTopSection({
  totalCount,
  isPostedViewActive = false,
  onTogglePostedView,
  className,
}: AdminReviewsTopSectionProps) {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between px-6 sm:px-8 py-5 border-b border-deep-blue-700 select-none bg-deep-blue-950",
        className
      )}
    >
      {isPostedViewActive ? (
        /* Posted View ("Di Posting") matching Image 2 & 4: [ < ]  92 Ulasan */
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePostedView}
            className="w-9 h-9 rounded-lg bg-deep-blue-900 border border-deep-blue-700 hover:bg-deep-blue-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Kembali ke semua ulasan"
            title="Kembali"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-50 tracking-tight">
            {totalCount} Ulasan
          </h2>
        </div>
      ) : (
        /* Normal View matching Image 2: "92 Ulasan" on left, "Posted Review →" on right */
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-50 tracking-tight">
            {totalCount} Ulasan
          </h2>

          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={onTogglePostedView}
            rightIcon={<ArrowRightIcon className="w-4 h-4" />}
            className="cursor-pointer"
          >
            Posted Review
          </Button>
        </>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// Header Search & Filter Trigger Bar for AdminHeader Right Slot (Matching Image 3)
// -----------------------------------------------------------------

export interface AdminReviewsHeaderSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: AdminReviewFilterState;
  onFilterChange: (filters: AdminReviewFilterState) => void;
  onOpenFilter?: () => void;
  isFilterActive?: boolean;
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
    className="w-4 h-4 text-gray-400"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const DismissIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-gray-400"
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

export function AdminReviewsHeaderSearch({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onOpenFilter,
  className,
}: AdminReviewsHeaderSearchProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const hasActiveFilters =
    filters.star !== null ||
    filters.statuses.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 200000 ||
    filters.sortBy !== "terbaru";

  return (
    <div className={cn("relative flex items-center gap-3 sm:gap-4 select-none", className)}>
      {/* 1. Search Field */}
      <div className="relative flex items-center w-48 sm:w-64">
        <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari ulasan"
          className="w-full h-10 pl-9 pr-8 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Hapus pencarian"
            className="absolute right-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <DismissIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Filter Icon Button */}
      <div className={cn("relative shrink-0", isPopoverOpen && "z-30")}>
        <button
          type="button"
          onClick={() => {
            if (onOpenFilter) {
              onOpenFilter();
            } else {
              setIsPopoverOpen(!isPopoverOpen);
            }
          }}
          aria-label="Filter & Sort"
          className={cn(
            "h-10 w-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative shrink-0",
            isPopoverOpen || hasActiveFilters
              ? "bg-[#1E202B] border-gray-400 text-white"
              : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white hover:border-gray-500"
          )}
        >
          <FilterIcon className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5364]" />
          )}
        </button>

        {/* 3. Review Filter Modal (Exact match to Gambar 1 with star buttons & checklists) */}
        <AdminReviewsFilterModal
          isOpen={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          filters={filters}
          onApply={(newFilters) => {
            onFilterChange(newFilters);
            setIsPopoverOpen(false);
          }}
          onReset={() => {
            onFilterChange({
              ...filters,
              star: null,
              statuses: [],
              priceRange: [0, 200000],
              sortBy: "terbaru",
            });
            setIsPopoverOpen(false);
          }}
        />
      </div>
    </div>
  );
}
