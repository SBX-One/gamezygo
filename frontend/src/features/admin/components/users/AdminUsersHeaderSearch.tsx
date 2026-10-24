import * as React from "react";
import { cn } from "@/lib/utils";
import { FilterModal } from "@/components/ui/FilterModal";
import type { AdminUserFilterState } from "../../types/admin-user.types";
import { INITIAL_USER_FILTER_STATE } from "../../types/admin-user.types";

export interface AdminUsersHeaderSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onClear?: () => void;
  filters?: AdminUserFilterState;
  onApplyFilters?: (filters: AdminUserFilterState) => void;
  onResetFilters?: () => void;
  className?: string;
  placeholder?: string;
}

/**
 * Search Icon matching fluent_search-24-regular.svg
 */
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.102 17.162C14.5177 18.4737 12.4892 19.1248 10.4375 18.9802C8.3858 18.8356 6.46864 17.9063 5.08408 16.3853C3.69952 14.8644 2.95396 12.8686 3.0022 10.8124C3.05045 8.75615 3.88879 6.79751 5.34315 5.34315C6.79751 3.88879 8.75615 3.05045 10.8124 3.0022C12.8686 2.95396 14.8644 3.69952 16.3853 5.08408C17.9063 6.46864 18.8356 8.3858 18.9802 10.4375C19.1248 12.4892 18.4737 14.5177 17.162 16.102L21.78 20.72C21.8537 20.7886 21.9128 20.8714 21.9538 20.9634C21.9947 21.0554 22.0168 21.1547 22.0186 21.2555C22.0203 21.3562 22.0018 21.4562 21.9641 21.5496C21.9264 21.643 21.8702 21.7278 21.799 21.799C21.7278 21.8702 21.643 21.9264 21.5496 21.9641C21.4562 22.0018 21.3562 22.0203 21.2555 22.0186C21.1547 22.0168 21.0554 21.9947 20.9634 21.9538C20.8714 21.9128 20.7886 21.8537 20.72 21.78L16.102 17.162ZM17.5 11C17.5 9.27607 16.8152 7.62277 15.5962 6.40378C14.3772 5.18479 12.7239 4.49997 11 4.49997C9.27607 4.49997 7.62277 5.18479 6.40378 6.40378C5.18479 7.62277 4.49997 9.27607 4.49997 11C4.49997 12.7239 5.18479 14.3772 6.40378 15.5962C7.62277 16.8152 9.27607 17.5 11 17.5C12.7239 17.5 14.3772 16.8152 15.5962 15.5962C16.8152 14.3772 17.5 12.7239 17.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Dismiss Icon matching fluent_dismiss-24-regular.svg
 */
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Filter Lines Icon matching Image 1 & Katalog TopBar
 */
const FilterLinesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="5" y1="8" x2="19" y2="8" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </svg>
);

export function AdminUsersHeaderSearch({
  value,
  onChange,
  searchQuery: searchQueryProp,
  onSearchChange,
  onClear,
  filters = INITIAL_USER_FILTER_STATE,
  onApplyFilters,
  onResetFilters,
  className,
  placeholder = "Cari di toko",
}: AdminUsersHeaderSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const activeSearch = value !== undefined ? value : searchQueryProp || "";
  const handleSearchChange = (newVal: string) => {
    onChange?.(newVal);
    onSearchChange?.(newVal);
  };

  const handleClear = () => {
    handleSearchChange("");
    onClear?.();
  };

  // Check if any filter is actively applied
  const hasActiveFilters = Boolean(
    filters.bundle ||
    filters.status ||
    filters.loginType ||
    filters.minPoints > 0 ||
    filters.maxPoints < 999 ||
    filters.sortBy !== "terbaru"
  );

  return (
    <div className={cn("relative flex items-center gap-2 select-none", className)}>
      {/* 1. Search Input Bar */}
      <div className="relative flex items-center w-60 sm:w-72 md:w-80 h-9 sm:h-10">
        <SearchIcon className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={activeSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full pl-10 pr-9 bg-[#111622] hover:bg-[#141A29] focus:bg-[#141A29] border border-deep-blue-700/80 focus:border-deep-blue-600 rounded-lg text-label-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
        />
        {activeSearch ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded"
            aria-label="Hapus pencarian"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute right-3 p-1 text-gray-500 pointer-events-none"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Filter Icon Button with Shared FilterModal from Katalog */}
      <div className={cn("relative", isFilterOpen && "z-30")}>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filter & Sort"
          className={cn(
            "h-9 sm:h-10 w-9 sm:w-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative",
            isFilterOpen || hasActiveFilters
              ? "bg-[#1E202B] border-gray-400 text-white"
              : "bg-[#111622] hover:bg-[#141A29] border-deep-blue-700/80 text-gray-400 hover:text-white hover:border-gray-500"
          )}
        >
          <FilterLinesIcon className="w-4.5 h-4.5" />
          {hasActiveFilters && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5364]" />
          )}
        </button>

        {/* 3. Shared FilterModal from Katalog (Consistent UI/UX) */}
        <FilterModal
          isOpen={isFilterOpen}
          variant="dropdown"
          placement="content"
          onClose={() => setIsFilterOpen(false)}
          title="Filter & Sort"
          categories={[]}
          genres={["Paket 1", "Paket 2", "Paket 3"]}
          genresLabel="BUNDLE"
          selectedGenres={filters.bundle ? [filters.bundle] : []}
          onToggleGenre={(bundle) => {
            const next = filters.bundle === bundle ? null : bundle;
            onApplyFilters?.({ ...filters, bundle: next });
          }}
          statusRadio={{
            label: "Active",
            checked: filters.status === "Active",
            onChange: (checked) => {
              onApplyFilters?.({
                ...filters,
                status: checked ? "Active" : null,
              });
            },
          }}
          platformLabel="LOGIN TYPE"
          platformOptions={["Google Account", "Email"]}
          selectedPlatforms={filters.loginType ? [filters.loginType] : []}
          onTogglePlatform={(type) => {
            const next = filters.loginType === type ? null : (type as "Google Account" | "Email");
            onApplyFilters?.({
              ...filters,
              loginType: next,
            });
          }}
          priceLabel="POINTS"
          minPrice={0}
          maxPrice={999}
          priceStep={10}
          priceRange={[filters.minPoints, filters.maxPoints]}
          formatPrice={(val) => `${val} pts`}
          onPriceRangeChange={(range) => {
            onApplyFilters?.({
              ...filters,
              minPoints: range[0],
              maxPoints: range[1],
            });
          }}
          sortOptions={["Terbaru", "Nama (A - Z)"]}
          selectedSort={filters.sortBy === "name_asc" ? "Nama (A - Z)" : "Terbaru"}
          onSelectSort={(sort) => {
            onApplyFilters?.({
              ...filters,
              sortBy: sort === "Nama (A - Z)" ? "name_asc" : "terbaru",
            });
          }}
          showCancelButton={false}
          onReset={() => {
            onResetFilters?.();
            setIsFilterOpen(false);
          }}
          onApply={(values) => {
            if (values) {
              onApplyFilters?.({
                ...filters,
                bundle: values.genres && values.genres.length > 0 ? values.genres[0] : null,
                loginType:
                  values.platforms && values.platforms.length > 0
                    ? (values.platforms[0] as "Google Account" | "Email")
                    : null,
                minPoints: values.priceRange ? values.priceRange[0] : 0,
                maxPoints: values.priceRange ? values.priceRange[1] : 999,
                sortBy: values.sort === "Nama (A - Z)" ? "name_asc" : "terbaru",
              });
            }
            setIsFilterOpen(false);
          }}
          popoverClassName="w-80 sm:w-96 lg:w-[22vw] lg:min-w-[320px] !h-auto max-h-[90vh] top-11 right-0 shadow-2xl"
        />
      </div>
    </div>
  );
}
