import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import { FilterModal } from "@/components/ui/FilterModal";
import type { AdminArticleFilterState } from "../../types/admin-article.types";

const ARTICLE_CATEGORIES = [
  "Tutorials",
  "Review & Recommendations",
  "Game Guides",
  "News & Update",
];

const ARTICLE_STATUS_OPTIONS = ["Published", "Draft", "Unpublished"];

export interface AdminArticlesTopBarProps {
  filters: AdminArticleFilterState;
  onFilterChange: (filters: AdminArticleFilterState) => void;
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
    className="shrink-0"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
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

export function AdminArticlesTopBar({
  filters,
  onFilterChange,
  className,
}: AdminArticlesTopBarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    filters.isPublished ||
    filters.isDraft ||
    filters.isUnpublished ||
    (filters.priceRange && filters.priceRange[1] < 200000) ||
    filters.sortBy !== "terbaru";

  return (
    <div className={cn("relative flex items-center gap-3 sm:gap-4", className)}>
      {/* 1. Status Checkboxes: Published, Draft, Unpublished (Matching Image 1) */}
      <div className="hidden md:flex items-center gap-4 sm:gap-5">
        <AdminCheckbox
          label="Published"
          checked={filters.isPublished}
          onChange={(checked) =>
            onFilterChange({ ...filters, isPublished: checked })
          }
        />
        <AdminCheckbox
          label="Draft"
          checked={filters.isDraft}
          onChange={(checked) =>
            onFilterChange({ ...filters, isDraft: checked })
          }
        />
        <AdminCheckbox
          label="Unpublished"
          checked={filters.isUnpublished}
          onChange={(checked) =>
            onFilterChange({ ...filters, isUnpublished: checked })
          }
        />
      </div>

      {/* 2. Search Field: Magnifying glass + 'Cari artikel' placeholder + clear icon (Matching Catalog Design) */}
      <div className="relative flex items-center w-48 sm:w-64">
        <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
          <SearchIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({ ...filters, searchQuery: e.target.value })
          }
          placeholder="Cari artikel"
          className="w-full h-10 pl-9 pr-8 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
            aria-label="Hapus pencarian"
            className="absolute right-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ClearIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Filter Button (Matching Catalog Design) */}
      <div className={cn("relative shrink-0", isFilterOpen && "z-30")}>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filter & Sort"
          className={cn(
            "h-10 w-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative shrink-0",
            isFilterOpen || hasActiveFilters
              ? "bg-[#1E202B] border-gray-400 text-white"
              : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white hover:border-gray-500"
          )}
        >
          <FilterIcon className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5364]" />
          )}
        </button>

        {/* 4. Filter & Sort Dropdown using Base FilterModal (Matching Gambar 1) */}
        <FilterModal
          isOpen={isFilterOpen}
          variant="dropdown"
          placement="content"
          onClose={() => setIsFilterOpen(false)}
          title="Filter & Sort"
          categories={ARTICLE_CATEGORIES}
          selectedCategories={filters.categories || []}
          onToggleCategory={(cat) => {
            const current = filters.categories || [];
            const next = current.includes(cat)
              ? current.filter((c) => c !== cat)
              : [...current, cat];
            onFilterChange({ ...filters, categories: next });
          }}
          genres={[]}
          launchers={[]}
          statusOptions={ARTICLE_STATUS_OPTIONS}
          selectedStatus={[
            ...(filters.isPublished ? ["Published"] : []),
            ...(filters.isDraft ? ["Draft"] : []),
            ...(filters.isUnpublished ? ["Unpublished"] : []),
          ]}
          onToggleStatus={(status) => {
            if (status === "Published") {
              onFilterChange({ ...filters, isPublished: !filters.isPublished });
            } else if (status === "Draft") {
              onFilterChange({ ...filters, isDraft: !filters.isDraft });
            } else if (status === "Unpublished") {
              onFilterChange({ ...filters, isUnpublished: !filters.isUnpublished });
            }
          }}
          showPriceRange={true}
          minPrice={0}
          maxPrice={200000}
          priceRange={
            filters.priceRange && filters.priceRange[1] <= 200000
              ? filters.priceRange
              : [0, 200000]
          }
          onPriceRangeChange={(range) =>
            onFilterChange({ ...filters, priceRange: range })
          }
          sortOptions={["Terbaru", "Nama (A - Z)"]}
          selectedSort={
            filters.sortBy === "name_asc" ? "Nama (A - Z)" : "Terbaru"
          }
          onSelectSort={(sort) =>
            onFilterChange({
              ...filters,
              sortBy: sort === "Nama (A - Z)" ? "name_asc" : "terbaru",
            })
          }
          showCancelButton={false}
          onReset={() => {
            onFilterChange({
              ...filters,
              searchQuery: "",
              isPublished: false,
              isDraft: false,
              isUnpublished: false,
              categories: [],
              priceRange: [0, 200000],
              sortBy: "terbaru",
            });
            setIsFilterOpen(false);
          }}
          onApply={(values) => {
            if (values) {
              const selectedSt = values.status ?? [];
              onFilterChange({
                ...filters,
                categories: values.categories ?? filters.categories ?? [],
                isPublished: selectedSt.includes("Published"),
                isDraft: selectedSt.includes("Draft"),
                isUnpublished: selectedSt.includes("Unpublished"),
                priceRange: values.priceRange ?? filters.priceRange ?? [0, 200000],
                sortBy: values.sort === "Nama (A - Z)" ? "name_asc" : "terbaru",
              });
            }
            setIsFilterOpen(false);
          }}
          popoverClassName="w-80 sm:w-96 !h-auto max-h-[90vh] top-11 right-0 shadow-2xl"
        />
      </div>
    </div>
  );
}
