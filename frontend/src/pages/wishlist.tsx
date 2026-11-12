import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  ProductCard,
  ProductCardSkeleton,
  FilterModal,
  EmptyState,
  Toast,
  FilterBadgeSwiper,
} from "@/components/ui";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { useOwnedGames } from "@/hooks/use-library";
import { useAddToCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

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
      d="M3 4.5C3 4.08579 3.33579 3.75 3.75 3.75H20.25C20.6642 3.75 21 4.08579 21 4.5C21 4.91421 20.6642 5.25 20.25 5.25H3.75C3.33579 5.25 3 4.91421 3 4.5ZM6 12C6 11.5858 6.33579 11.25 6.75 11.25H17.25C17.6642 11.25 18 11.5858 18 12C18 12.4142 17.6642 12.75 17.25 12.75H6.75C6.33579 12.75 6 12.4142 6 12ZM9.75 18.75C9.33579 18.75 9 19.0858 9 19.5C9 19.9142 9 19.5 9 19.5C9 19.9142 15 19.9142 15 19.5C15 19.0858 14.6642 18.75 14.25 18.75H9.75Z"
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

// Bookmark Icon for Wishlist Empty State (matches Screenshot 2)
const BookmarkOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-gray-50"
    {...props}
  >
    <path
      d="M6.18993 21.855C6.07781 21.9354 5.9457 21.9833 5.80812 21.9934C5.67054 22.0036 5.53282 21.9756 5.41012 21.9125C5.28742 21.8495 5.18449 21.7538 5.11265 21.636C5.04081 21.5183 5.00284 21.383 5.00293 21.245V6.25C5.00293 5.38805 5.34534 4.5614 5.95483 3.9519C6.56433 3.34241 7.39098 3 8.25293 3H15.7509C16.6129 3 17.4395 3.34241 18.049 3.9519C18.6585 4.5614 19.0009 5.38805 19.0009 6.25V21.246C19.001 21.384 18.9629 21.5194 18.8909 21.6372C18.819 21.755 18.7159 21.8506 18.5931 21.9136C18.4702 21.9766 18.3324 22.0044 18.1948 21.9941C18.0571 21.9837 17.925 21.9356 17.8129 21.855L12.0029 17.674L6.18993 21.855ZM17.5019 6.25C17.5019 5.78587 17.3176 5.34075 16.9894 5.01256C16.6612 4.68437 16.2161 4.5 15.7519 4.5H8.25293C7.7888 4.5 7.34368 4.68437 7.01549 5.01256C6.6873 5.34075 6.50293 5.78587 6.50293 6.25V19.782L11.5639 16.141C11.6915 16.0492 11.8447 15.9998 12.0019 15.9998C12.1591 15.9998 12.3123 16.0492 12.4399 16.141L17.5009 19.782L17.5019 6.25Z"
      fill="currentColor"
    />
  </svg>
);

export interface WishlistGame {
  id: string;
  productId?: number;
  slug?: string;
  steamAppId?: number;
  title: string;
  imageSrc: string;
  genres: string[];
  platform?: string;
  launcher?: string;
}

// 7 Wishlist Games matching Screenshot 3 exactly
export const INITIAL_WISHLIST_GAMES: WishlistGame[] = [
  {
    id: "wish-1",
    productId: 1,
    slug: "ac-black-flag",
    steamAppId: 242050,
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
  },
  {
    id: "wish-2",
    productId: 2,
    slug: "first-light",
    steamAppId: 1091500,
    title: "007 - First Light",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
  },
  {
    id: "wish-3",
    productId: 3,
    slug: "subnautica-2",
    steamAppId: 1962700,
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
  },
  {
    id: "wish-4",
    productId: 4,
    slug: "tk-rdr-2",
    steamAppId: 1174180,
    title: "Read Dead Redemption II",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
  },
  {
    id: "wish-5",
    productId: 5,
    slug: "686810",
    steamAppId: 686810,
    title: "Hell Let Loose: Vietnam",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/686810/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
  },
  {
    id: "wish-6",
    productId: 6,
    slug: "1846380",
    steamAppId: 1846380,
    title: "Need For Speed Unbound",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1846380/library_600x900_2x.jpg",
    genres: ["Sport-Racing"],
    platform: "Steam",
    launcher: "EA",
  },
  {
    id: "wish-7",
    productId: 7,
    slug: "990080",
    steamAppId: 990080,
    title: "Earthworm Jim",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    platform: "Steam",
    launcher: "Steam",
  },
];

export default function WishlistPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = authUser?.id ? String(authUser.id) : undefined;
  const { addItem, isInCart } = useCartStore();
  const { isGameOwned } = useOwnedGames();

  // Local wishlist items integration (scoped by user ID to prevent account leakage)
  const getUserItems = useWishlistStore((s) => s.getUserItems);
  const localWishlistItems = React.useMemo(() => {
    return getUserItems(currentUserId);
  }, [getUserItems, currentUserId]);
  const removeFromWishlistStore = useWishlistStore((s) => s.removeFromWishlist);

  // Wishlist API integration
  const [searchQuery, setSearchQuery] = React.useState("");
  const [appliedGenres, setAppliedGenres] = React.useState<string[]>([]);
  const { data: wishlistApiRes, isLoading: isWishlistLoading } = useWishlist({
    search: searchQuery.trim() || undefined,
    genre_categories: appliedGenres.length > 0 ? appliedGenres : undefined,
  });
  const addToCartMutation = useAddToCart();

  const wishlistGames: WishlistGame[] = React.useMemo(() => {
    // Sanitize imageSrc: replace screenshot or old library 600x900 for 107410 with hero_capsule
    const sanitizedLocal: WishlistGame[] = localWishlistItems.map((item) => {
      let imageSrc = item.imageSrc;
      const appId =
        item.steamAppId ||
        (item.productId && !isNaN(Number(item.productId))
          ? Number(item.productId)
          : undefined);

      if (
        (appId && String(appId) === "107410") ||
        (item.title && item.title.toLowerCase().includes("targeted")) ||
        (item.id && item.id.includes("targeted"))
      ) {
        imageSrc =
          "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/107410/hero_capsule.jpg";
      } else if (
        appId &&
        (imageSrc?.includes("steamuserimages") ||
          imageSrc?.includes("/ss_") ||
          imageSrc?.includes("header.jpg"))
      ) {
        imageSrc = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/hero_capsule.jpg`;
      }

      return {
        ...item,
        imageSrc: imageSrc || item.imageSrc,
      };
    });

    const list: WishlistGame[] = [];

    // 1. If backend API has wishlisted products for this user
    if (wishlistApiRes?.data && wishlistApiRes.data.length > 0) {
      wishlistApiRes.data.forEach((item) => {
        const id = String(item.product?.id || item.id);
        const exists = list.some((x) => String(x.productId || x.id) === id);
        if (!exists) {
          const appId =
            (item.product as { steam_app_id?: number } | undefined)
              ?.steam_app_id || item.product?.id;
          const cover = appId
            ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/hero_capsule.jpg`
            : item.product?.thumbnail || "";

          list.push({
            id: String(item.id),
            productId: item.product?.id,
            slug:
              item.product?.slug ||
              (item.product?.id ? String(item.product.id) : undefined),
            steamAppId: (
              item.product as { steam_app_id?: number } | undefined
            )?.steam_app_id,
            title: item.product?.name || "Game",
            imageSrc: cover,
            genres:
              (
                item.product as { categories?: Array<{ name: string }> }
              )?.categories?.map((c) => c.name) || ["Action", "Adventure"],
            platform: "Steam",
            launcher: "Steam",
          });
        }
      });
    }

    // 2. Add local wishlist items that match current user (if any)
    sanitizedLocal.forEach((item) => {
      const exists = list.some(
        (x) =>
          (item.productId && x.productId === item.productId) ||
          String(x.id) === String(item.id) ||
          x.title.toLowerCase() === item.title.toLowerCase()
      );
      if (!exists) {
        list.push(item);
      }
    });

    if (isAuthenticated) {
      return list;
    }

    return sanitizedLocal;
  }, [wishlistApiRes, localWishlistItems, isAuthenticated]);

  // Search State
  // Search State moved above

  // Filter Modal & Applied Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);

  // Modal Internal Draft Selection
  const [modalCategories, setModalCategories] = React.useState<string[]>([]);
  const [modalGenres, setModalGenres] = React.useState<string[]>([]);
  const [modalLaunchers, setModalLaunchers] = React.useState<string[]>([]);
  const [modalPriceRange, setModalPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [modalSort, setModalSort] = React.useState<string>("Terbaru");

  // Applied Filters
  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  // Applied Genres moved above
  const [appliedLaunchers, setAppliedLaunchers] = React.useState<string[]>([]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleAddToCart = (game: WishlistGame) => {
    if (isGameOwned(game.productId, game.title, game.slug)) {
      setToastMessage(`Game "${game.title}" sudah Anda miliki di Library!`);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return;
    }

    if (isInCart(String(game.productId || game.id), game.title)) {
      setToastMessage(`Game "${game.title}" sudah ada di Keranjang!`);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return;
    }

    addItem(String(game.productId || game.id), 1, {
      title: game.title,
      imageSrc: game.imageSrc,
    });

    if (isAuthenticated && game.productId) {
      addToCartMutation.mutate(game.productId);
    }

    setToastMessage(`"${game.title}" berhasil ditambahkan ke Keranjang!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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
    setSearchQuery("");
    setAppliedGenres([]);
    setAppliedCategories([]);
    setAppliedLaunchers([]);
    setAppliedSort("Terbaru");
    setModalGenres([]);
    setModalCategories([]);
    setModalLaunchers([]);
    setModalSort("Terbaru");
    setModalPriceRange([0, 200000]);
  };

  // Filter and Search Evaluation
  const isSearchActive = searchQuery.trim().length > 0;
  const isFilterActive =
    appliedGenres.length > 0 ||
    appliedCategories.length > 0 ||
    appliedLaunchers.length > 0;

  const displaySearchQuery = React.useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return "";
    return q.length > 28 ? `${q.slice(0, 28)}...` : q;
  }, [searchQuery]);

  const totalFilterCount =
    appliedGenres.length + appliedCategories.length + appliedLaunchers.length;
  const isHeaderFlexCol =
    totalFilterCount >= 4 || (isSearchActive && totalFilterCount >= 2);

  const filteredGames: WishlistGame[] = React.useMemo(() => {
    let list = [...wishlistGames];

    // 1. Search Query Matching
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
  }, [wishlistGames, isSearchActive, searchQuery, appliedGenres, appliedLaunchers, appliedSort]);

  const isTotalWishlistEmpty = wishlistGames.length === 0;

  return (
    <>
      <Head>
        <title>Wishlist Game - Gamezygo</title>
        <meta
          name="description"
          content="Daftar game impian dan favorit yang Anda simpan di Wishlist Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant="private"
        activeSidebarId="wishlist"
      >
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
          {/* ========================================================
              TOP HEADER: Red vertical pill accent + "Wishlist" Title
              (Highlight utama dari permintaan user / Screenshot 1, 2, 3)
             ======================================================== */}
          <div className="flex items-center gap-3.5">
              <div className="flex flex-col gap-2 border-l-gradient-primary pl-8">
                  <h2 className="text-h2 font-semibold leading-[120%] text-gradient-heading  w-fit">
                Wishlist
                  </h2>
                
                </div>
          </div>

          {/* ========================================================
              SECTION HEADER WITH DYNAMIC STATES
              Only visible when wishlist has items, or in search state
             ======================================================== */}
          {!isTotalWishlistEmpty && (
            <div
              className={cn(
                "w-full gap-4 select-none",
                isHeaderFlexCol
                  ? "flex flex-col items-start"
                  : "flex flex-col sm:flex-row sm:items-center justify-between"
              )}
            >
              {/* Header Kiri: Dinamis tergantung status Search & Filter */}
              <div className="min-w-0 flex items-center flex-1 max-w-full">
                {isSearchActive && !isFilterActive ? (
                  /* STATE 3: ONLY SEARCH ACTIVE */
                  <h3
                    className="text-h3 font-semibold text-gray-50 tracking-normal truncate shrink-0"
                    title={`Cari "${searchQuery.trim()}"`}
                  >
                    Cari &quot;{displaySearchQuery}&quot;
                  </h3>
                ) : isFilterActive ? (
                  /* STATE 2: FILTER ACTIVE (WITH OR WITHOUT SEARCH) */
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 max-w-full">
                    <span
                      className="text-body-md font-semibold text-gray-300 mr-1 shrink-0"
                      title={searchQuery.trim() ? `Cari "${searchQuery.trim()}":` : "Tampilkan:"}
                    >
                      {searchQuery.trim() ? `Cari "${displaySearchQuery}":` : "Tampilkan:"}
                    </span>

                    <FilterBadgeSwiper
                      onClearAll={handleClearAllFilters}
                      className="min-w-0 flex-1"
                    >
                      {appliedGenres.map((genre) => (
                        <Button
                          key={genre}
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() => handleRemoveGenre(genre)}
                          className="cursor-pointer whitespace-nowrap shrink-0"
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
                          className="cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {launcher}
                        </Button>
                      ))}
                    </FilterBadgeSwiper>
                  </div>
                ) : (
                  /* STATE 1: DEFAULT STATE */
                  <div className="flex items-center gap-2 shrink-0">
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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    FILTER & SORT MODAL DIALOG
                   ======================================================== */}
                <FilterModal
                  isOpen={isFilterModalOpen}
                  variant="dialog"
                  onClose={() => setIsFilterModalOpen(false)}
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
                    setIsFilterModalOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* ========================================================
              WISHLIST GAMES GRID ATAU EMPTY STATE
             ======================================================== */}
          {isAuthenticated && isWishlistLoading && wishlistGames.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} orientation="vertical" />
              ))}
            </div>
          ) : isTotalWishlistEmpty ? (
            /* CASE A: WISHLIST UTAMA KOSONG (Screenshot 2: Empty) */
            <div className="py-24 flex items-center justify-center w-full">
              <EmptyState
                icon={<BookmarkOutlineIcon className="w-8 h-8 text-gray-50" />}
                title="Belum ada Wishlist"
                description="Belum ada game impian di sini. Mulai jelajahi katalog dan tambahkan game favoritmu!"
                backLabel="Kembali"
                searchLabel="Search"
                onBack={() => {
                  router.push("/store");
                }}
                onSearch={() => {
                  router.push("/store");
                }}
              />
            </div>
          ) : filteredGames.length > 0 ? (
            /* CASE B: 4-COLUMN RESPONSIVE WISHLIST GRID (Screenshot 3: Default) */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredGames.map((game) => {
                const targetSlug =
                  game.slug ||
                  (game.productId ? String(game.productId) : undefined) ||
                  (game.steamAppId ? String(game.steamAppId) : undefined) ||
                  game.id;
                return (
                  <ProductCard
                    key={game.id}
                    orientation="vertical"
                    title={game.title}
                    imageSrc={game.imageSrc}
                    genres={game.genres}
                    platform={game.platform}
                    showPrice={false}
                    showActionButton={true}
                    buttonText="Tambah Keranjang"
                    href={`/store/${targetSlug}`}
                    onActionClick={() => handleAddToCart(game)}
                    className="hover:-translate-y-0.5 transition-transform duration-200 pb-8xl cursor-pointer"
                  />
                );
              })}
            </div>
          ) : (
            /* CASE C: HASIL FILTER/SEARCH KOSONG */
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
        </div>

        {/* Action Toast Feedback saat tombol "Tambah Keranjang" diklik */}
        {toastMessage && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant="success"
              title={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}