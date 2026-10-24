import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  CloseXIcon,
  SearchIcon,
  PlusIcon,
  BookCatalogIcon,
  GamepadIcon,
} from "../catalog/section/AdminSectionIcons";
import type { SectionProduct } from "../../types/admin-section.types";

export interface AdminEditSubscriptionGamesModalProps {
  isOpen: boolean;
  initialAddedGames: SectionProduct[];
  subsWorth?: string;
  totalGamesCount?: number;
  onClose: () => void;
  onSave: (updatedGames: SectionProduct[]) => void;
  className?: string;
}

// Sample pool of available games for the catalog
const DEFAULT_AVAILABLE_GAMES: SectionProduct[] = [
  {
    id: "gta-v-subs-1",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Open World"],
    price: 350000,
  },
  {
    id: "gta-v-subs-2",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Open World"],
    price: 350000,
  },
  {
    id: "gta-v-subs-3",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Open World"],
    price: 350000,
  },
  {
    id: "fc-26-subs-1",
    title: "EA Sports FC 26",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    categories: ["Sports"],
    price: 450000,
  },
  {
    id: "subnautica-subs-1",
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    categories: ["Adventure"],
    price: 219500,
  },
];

export function AdminEditSubscriptionGamesModal({
  isOpen,
  initialAddedGames,
  subsWorth = "IDR 120.000",
  totalGamesCount = 200,
  onClose,
  onSave,
  className,
}: AdminEditSubscriptionGamesModalProps) {
  const [addedGames, setAddedGames] = React.useState<SectionProduct[]>([]);
  const [availableGames, setAvailableGames] = React.useState<SectionProduct[]>(
    []
  );

  const [addedSearch, setAddedSearch] = React.useState("");
  const [availableSearch, setAvailableSearch] = React.useState("");

  // Sync state on modal open
  React.useEffect(() => {
    if (isOpen) {
      setAddedGames(initialAddedGames);
      // Available games: pool minus existing
      const addedIds = initialAddedGames.map((g) => g.id);
      const filteredPool = DEFAULT_AVAILABLE_GAMES.filter(
        (g) => !addedIds.includes(g.id)
      );
      setAvailableGames(
        filteredPool.length > 0 ? filteredPool : DEFAULT_AVAILABLE_GAMES
      );
      setAddedSearch("");
      setAvailableSearch("");
    }
  }, [isOpen, initialAddedGames]);

  // Handle escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
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

  // Add game from right to left
  const handleAddGame = (game: SectionProduct) => {
    setAddedGames((prev) => [...prev, game]);
    setAvailableGames((prev) => prev.filter((g) => g.id !== game.id));
  };

  // Remove game from left to right
  const handleRemoveGame = (game: SectionProduct) => {
    setAddedGames((prev) => prev.filter((g) => g.id !== game.id));
    setAvailableGames((prev) => [game, ...prev]);
  };

  // Filter lists by search query
  const filteredAdded = addedGames.filter((g) =>
    g.title.toLowerCase().includes(addedSearch.trim().toLowerCase())
  );

  const filteredAvailable = availableGames.filter((g) =>
    g.title.toLowerCase().includes(availableSearch.trim().toLowerCase())
  );

  const handleSave = () => {
    onSave(addedGames);
    onClose();
  };

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
          "w-[860px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-2xl select-none animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]",
          className
        )}
      >
        {/* Header (Matching Image 4 & Image 5) */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-deep-blue-700 bg-deep-blue-950 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight">
            Edit Subscription Games
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Sub-bar: Stats Box (Matching Image 4 & Image 5) */}
          <div className="flex items-center justify-between p-3.5 bg-deep-blue-900/50 border border-deep-blue-700 rounded-lg">
            <div className="flex items-center gap-2 pl-2">
              <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
                SUBS WORTH :
              </span>
              <span className="text-label-xs sm:text-sm font-bold text-gray-50">
                {subsWorth}
              </span>
            </div>

            <div className="w-px h-5 bg-deep-blue-700" />

            <div className="flex items-center gap-2 pr-2">
              <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
                TOTAL GAMES :
              </span>
              <span className="text-label-xs sm:text-sm font-bold text-gray-50">
                {totalGamesCount} Games
              </span>
            </div>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: GAME YANG DITAMBAHKAN */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                GAME YANG DITAMBAHKAN
              </h4>

              {/* Search + Clear Row */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center bg-deep-blue-900 border border-deep-blue-700 focus-within:border-deep-blue-500 rounded-lg px-3 py-2 flex-1 transition-colors">
                  <SearchIcon className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={addedSearch}
                    onChange={(e) => setAddedSearch(e.target.value)}
                    placeholder="Cari game"
                    className="w-full bg-transparent text-gray-50 text-label-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
                  />
                  {addedSearch && (
                    <button
                      type="button"
                      onClick={() => setAddedSearch("")}
                      className="p-0.5 text-gray-400 hover:text-gray-50 shrink-0"
                    >
                      <CloseXIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAddedSearch("")}
                  className="px-3.5 py-2 rounded-lg border border-deep-blue-700 bg-deep-blue-900 hover:bg-deep-blue-850 text-label-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* List or Empty State */}
              <div className="min-h-[260px] max-h-[320px] overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                {filteredAdded.length > 0 ? (
                  filteredAdded.map((game, idx) => (
                    <div
                      key={`added-${game.id}-${idx}`}
                      className="rounded-lg bg-deep-blue-900 border border-deep-blue-700/80 p-2.5 flex items-center justify-between gap-3 hover:border-deep-blue-600 transition-colors"
                    >
                      {/* Left: Poster + Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-14 rounded-lg overflow-hidden relative shrink-0 bg-deep-blue-950 border border-deep-blue-700/60">
                          <Image
                            src={game.imageSrc}
                            alt={game.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h5 className="text-label-xs sm:text-sm font-bold text-gray-50 truncate">
                            {game.title}
                          </h5>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-deep-blue-800 text-gray-300 border border-deep-blue-700">
                              1 Bulan
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-deep-blue-800 text-gray-300 border border-deep-blue-700">
                              Tier I
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGame(game)}
                        className="px-3 py-1.5 rounded-lg border border-deep-blue-700 bg-deep-blue-950 hover:bg-deep-blue-850 text-gray-300 hover:text-rose-300 text-label-xs font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  /* Empty State (Matching Image 5) */
                  <div className="h-[260px] flex flex-col items-center justify-center p-6 text-center rounded-lg bg-deep-blue-900/20 border border-dashed border-deep-blue-700/60">
                    <div className="w-14 h-14 rounded-lg bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-400 mb-3 shadow-md">
                      <BookCatalogIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <h5 className="text-sm font-bold text-gray-100">
                      Belum Ada Ditambahkan
                    </h5>
                    <p className="text-label-xs text-gray-400 mt-1 max-w-[220px]">
                      Katalog Subscription Anda saat ini masih kosong.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: GAME YANG TERSEDIA */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                GAME YANG TERSEDIA
              </h4>

              {/* Search + Clear Row */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center bg-deep-blue-900 border border-deep-blue-700 focus-within:border-deep-blue-500 rounded-lg px-3 py-2 flex-1 transition-colors">
                  <SearchIcon className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={availableSearch}
                    onChange={(e) => setAvailableSearch(e.target.value)}
                    placeholder="Cari game"
                    className="w-full bg-transparent text-gray-50 text-label-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
                  />
                  {availableSearch && (
                    <button
                      type="button"
                      onClick={() => setAvailableSearch("")}
                      className="p-0.5 text-gray-400 hover:text-gray-50 shrink-0"
                    >
                      <CloseXIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAvailableSearch("")}
                  className="px-3.5 py-2 rounded-lg border border-deep-blue-700 bg-deep-blue-900 hover:bg-deep-blue-850 text-label-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* List or Empty State */}
              <div className="min-h-[260px] max-h-[320px] overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                {filteredAvailable.length > 0 ? (
                  filteredAvailable.map((game, idx) => (
                    <div
                      key={`avail-${game.id}-${idx}`}
                      className="rounded-lg bg-deep-blue-900 border border-deep-blue-700/80 p-2.5 flex items-center justify-between gap-3 hover:border-deep-blue-600 transition-colors"
                    >
                      {/* Left: Poster + Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-14 rounded-lg overflow-hidden relative shrink-0 bg-deep-blue-950 border border-deep-blue-700/60">
                          <Image
                            src={game.imageSrc}
                            alt={game.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h5 className="text-label-xs sm:text-sm font-bold text-gray-50 truncate">
                            {game.title}
                          </h5>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-deep-blue-800 text-gray-300 border border-deep-blue-700">
                              1 Bulan
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-deep-blue-800 text-gray-300 border border-deep-blue-700">
                              Tier I
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Add Button */}
                      <button
                        type="button"
                        onClick={() => handleAddGame(game)}
                        className="px-3.5 py-1.5 rounded-lg border border-deep-blue-700 bg-deep-blue-950 hover:bg-deep-blue-850 text-gray-300 hover:text-white text-label-xs font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  /* Empty State (Matching Image 5) */
                  <div className="h-[260px] flex flex-col items-center justify-center p-6 text-center rounded-lg bg-deep-blue-900/20 border border-dashed border-deep-blue-700/60">
                    <div className="w-14 h-14 rounded-lg bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-400 mb-3 shadow-md">
                      <GamepadIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <h5 className="text-sm font-bold text-gray-100">
                      Belum Ada Data Game
                    </h5>
                    <p className="text-label-xs text-gray-400 mt-1 max-w-[220px]">
                      Katalog toko Anda saat ini masih kosong.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAvailableGames(DEFAULT_AVAILABLE_GAMES)}
                      className="mt-4 px-4 py-2 rounded-lg border border-deep-blue-700 bg-deep-blue-900 hover:bg-deep-blue-850 text-label-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Tambah Produk</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Matching Image 4 & Image 5) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-deep-blue-700 bg-deep-blue-950 shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="cursor-pointer min-w-20 justify-center"
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
