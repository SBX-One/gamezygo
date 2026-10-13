import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import type { AdminArticleFilterState } from "../../types/admin-article.types";

export interface AdminArticlesFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdminArticleFilterState;
  onApply: (newFilters: AdminArticleFilterState) => void;
  onReset: () => void;
  className?: string;
}

const CATEGORY_TAGS = [
  "Tutorials",
  "Review & Recommendations",
  "Game Guides",
  "News & Update",
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

export function AdminArticlesFilterPopover({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  className,
}: AdminArticlesFilterPopoverProps) {
  // Local state initialized directly from filters
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    filters.categories || []
  );
  const [searchTag, setSearchTag] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(filters.isPublished);
  const [isUnpublished, setIsUnpublished] = React.useState(filters.isUnpublished);
  const [isDraft, setIsDraft] = React.useState(filters.isDraft);
  const [priceMin, setPriceMin] = React.useState(filters.priceRange?.[0] ?? 0);
  const [priceMax, setPriceMax] = React.useState(filters.priceRange?.[1] ?? 200000);
  const [sortBy, setSortBy] = React.useState<"terbaru" | "name_asc">(
    filters.sortBy || "terbaru"
  );

  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Sync state whenever popover opens or filters prop changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedCategories(filters.categories || []);
      setIsPublished(filters.isPublished);
      setIsUnpublished(filters.isUnpublished);
      setIsDraft(filters.isDraft);
      setPriceMin(filters.priceRange?.[0] ?? 0);
      setPriceMax(filters.priceRange?.[1] ?? 200000);
      setSortBy(filters.sortBy || "terbaru");
    }
  }, [isOpen, filters]);

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
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const filteredTags = CATEGORY_TAGS.filter((tag) =>
    tag.toLowerCase().includes(searchTag.toLowerCase())
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), priceMax - 10000);
    setPriceMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), priceMin + 10000);
    setPriceMax(value);
  };

  const minPercent = Math.min(100, Math.max(0, (priceMin / 200000) * 100));
  const maxPercent = Math.min(100, Math.max(0, (priceMax / 200000) * 100));

  const handleApplyClick = () => {
    onApply({
      ...filters,
      categories: selectedCategories,
      isPublished,
      isUnpublished,
      isDraft,
      priceRange: [priceMin, priceMax],
      sortBy,
    });
    onClose();
  };

  const handleResetClick = () => {
    setSelectedCategories([]);
    setSearchTag("");
    setIsPublished(false);
    setIsUnpublished(false);
    setIsDraft(false);
    setPriceMin(0);
    setPriceMax(200000);
    setSortBy("terbaru");
    onReset();
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-lg bg-[#13151F] border border-white/10 p-6 select-none animate-in fade-in zoom-in-95 duration-150 text-gray-200 shadow-none",
        className
      )}
    >
      {/* 1. Header with Title & Dismiss Button (Matching Image 3) */}
      <div className="flex items-center justify-between pb-4 border-b border-[#232634]">
        <h3 className="text-base font-semibold text-white">Filter & Sort</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Filter"
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 space-y-5">
        {/* 2. CATEGORY Section (Matching Image 3) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            CATEGORY
          </label>
          <input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            placeholder="Search tags..."
            className="w-full h-9 px-3 bg-[#181A26] border border-[#232634] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {filteredTags.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border cursor-pointer",
                    isSelected
                      ? "bg-[#1E202B] text-white border-gray-400"
                      : "bg-deep-blue-900 text-gray-300 border-[#232634] hover:border-gray-500 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. STATUS Section (Matching Image 3 - Vertically Stacked Column) */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            STATUS
          </label>
          <div className="flex flex-col gap-3">
            <AdminCheckbox
              label="Published"
              checked={isPublished}
              onChange={setIsPublished}
              className="w-fit cursor-pointer"
            />
            <AdminCheckbox
              label="Unpublished"
              checked={isUnpublished}
              onChange={setIsUnpublished}
              className="w-fit cursor-pointer"
            />
            <AdminCheckbox
              label="Draft"
              checked={isDraft}
              onChange={setIsDraft}
              className="w-fit cursor-pointer"
            />
          </div>
        </div>

        {/* 4. PRICE RANGE Section (Matching Image 3 - Dual Slider Track) */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            PRICE RANGE
          </label>
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span>RP {priceMin.toLocaleString("id-ID")}</span>
            <span>RP {priceMax.toLocaleString("id-ID")}</span>
          </div>

          {/* Dual Slider Interactive Component */}
          <div className="relative h-6 flex items-center select-none pt-1">
            {/* Dark background track */}
            <div className="absolute inset-x-0 h-1 bg-[#232634] rounded-full pointer-events-none" />

            {/* Red active track connecting the two thumbs */}
            <div
              className="absolute h-1 bg-[#DF3848] rounded-full pointer-events-none"
              style={{
                left: `${minPercent}%`,
                width: `${Math.max(0, maxPercent - minPercent)}%`,
              }}
            />

            {/* Min Price Slider Input */}
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={priceMin}
              onChange={handleMinChange}
              aria-label="Harga Minimum"
              className="absolute inset-x-0 w-full h-1 appearance-none bg-transparent pointer-events-none z-10 cursor-pointer
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[#DF3848]
                [&::-webkit-slider-thumb]:border-none
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:pointer-events-auto
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-[#DF3848]
                [&::-moz-range-thumb]:border-none
                [&::-moz-range-thumb]:cursor-pointer"
            />

            {/* Max Price Slider Input */}
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={priceMax}
              onChange={handleMaxChange}
              aria-label="Harga Maksimum"
              className="absolute inset-x-0 w-full h-1 appearance-none bg-transparent pointer-events-none z-20 cursor-pointer
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[#DF3848]
                [&::-webkit-slider-thumb]:border-none
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:pointer-events-auto
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-[#DF3848]
                [&::-moz-range-thumb]:border-none
                [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
        </div>

        {/* 5. SORT BY Section (Matching Image 3) */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            SORT BY
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSortBy("terbaru")}
              className={cn(
                "h-9 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                sortBy === "terbaru"
                  ? "bg-[#1E202B] border-gray-400 text-white font-semibold"
                  : "bg-deep-blue-900 border-[#232634] text-gray-400 hover:text-white hover:border-gray-500"
              )}
            >
              Terbaru
            </button>
            <button
              type="button"
              onClick={() => setSortBy("name_asc")}
              className={cn(
                "h-9 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                sortBy === "name_asc"
                  ? "bg-[#1E202B] border-gray-400 text-white font-semibold"
                  : "bg-deep-blue-900 border-[#232634] text-gray-400 hover:text-white hover:border-gray-500"
              )}
            >
              Nama (A - Z)
            </button>
          </div>
        </div>

        {/* 6. Footer Buttons: Reset & Apply (Matching Image 3) */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232634]">
          <button
            type="button"
            onClick={handleResetClick}
            className="px-5 py-2 rounded-lg bg-[#191B26] hover:bg-[#222533] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApplyClick}
            className="px-6 py-2 rounded-lg bg-linear-to-r from-[#DF3848] to-[#FF5364] hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
