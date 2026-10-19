import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

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
  onOpenFilter: () => void;
  isFilterActive?: boolean;
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

const FilterSlidersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-gray-300"
    {...props}
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
);

export function AdminReviewsHeaderSearch({
  searchQuery,
  onSearchChange,
  onOpenFilter,
  isFilterActive = false,
}: AdminReviewsHeaderSearchProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none">
      {/* Search Input using Field Component (Matching Image 3) */}
      <div className="w-56 sm:w-72">
        <Field
          size="sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari di toko"
          leftIcon={<SearchIcon />}
          rightIcon={
            searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="cursor-pointer p-0.5 hover:text-white transition-colors"
                title="Hapus pencarian"
              >
                <DismissIcon />
              </button>
            ) : (
              <DismissIcon className="text-gray-500 opacity-60" />
            )
          }
          containerClassName="rounded-lg bg-deep-blue-900 border-deep-blue-700 hover:border-neutral-500"
        />
      </div>

      {/* Filter Button using Button Component (Matching Image 3) */}
      <Button
        type="button"
        variant={isFilterActive ? "active" : "inactive"}
        size="sm"
        onClick={onOpenFilter}
        className="w-10 h-10 p-0 flex items-center justify-center shrink-0 rounded-lg"
        title="Filter & Sort"
        aria-label="Filter & Sort"
      >
        <FilterSlidersIcon />
      </Button>
    </div>
  );
}
