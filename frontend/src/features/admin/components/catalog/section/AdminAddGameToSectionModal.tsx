import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import {
  CloseXIcon,
  SearchIcon,
  FilterTaperIcon,
  GamepadIcon,
} from "./AdminSectionIcons";
import { MOCK_CATALOG_TABLE_GAMES } from "../../../data/admin-section-mock-data";
import type { SectionProduct } from "../../../types/admin-section.types";

export interface AdminAddGameToSectionModalProps {
  isOpen: boolean;
  sectionTitle?: string;
  existingProductIds?: string[];
  onClose: () => void;
  onAddGames?: (games: SectionProduct[]) => void;
  onAddGame?: (game: SectionProduct) => void;
  className?: string;
}

export function AdminAddGameToSectionModal({
  isOpen,
  existingProductIds = [],
  onClose,
  onAddGames,
  onAddGame,
  className,
}: AdminAddGameToSectionModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedCategory("All");
      setIsFilterDropdownOpen(false);
      setSelectedIds([]);
    }
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter games based on search query and category
  const filteredGames = MOCK_CATALOG_TABLE_GAMES.filter((game) => {
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

  const isAllSelected =
    filteredGames.length > 0 &&
    filteredGames.every((game) => selectedIds.includes(game.id));

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = Array.from(
        new Set([...selectedIds, ...filteredGames.map((g) => g.id)])
      );
      setSelectedIds(allIds);
    } else {
      const filteredIdSet = new Set(filteredGames.map((g) => g.id));
      setSelectedIds(selectedIds.filter((id) => !filteredIdSet.has(id)));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    const selectedGames = MOCK_CATALOG_TABLE_GAMES.filter((g) =>
      selectedIds.includes(g.id)
    );

    if (onAddGames) {
      onAddGames(selectedGames);
    } else if (onAddGame && selectedGames.length > 0) {
      selectedGames.forEach((g) => onAddGame(g));
    }

    onClose();
  };

  const handleAddNewProduct = () => {
    onClose();
    router.push("/admin/catalog/add");
  };

  const categories = [
    "All",
    "Action",
    "Adventure",
    "Open World",
    "Crime",
    "Shooter",
    "RPG",
    "Sport-Racing",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-[840px] max-w-[95vw] rounded-2xl bg-deep-blue-950 border border-deep-blue-700 shadow-2xl select-none animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col",
          className
        )}
      >
        {/* 1. Modal Header (Screenshots 1, 2, 3: "Add Game" + ✕) */}
        <div className="flex items-center justify-between px-7 py-4.5 border-b border-deep-blue-700 bg-deep-blue-950">
          <h3 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight">
            Add Game
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-50 hover:bg-deep-blue-900 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <CloseXIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Search & Filter Bar (Screenshots 1, 2, 3) */}
        <div className="px-7 pt-5 pb-3">
          <div className="flex items-center gap-3">
            {/* Search Input Field */}
            <div className="relative flex-1 flex items-center bg-deep-blue-900 border border-deep-blue-700 focus-within:border-deep-blue-500 rounded-xl px-3.5 py-2.5 transition-colors">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari di toko"
                className="w-full bg-transparent text-gray-50 text-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
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
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              title="Filter Kategori"
              className={cn(
                "p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0",
                isFilterDropdownOpen || selectedCategory !== "All"
                  ? "bg-deep-blue-800 border-deep-blue-500 text-gray-50"
                  : "bg-deep-blue-900 border-deep-blue-700 text-gray-400 hover:text-gray-50 hover:bg-deep-blue-850"
              )}
            >
              <FilterTaperIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Category Filter Pills when filter button is toggled */}
          {isFilterDropdownOpen && (
            <div className="flex items-center gap-2 mt-3 pt-2 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0",
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
        </div>

        {/* 3. Table Card Panel (Matching Screenshots 1, 2, 3) */}
        <div className="mx-7 my-3 rounded-2xl bg-deep-blue-950 border border-deep-blue-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr] px-6 py-3.5 bg-deep-blue-900/70 border-b border-deep-blue-700 items-center select-none text-xs text-gray-300 font-semibold">
            {/* Col 1: Checkbox + Product Name */}
            <div className="flex items-center gap-3">
              <AdminCheckbox
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                id="select-all-header"
              />
              <label
                htmlFor="select-all-header"
                className="cursor-pointer font-semibold text-gray-300"
              >
                Product Name
              </label>
            </div>

            {/* Col 2: Category */}
            <div className="font-semibold text-gray-300">
              Category
            </div>

            {/* Col 3: Price */}
            <div className="font-semibold text-gray-300 text-right sm:text-left sm:pl-8">
              Price
            </div>
          </div>

          {/* Table Body */}
          {filteredGames.length > 0 ? (
            /* Populated Table Rows (Screenshots 1 & 3) */
            <div className="max-h-[380px] overflow-y-auto divide-y divide-deep-blue-700/60 scrollbar-none">
              {filteredGames.map((game) => {
                const isChecked = selectedIds.includes(game.id);

                return (
                  <div
                    key={game.id}
                    onClick={() => handleToggleRow(game.id)}
                    className={cn(
                      "grid grid-cols-[1.5fr_1fr_1fr] px-6 py-3.5 items-center transition-colors cursor-pointer select-none",
                      isChecked
                        ? "bg-deep-blue-900/40 hover:bg-deep-blue-900/60"
                        : "hover:bg-deep-blue-900/30"
                    )}
                  >
                    {/* Col 1: Checkbox + Thumbnail + Title */}
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <AdminCheckbox
                          checked={isChecked}
                          onChange={() => handleToggleRow(game.id)}
                        />
                      </div>
                      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden shrink-0 border border-deep-blue-700 bg-deep-blue-900">
                        <Image
                          src={game.imageSrc}
                          alt={game.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-50 truncate">
                        {game.title}
                      </span>
                    </div>

                    {/* Col 2: Category Pills (Action, Adventure, +2) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {game.categories.slice(0, 2).map((cat) => (
                        <Pill
                          key={cat}
                          variant="secondary"
                          size="xs"
                        >
                          {cat}
                        </Pill>
                      ))}
                      {game.categories.length > 2 && (
                        <Pill
                          variant="secondary"
                          size="xs"
                        >
                          +{game.categories.length - 2}
                        </Pill>
                      )}
                    </div>

                    {/* Col 3: Price */}
                    <div className="text-xs sm:text-sm font-semibold text-gray-50 text-right sm:text-left sm:pl-8">
                      Rp {(game.price || 480000).toLocaleString("id-ID")}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State (Matching Screenshot 2 exactly) */
            <div className="py-20 flex flex-col items-center justify-center text-center px-4 select-none">
              <div className="w-14 h-14 rounded-2xl bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-300 mb-4 shadow-inner">
                <GamepadIcon className="w-7 h-7 text-gray-300" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight">
                Belum Ada Data Game
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-[320px]">
                Katalog toko Anda saat ini masih kosong.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddNewProduct}
                className="mt-5 cursor-pointer"
              >
                + Tambah Produk
              </Button>
            </div>
          )}
        </div>

        {/* 4. Modal Footer (Screenshots 1, 2, 3: "Batalkan" & "Simpan") */}
        <div className="px-7 py-4 flex items-center justify-end gap-3 border-t border-deep-blue-700 bg-deep-blue-950">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="cursor-pointer min-w-24 justify-center"
          >
            Batalkan
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="cursor-pointer min-w-24 justify-center shadow-md"
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
