import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  SearchIcon,
  CloseXIcon,
  FilterTaperIcon,
  EditPencilIcon,
} from "../catalog/section/AdminSectionIcons";
import { AdminSectionGameCard } from "../catalog/section/AdminSectionGameCard";
import type { SectionProduct } from "../../types/admin-section.types";

export interface AdminSubscriptionGameListCardProps {
  totalGames: number;
  totalValue: string;
  games: SectionProduct[];
  onEditGameList: () => void;
  className?: string;
}

export function AdminSubscriptionGameListCard({
  totalGames,
  totalValue,
  games,
  onEditGameList,
  className,
}: AdminSubscriptionGameListCardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const filteredGames = games.filter((game) => {
    if (
      searchQuery.trim() &&
      !game.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      selectedCategory !== "All" &&
      !game.categories.includes(selectedCategory)
    ) {
      return false;
    }
    return true;
  });

  const categories = ["All", "Action", "Adventure", "Open World", "Sport-Racing"];

  return (
    <div
      className={cn(
        "rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-lg select-none overflow-hidden",
        className
      )}
    >
      {/* Top Section Header Bar (Matching Image 1) */}
      <div className="px-6 py-4.5 bg-deep-blue-900 border-b border-deep-blue-700">
        <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-widest">
          TOTAL LIST GAME
        </span>
      </div>

      {/* Main Card Content */}
      <div className="p-6 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Total Count & Value */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-50 tracking-tight">
              {totalGames} Games
            </h2>
            <p className="text-label-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
              VALUE : {totalValue}
            </p>
          </div>

          {/* Right: Search, Filter, and Edit Buttons (Matching Image 1) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex items-center bg-deep-blue-900 border border-deep-blue-700 focus-within:border-deep-blue-500 rounded-lg px-3.5 py-2 w-48 sm:w-64 transition-colors">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari di toko"
                className="w-full bg-transparent text-gray-50 text-label-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 text-gray-400 hover:text-gray-50 transition-colors cursor-pointer shrink-0"
                >
                  <CloseXIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title="Filter"
              className={cn(
                "p-2.5 rounded-lg border transition-colors cursor-pointer shrink-0",
                isFilterOpen || selectedCategory !== "All"
                  ? "bg-deep-blue-800 border-deep-blue-500 text-gray-50"
                  : "bg-deep-blue-900 border-deep-blue-700 text-gray-400 hover:text-gray-50 hover:bg-deep-blue-850"
              )}
            >
              <FilterTaperIcon className="w-4 h-4" />
            </button>

            {/* Edit Button (Image 1: variant outline, size sm, left icon pencil) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<EditPencilIcon className="w-3.5 h-3.5" />}
              onClick={onEditGameList}
              className="gap-2"
            >
              Edit
            </Button>
          </div>
        </div>

        {/* Category Pills if filter is toggled */}
        {isFilterOpen && (
          <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-label-xs font-medium transition-colors cursor-pointer shrink-0",
                  selectedCategory === cat
                    ? "bg-deep-blue-800 text-gray-50 font-semibold border border-deep-blue-500"
                    : "bg-deep-blue-900 hover:bg-deep-blue-850 text-gray-400 hover:text-gray-50 border border-deep-blue-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Horizontal Divider Line (Matching Image 1) */}
        <div className="w-full h-px bg-deep-blue-700" />

        {/* Horizontal Game Cards Row (Image 3) */}
        <div className="flex items-start gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {filteredGames.map((game, idx) => (
            <AdminSectionGameCard
              key={`${game.id}-${idx}`}
              product={game}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
