import * as React from "react";
import Head from "next/head";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  ProductCard,
  FilterModal,
  EmptyState,
  Pagination,
} from "@/components/ui";

// Search Icon
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M16.102 17.162C14.5177 18.4737 12.4892 19.1248 10.4375 18.9802C8.3858 18.8356 6.46864 17.9063 5.08408 16.3853C3.69952 14.8644 2.95396 12.8686 3.0022 10.8124C3.05045 8.75615 3.88879 6.79751 5.34315 5.34315C6.79751 3.88879 8.75615 3.05045 10.8124 3.0022C12.8686 2.95396 14.8644 3.69952 16.3853 5.08408C17.9063 6.46864 18.8356 8.3858 18.9802 10.4375C19.1248 12.4892 18.4737 14.5177 17.162 16.102L21.78 20.72C21.8537 20.7886 21.9128 20.8714 21.9538 20.9634C21.9947 21.0554 22.0168 21.1547 22.0186 21.2555C22.0203 21.3562 22.0018 21.4562 21.9641 21.5496C21.9264 21.643 21.8702 21.7278 21.799 21.799C21.7278 21.8702 21.643 21.9264 21.5496 21.9641C21.4562 22.0018 21.3562 22.0203 21.2555 22.0186C21.1547 22.0168 21.0554 21.9947 20.9634 21.9538C20.8714 21.9128 20.7886 21.8537 20.72 21.78L16.102 17.162ZM17.5 11C17.5 9.27607 16.8152 7.62277 15.5962 6.40378C14.3772 5.18479 12.7239 4.49997 11 4.49997C9.27607 4.49997 7.62277 5.18479 6.40378 6.40378C5.18479 7.62277 4.49997 9.27607 4.49997 11C4.49997 12.7239 5.18479 14.3772 6.40378 15.5962C7.62277 16.8152 9.27607 17.5 11 17.5C12.7239 17.5 14.3772 16.8152 15.5962 15.5962C16.8152 14.3772 17.5 12.7239 17.5 11Z"
      fill="currentColor"
    />
  </svg>
);

// Filter Funnel / Settings Icon
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
      d="M3 4.5C3 4.08579 3.33579 3.75 3.75 3.75H20.25C20.6642 3.75 21 4.08579 21 4.5C21 4.91421 20.6642 5.25 20.25 5.25H3.75C3.33579 5.25 3 4.91421 3 4.5ZM6 12C6 11.5858 6.33579 11.25 6.75 11.25H17.25C17.6642 11.25 18 11.5858 18 12C18 12.4142 17.6642 12.75 17.25 12.75H6.75C6.33579 12.75 6 12.4142 6 12ZM9.75 18.75C9.33579 18.75 9 19.0858 9 19.5C9 19.9142 9.33579 20.25 9.75 20.25H14.25C14.6642 20.25 15 19.9142 15 19.5C15 19.0858 14.6642 18.75 14.25 18.75H9.75Z"
      fill="currentColor"
    />
  </svg>
);

// Dismiss / Cross Icon
const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 shrink-0"
    {...props}
  >
    <path
      d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface LibraryGame {
  id: string;
  steamAppId: number;
  title: string;
  imageSrc: string;
  genres: string[];
  platform?: string;
  launcher?: string;
  originalPrice?: string;
  price?: string;
  discount?: string;
  isPreorder?: boolean;
  state?: string;
}

// 16 Owned Library Games matching Screenshot 1 exactly
export const OWNED_LIBRARY_GAMES: LibraryGame[] = [
  {
    id: "lib-1",
    steamAppId: 242050,
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 313.500",
    price: "Rp 219.500",
    discount: "-30%",
  },
  {
    id: "lib-2",
    steamAppId: 1091500,
    title: "007 - First Light",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 313.500",
    price: "Rp 219.500",
    discount: "-30%",
    isPreorder: true,
    state: "pre-order",
  },
  {
    id: "lib-3",
    steamAppId: 2582560,
    title: "EA SPORTS CF™ 27 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    platform: "EA",
    launcher: "EA",
    originalPrice: "Rp 759.000",
    price: "Rp 683.100",
    discount: "-10%",
  },
  {
    id: "lib-4",
    steamAppId: 1962700,
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 249.000",
    price: "Rp 211.650",
    discount: "-15%",
  },
  {
    id: "lib-5",
    steamAppId: 2195250,
    title: "EA SPORTS FC™ 26 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    platform: "EA",
    launcher: "EA",
    originalPrice: "Rp 759.000",
    price: "Rp 607.200",
    discount: "-20%",
  },
  {
    id: "lib-6",
    steamAppId: 381210,
    title: "Dead by Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Horror"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 150.000",
    price: "Rp 75.000",
    discount: "-50%",
  },
  {
    id: "lib-7",
    steamAppId: 2215430,
    title: "Phantom Blade",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "RPG"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 400.000",
    price: "Rp 320.000",
    discount: "-20%",
  },
  {
    id: "lib-8",
    steamAppId: 271590,
    title: "Grand Thief Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 400.000",
    price: "Rp 200.000",
    discount: "-50%",
  },
  {
    id: "lib-9",
    steamAppId: 1174180,
    title: "Read Dead Redemption II",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 640.000",
    price: "Rp 211.200",
    discount: "-67%",
  },
  {
    id: "lib-10",
    steamAppId: 4197610,
    title: "Vanakan",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4197610/caad28198a0aa74f908b0efead31904113c32e3f/hero_capsule_2x.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 120.000",
    price: "Rp 96.000",
    discount: "-20%",
  },
  {
    id: "lib-11",
    steamAppId: 344850,
    title: "Pharmacy Simulator: Big Pharma",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/344850/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Casual"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 115.000",
    price: "Rp 57.500",
    discount: "-50%",
  },
  {
    id: "lib-12",
    steamAppId: 1245620,
    title: "Learning on Demand Racing",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 180.000",
    price: "Rp 126.000",
    discount: "-30%",
  },
  {
    id: "lib-13",
    steamAppId: 686810,
    title: "Hell Let Loose: Vietnam",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/686810/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Multiplayer"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 350.000",
    price: "Rp 245.000",
    discount: "-30%",
  },
  {
    id: "lib-14",
    steamAppId: 203350,
    title: "The Lord of the Rings: War in the North™ - Legacy Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/203350/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "RPG"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 135.000",
    price: "Rp 67.500",
    discount: "-50%",
  },
  {
    id: "lib-15",
    steamAppId: 2582560,
    title: "EA SPORTS™ Madden NFL 27",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    platform: "EA",
    launcher: "EA",
    originalPrice: "Rp 759.000",
    price: "Rp 683.100",
    discount: "-10%",
  },
  {
    id: "lib-16",
    steamAppId: 990080,
    title: "Earthworm Jim",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Casual"],
    platform: "Steam",
    launcher: "Steam",
    originalPrice: "Rp 90.000",
    price: "Rp 45.000",
    discount: "-50%",
  },
];

export default function GameLibraryPage() {
  // Search State
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Filter Modal & Applied Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);

  // Modal Internal Draft Selection
  const [modalCategories, setModalCategories] = React.useState<string[]>([]);
  const [modalGenres, setModalGenres] = React.useState<string[]>([]);
  const [modalLaunchers, setModalLaunchers] = React.useState<string[]>([]);
  const [modalPriceRange, setModalPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [modalSort, setModalSort] = React.useState<string>("Terbaru");

  // Applied Filters (Actively affecting view)
  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  const [appliedGenres, setAppliedGenres] = React.useState<string[]>([]);
  const [appliedLaunchers, setAppliedLaunchers] = React.useState<string[]>([]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  // Pagination State (25 total pages as per mockup)
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const totalPages = 25;

  // Logged-in Customer User Profile (for Private Navbar)
  const currentUser = {
    name: "Dyven Siauw",
    email: "dyven@gamezygo.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
  };

  // Handlers for active filter badges
  const handleRemoveGenre = (genreToRemove: string) => {
    setAppliedGenres((prev) => prev.filter((g) => g !== genreToRemove));
    setModalGenres((prev) => prev.filter((g) => g !== genreToRemove));
  };

  const handleRemoveLauncher = (launcherToRemove: string) => {
    setAppliedLaunchers((prev) => prev.filter((l) => l !== launcherToRemove));
    setModalLaunchers((prev) => prev.filter((l) => l !== launcherToRemove));
  };

  const handleClearAllFilters = () => {
    setAppliedGenres([]);
    setAppliedCategories([]);
    setAppliedLaunchers([]);
    setAppliedSort("Terbaru");
    setModalGenres([]);
    setModalCategories([]);
    setModalLaunchers([]);
    setModalSort("Terbaru");
    setModalPriceRange([0, 200000]);
    setCurrentPage(1);
  };

  // Filter and Search Evaluation
  const isSearchActive = searchQuery.trim().length > 0;
  const isFilterActive =
    appliedGenres.length > 0 ||
    appliedCategories.length > 0 ||
    appliedLaunchers.length > 0;

  const filteredGames = React.useMemo(() => {
    let list = [...OWNED_LIBRARY_GAMES];

    // 1. Search Query Matching (Supports tolerant searches e.g. "Grand Thief Auto", "GTA")
    if (isSearchActive) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((game) => {
        const titleLower = game.title.toLowerCase();
        if (titleLower.includes(q)) return true;
        if (q.includes("gta") && titleLower.includes("grand")) return true;
        if (q.includes("grand") && titleLower.includes("grand")) return true;
        return false;
      });
    }

    // 2. Genre Matching
    if (appliedGenres.length > 0) {
      list = list.filter((game) =>
        appliedGenres.some((genre) => game.genres.includes(genre))
      );
    }

    // 3. Launcher Matching
    if (appliedLaunchers.length > 0) {
      list = list.filter((game) =>
        appliedLaunchers.includes(game.launcher || "Steam")
      );
    }

    // 4. Sorting
    if (appliedSort === "Nama (A - Z)") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [isSearchActive, searchQuery, appliedGenres, appliedLaunchers, appliedSort]);

  return (
    <>
      <Head>
        <title>Perpustakaan Game - Gamezygo</title>
        <meta
          name="description"
          content="Koleksi dan daftar pustaka game yang telah Anda miliki di Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant="private"
        activeSidebarId="perpustakaan"
        user={currentUser}
        onCartClick={() => alert("Membuka keranjang belanja")}
      >
        <div className="flex flex-col gap-8 w-full">
          {/* ========================================================
              SECTION HEADER WITH DYNAMIC STATES
              State 1: Default ("Tampilkan: Semua" + Search + Filter)
              State 2: Filtered ("Tampilkan: [Action ×] [Adventure ×] ... Hapus semua" + Search + Filter)
              State 3: Searched (Cari "Grand Thief Auto V" + Search + Filter)
             ======================================================== */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
            {/* Header Kiri: Dinamis tergantung status Search & Filter */}
            <div className="min-w-0 flex items-center">
              {isSearchActive ? (
                /* STATE 3: SEARCHED STATE (Screenshot 4) */
                <h3 className="text-h3 font-semibold text-gray-50 tracking-normal truncate">
                  Cari &quot;{searchQuery}&quot;
                </h3>
              ) : isFilterActive ? (
                /* STATE 2: FILTER APPLIED STATE (Screenshot 3) */
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="text-body-md font-semibold text-gray-300 mr-1">
                    Tampilkan:
                  </span>

                  {appliedGenres.map((genre) => (
                    <Button
                      key={genre}
                      type="button"
                      variant="secondary"
                      size="sm"
                      rightIcon={<CrossIcon />}
                      onClick={() => handleRemoveGenre(genre)}
                      className="cursor-pointer"
                    >
                      {genre}
                    </Button>
                  ))}

                  {appliedLaunchers.map((launcher) => (
                    <Button
                      key={launcher}
                      type="button"
                      variant="secondary"
                      size="sm"
                      rightIcon={<CrossIcon />}
                      onClick={() => handleRemoveLauncher(launcher)}
                      className="cursor-pointer"
                    >
                      {launcher}
                    </Button>
                  ))}

                  <Button
                    type="button"
                    variant="inactive"
                    size="sm"
                    onClick={handleClearAllFilters}
                    className="cursor-pointer text-gray-400 hover:text-gray-50"
                  >
                    Hapus semua
                  </Button>
                </div>
              ) : (
                /* STATE 1: DEFAULT STATE (Screenshot 1) */
                <div className="flex items-center gap-2">
                  <span className="text-body-md font-normal text-gray-300">
                    Tampilkan:
                  </span>
                  <span className="text-body-md font-bold text-gray-50">
                    Semua
                  </span>
                </div>
              )}
            </div>

            {/* Header Kanan: Search Input Box + Tombol Filter + Dropdown Popover */}
            <div className="relative flex items-center gap-3 shrink-0 self-end sm:self-auto">
              {/* Search Bar Input */}
              <div className="relative flex items-center bg-deep-blue-950 border border-gradient-secondary rounded-lg px-3.5 py-2.5 h-10 w-60 sm:w-64 md:w-80 gap-2.5 focus-within:border-deep-blue-100/40 transition-colors">
                <SearchIcon className="w-4 h-4 text-deep-blue-100 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari"
                  className="w-full bg-transparent text-label-sm text-gray-50 placeholder:text-gray-400 outline-none tracking-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-deep-blue-100 hover:text-gray-50 shrink-0 cursor-pointer outline-none"
                    aria-label="Hapus pencarian"
                  >
                    <CrossIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tombol Filter Trigger */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                onClick={() => setIsFilterModalOpen((prev) => !prev)}
                aria-label="Buka Filter & Sort"
              >
                <FilterIcon className="w-4 h-4 text-deep-blue-100" />
              </Button>

              {/* ========================================================
                  FILTER & SORT DROPDOWN (Persis seperti di Home Page)
                 ======================================================== */}
              <FilterModal
                isOpen={isFilterModalOpen}
                variant="dropdown"
                placement="content"
                onClose={() => setIsFilterModalOpen(false)}
                className="sm:top-12 sm:right-0 lg:right-0"
                selectedCategories={modalCategories}
                onToggleCategory={(category) => {
                  setModalCategories((prev) =>
                    prev.includes(category)
                      ? prev.filter((c) => c !== category)
                      : [...prev, category]
                  );
                }}
                selectedGenres={modalGenres}
                onToggleGenre={(genre) => {
                  setModalGenres((prev) =>
                    prev.includes(genre)
                      ? prev.filter((g) => g !== genre)
                      : [...prev, genre]
                  );
                }}
                selectedLaunchers={modalLaunchers}
                onToggleLauncher={(launcher) => {
                  setModalLaunchers((prev) =>
                    prev.includes(launcher)
                      ? prev.filter((l) => l !== launcher)
                      : [...prev, launcher]
                  );
                }}
                priceRange={modalPriceRange}
                onPriceRangeChange={setModalPriceRange}
                selectedSort={modalSort}
                onSelectSort={setModalSort}
                onReset={() => {
                  handleClearAllFilters();
                  setIsFilterModalOpen(false);
                }}
                onApply={() => {
                  setAppliedCategories(modalCategories);
                  setAppliedGenres(modalGenres);
                  setAppliedLaunchers(modalLaunchers);
                  setAppliedSort(modalSort);
                  setCurrentPage(1);
                  setIsFilterModalOpen(false);
                }}
              />
            </div>
          </div>

          {/* ========================================================
              GAME CARDS GRID ATAU EMPTY STATE
             ======================================================== */}
          {filteredGames.length > 0 ? (
            /* 4-COLUMN RESPONSIVE GAME GRID (Screenshot 1, 3, 4 Kiri) */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredGames.map((game) => (
                <ProductCard
                  key={game.id}
                  orientation="vertical"
                  title={game.title}
                  imageSrc={game.imageSrc}
                  genres={game.genres}
                  platform={game.platform}
                  showPrice={false}
                  showActionButton={false}
                  href={`/credentials/${game.id}`}
                  className="hover:-translate-y-0.5 transition-transform duration-200 pb-8xl cursor-pointer"
                />
              ))}
            </div>
          ) : (
            /* SEARCHED - EMPTY STATE (Screenshot 4 Kanan) */
            <div className="py-20 flex items-center justify-center w-full">
              <EmptyState
                title="Ups!... Hasil tidak ditemukan"
                description="Coba cari hal lain!"
                backLabel="Kembali"
                searchLabel="Search"
                onBack={() => {
                  setSearchQuery("");
                  handleClearAllFilters();
                }}
                onSearch={() => {
                  setSearchQuery("");
                  handleClearAllFilters();
                }}
              />
            </div>
          )}

          {/* ========================================================
              PAGINATION (< 1 2 3 4 5 ... 25 >)
             ======================================================== */}
          {filteredGames.length > 0 && (
            <div className="flex justify-center pt-8 sm:pt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>


      </StoreLayout>
    </>
  );
}