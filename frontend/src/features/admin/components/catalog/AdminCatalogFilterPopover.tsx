import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminCatalogFilterState } from "../../types/admin-catalog.types";

export interface AdminCatalogFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdminCatalogFilterState;
  onApply: (newFilters: AdminCatalogFilterState) => void;
  onReset: () => void;
  className?: string;
}

const CATEGORY_OPTIONS = [
  "Action",
  "Adventure",
  "Sport-Racing",
  "Fighting",
  "NSFW",
  "Fantasy",
  "RPG",
  "Horror",
  "Multiplayer",
  "Romance",
  "Comedy",
  "Casual",
  "Strategy",
];

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function AdminCatalogFilterPopover({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  className,
}: AdminCatalogFilterPopoverProps) {
  // Local state until "Apply" is clicked
  const [localCategories, setLocalCategories] = React.useState<string[]>(
    filters.categories
  );
  const [localStatusActive, setLocalStatusActive] = React.useState<boolean | null>(
    filters.statusActive
  );
  const [localSortBy, setLocalSortBy] = React.useState<"terbaru" | "name_asc">(
    filters.sortBy
  );

  // Sync when prop filters change
  React.useEffect(() => {
    setLocalCategories(filters.categories);
    setLocalStatusActive(filters.statusActive);
    setLocalSortBy(filters.sortBy);
  }, [filters, isOpen]);

  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    if (localCategories.includes(cat)) {
      setLocalCategories(localCategories.filter((c) => c !== cat));
    } else {
      setLocalCategories([...localCategories, cat]);
    }
  };

  const handleApplyClick = () => {
    onApply({
      ...filters,
      categories: localCategories,
      statusActive: localStatusActive,
      sortBy: localSortBy,
    });
    onClose();
  };

  const handleResetClick = () => {
    setLocalCategories([]);
    setLocalStatusActive(null);
    setLocalSortBy("terbaru");
    onReset();
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-2xl p-6 select-none animate-in fade-in zoom-in-95 duration-150 text-gray-200",
        className
      )}
    >
      {/* 1. Header with Title & Dismiss Button */}
      <div className="flex items-center justify-between pb-4 border-b border-deep-blue-700">
        <h3 className="text-base font-semibold text-white">Filter & Sort</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Filter"
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 space-y-6">
        {/* 2. CATEGORY Section */}
        <div className="space-y-3">
          <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            CATEGORY
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = localCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-label-xs font-medium transition-all duration-150 border cursor-pointer",
                    isSelected
                      ? "bg-[#1E202B] text-white border-gray-400 shadow-sm"
                      : "bg-deep-blue-900 text-gray-300 border-deep-blue-700 hover:border-gray-500 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. STATUS Section */}
        <div className="space-y-3">
          <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            STATUS
          </label>
          <div>
            <button
              type="button"
              onClick={() =>
                setLocalStatusActive(localStatusActive === true ? null : true)
              }
              className="inline-flex items-center gap-2 text-label-xs font-medium text-gray-200 hover:text-white cursor-pointer select-none"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                  localStatusActive === true
                    ? "border-gray-300 bg-[#1E202B]"
                    : "border-deep-blue-700 bg-transparent"
                )}
              >
                {localStatusActive === true && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span>Active</span>
            </button>
          </div>
        </div>

        {/* 4. SORT BY Section */}
        <div className="space-y-3">
          <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            SORT BY
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLocalSortBy("terbaru")}
              className={cn(
                "py-2 px-3 rounded-lg text-label-xs font-medium transition-all border cursor-pointer text-center",
                localSortBy === "terbaru"
                  ? "bg-[#1E202B] text-white border-gray-400 font-semibold"
                  : "bg-deep-blue-900 text-gray-300 border-deep-blue-700 hover:text-white hover:border-gray-500"
              )}
            >
              Terbaru
            </button>
            <button
              type="button"
              onClick={() => setLocalSortBy("name_asc")}
              className={cn(
                "py-2 px-3 rounded-lg text-label-xs font-medium transition-all border cursor-pointer text-center",
                localSortBy === "name_asc"
                  ? "bg-[#1E202B] text-white border-gray-400 font-semibold"
                  : "bg-deep-blue-900 text-gray-300 border-deep-blue-700 hover:text-white hover:border-gray-500"
              )}
            >
              Nama (A - Z)
            </button>
          </div>
        </div>
      </div>

      {/* 6. Footer Buttons */}
      <div className="pt-4 border-t border-deep-blue-700 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleResetClick}
          className="px-4 py-2 rounded-lg bg-[#1E202B] hover:bg-[#252837] border border-deep-blue-700 text-label-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApplyClick}
          className="px-5 py-2 rounded-lg bg-gradient-primary text-white hover:brightness-110 active:scale-98 text-label-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
