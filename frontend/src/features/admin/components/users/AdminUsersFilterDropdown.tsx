import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminUserFilterState } from "../../types/admin-user.types";
import { INITIAL_USER_FILTER_STATE } from "../../types/admin-user.types";

export interface AdminUsersFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdminUserFilterState;
  onApply: (filters: AdminUserFilterState) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Close 'X' icon
 */
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

export function AdminUsersFilterDropdown({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  className,
}: AdminUsersFilterDropdownProps) {
  // Local draft state for editing before clicking "Apply"
  const [draftFilters, setDraftFilters] = React.useState<AdminUserFilterState>(filters);

  React.useEffect(() => {
    if (isOpen) {
      setDraftFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const minPercent = Math.max(0, Math.min(100, (draftFilters.minPoints / 999) * 100));
  const maxPercent = Math.max(0, Math.min(100, (draftFilters.maxPoints / 999) * 100));

  const handleBundleToggle = (bundle: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      bundle: prev.bundle === bundle ? null : bundle,
    }));
  };

  const handleStatusToggle = (status: "Active" | "Inactive") => {
    setDraftFilters((prev) => ({
      ...prev,
      status: prev.status === status ? null : status,
    }));
  };

  const handleLoginTypeToggle = (type: "Google Account" | "Email") => {
    setDraftFilters((prev) => ({
      ...prev,
      loginType: prev.loginType === type ? null : type,
    }));
  };

  const handleSortToggle = (sortBy: "terbaru" | "name_asc") => {
    setDraftFilters((prev) => ({
      ...prev,
      sortBy,
    }));
  };

  const handleReset = () => {
    setDraftFilters({
      ...INITIAL_USER_FILTER_STATE,
      searchQuery: filters.searchQuery, // keep active search term
    });
    onReset();
    onClose();
  };

  const handleApply = () => {
    onApply(draftFilters);
    onClose();
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-12 w-[340px] max-w-[95vw] lg:w-1/5 min-w-[280px] bg-deep-blue-950 border border-deep-blue-700 rounded-lg p-5 z-50 text-left select-none animate-in fade-in zoom-in-95 duration-150 font-sans",
        className
      )}
    >
      {/* 1. Header: Filter & Sort + Close X */}
      <div className="flex items-center justify-between border-b border-deep-blue-700/60 pb-3 mb-4">
        <h3 className="text-sm font-bold text-white tracking-normal">Filter & Sort</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded"
          aria-label="Tutup filter"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* 2. BUNDLE Section */}
        <div>
          <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            BUNDLE
          </span>
          <div className="space-y-2">
            {(["Paket 1", "Paket 2", "Paket 3"] as const).map((bundle) => {
              const isSelected = draftFilters.bundle === bundle;
              return (
                <label
                  key={bundle}
                  onClick={() => handleBundleToggle(bundle)}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div
                    className={cn(
                      "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-white bg-transparent"
                        : "border-gray-500 group-hover:border-gray-300"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                    )}
                  >
                    {bundle}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. STATUS Section */}
        <div>
          <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            STATUS
          </span>
          <div className="space-y-2">
            {(["Active", "Inactive"] as const).map((st) => {
              const isSelected = draftFilters.status === st;
              return (
                <label
                  key={st}
                  onClick={() => handleStatusToggle(st)}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div
                    className={cn(
                      "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-white bg-transparent"
                        : "border-gray-500 group-hover:border-gray-300"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                    )}
                  >
                    {st}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. LOGIN TYPE Section */}
        <div>
          <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            LOGIN TYPE
          </span>
          <div className="flex items-center gap-2">
            {(["Google Account", "Email"] as const).map((type) => {
              const isSelected = draftFilters.loginType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleLoginTypeToggle(type)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                    isSelected
                      ? "bg-deep-blue-900 border-white/40 text-white font-semibold"
                      : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white hover:border-gray-500"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. POINTS Section */}
        <div>
          <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            POINTS
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-white shrink-0 min-w-10">
              {draftFilters.minPoints} pts
            </span>

            {/* Range Slider Container */}
            <div className="relative flex-1 flex items-center h-6">
              {/* Background dark track */}
              <div className="absolute inset-x-0 h-1.5 rounded-full bg-deep-blue-900 border border-deep-blue-700/60" />

              {/* Active red bar between min and max */}
              <div
                className="absolute h-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600"
                style={{
                  left: `${minPercent}%`,
                  width: `${Math.max(0, maxPercent - minPercent)}%`,
                }}
              />

              {/* Left Thumb Visual */}
              <div
                className="absolute w-4 h-4 rounded-full bg-[#EF4444] border-2 border-white/20 -translate-x-1/2 pointer-events-none z-10 transition-transform"
                style={{ left: `${minPercent}%` }}
              />

              {/* Right Thumb Visual */}
              <div
                className="absolute w-4 h-4 rounded-full bg-[#EF4444] border-2 border-white/20 -translate-x-1/2 pointer-events-none z-10 transition-transform"
                style={{ left: `${maxPercent}%` }}
              />

              {/* Min Input Slider */}
              <input
                type="range"
                min={0}
                max={999}
                value={draftFilters.minPoints}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), draftFilters.maxPoints - 10);
                  setDraftFilters((prev) => ({ ...prev, minPoints: Math.max(0, val) }));
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                aria-label="Poin minimal"
              />

              {/* Max Input Slider */}
              <input
                type="range"
                min={0}
                max={999}
                value={draftFilters.maxPoints}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), draftFilters.minPoints + 10);
                  setDraftFilters((prev) => ({ ...prev, maxPoints: Math.min(999, val) }));
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                aria-label="Poin maksimal"
              />
            </div>

            <span className="text-xs font-bold text-white shrink-0 min-w-12 text-right">
              {draftFilters.maxPoints} pts
            </span>
          </div>
        </div>

        {/* 6. SORT BY Section */}
        <div>
          <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            SORT BY
          </span>
          <div className="flex items-center gap-2">
            {(
              [
                { id: "terbaru", label: "Terbaru" },
                { id: "name_asc", label: "Nama (A - Z)" },
              ] as const
            ).map((s) => {
              const isSelected = draftFilters.sortBy === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSortToggle(s.id)}
                  className={cn(
                    "flex-1 py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer",
                    isSelected
                      ? "bg-deep-blue-900 border-white/40 text-white font-semibold"
                      : "bg-deep-blue-900 border-deep-blue-700 text-gray-400 hover:text-white hover:border-gray-500"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Action Buttons (Footer) */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-deep-blue-700/60">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-deep-blue-900 hover:bg-deep-blue-800 border border-deep-blue-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
