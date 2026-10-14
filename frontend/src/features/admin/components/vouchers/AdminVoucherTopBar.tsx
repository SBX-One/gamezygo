import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminVoucherFilterState } from "../../types/admin-voucher.types";

export interface AdminVoucherTopBarProps {
  filters: AdminVoucherFilterState;
  onFilterChange: (filters: AdminVoucherFilterState) => void;
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
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export function AdminVoucherTopBar({
  filters,
  onFilterChange,
  className,
}: AdminVoucherTopBarProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen]);

  const hasActiveFilters =
    filters.status !== "all" || filters.sortBy !== "terbaru";

  return (
    <div className={cn("relative flex items-center gap-3", className)}>
      {/* Search Input (Matching Image 1: Cari voucher) */}
      <div className="relative flex items-center w-52 sm:w-64">
        <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({ ...filters, searchQuery: e.target.value })
          }
          placeholder="Cari voucher"
          className="w-full h-9 pl-9 pr-8 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors select-none"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
            aria-label="Hapus pencarian voucher"
            className="absolute right-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ClearIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Funnel Button (Matching Image 1: [ ▽ ]) */}
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          aria-label="Filter dan Urutkan Voucher"
          className={cn(
            "h-9 w-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative",
            isPopoverOpen || hasActiveFilters
              ? "bg-[#1E202B] border-gray-400 text-white"
              : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white hover:border-gray-500"
          )}
        >
          <FilterIcon className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5364]" />
          )}
        </button>

        {/* Filter & Sort Dropdown Popover */}
        {isPopoverOpen && (
          <div className="absolute right-0 top-11 w-64 rounded-xl bg-[#0F111A] border border-deep-blue-700 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-deep-blue-700 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Filter & Sort
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        status: "all",
                        sortBy: "terbaru",
                      })
                    }
                    className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Reward Status
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: "all", label: "Semua" },
                      { id: "active", label: "Active" },
                      { id: "inactive", label: "Inactive" },
                      { id: "expired", label: "Expired" },
                      { id: "draft", label: "Draft" },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        onFilterChange({ ...filters, status: st.id })
                      }
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer",
                        filters.status === st.id
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white"
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Urutkan
                </span>
                <div className="space-y-1">
                  {(
                    [
                      { id: "terbaru", label: "Terbaru" },
                      { id: "code_asc", label: "Kode (A - Z)" },
                      { id: "value_desc", label: "Nilai Tertinggi" },
                      { id: "value_asc", label: "Nilai Terendah" },
                    ] as const
                  ).map((srt) => (
                    <button
                      key={srt.id}
                      type="button"
                      onClick={() =>
                        onFilterChange({ ...filters, sortBy: srt.id })
                      }
                      className={cn(
                        "w-full px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer",
                        filters.sortBy === srt.id
                          ? "bg-indigo-600/20 text-white font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {srt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
