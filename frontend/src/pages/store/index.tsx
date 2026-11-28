import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Header,
  Button,
  ProductCard,
  ProductCardRow,
  SectionHeader,
  FilterModal,
  EmptyState,
  Toast,
  BannerCarousel,
  FilterBadgeSwiper,
  ProductCardSkeleton,
  Skeleton,
  type BannerSlide,
  type ProductCardRowItem,
} from "@/components/ui";
import { StoreLayout } from "@/components/layout";
import { FluentWifiFilledIcon } from "@/components/shared/Error500View";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { formatDiscount } from "@/utils/formatters";
import { useAddToCart } from "@/hooks/use-cart";
import { useOwnedGames } from "@/hooks/use-library";
import { cn } from "@/lib/utils";

// Icon for 500 Server Error
const WifiOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    {...props}
  >
    <path
      d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z"
      fill="currentColor"
    />
    <path
      d="M8.464 13.464C9.402 12.526 10.674 12 12 12C13.326 12 14.598 12.526 15.536 13.464M4.929 9.929C6.804 8.054 9.348 7 12 7C14.652 7 17.196 8.054 19.071 9.929M1.393 6.393C4.207 3.58 8.022 2 12 2C15.978 2 19.793 3.58 22.607 6.393M2 2L22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Close 'x' icon for filter tags
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




import productsData from "@/json/products.json";
import { useAnnouncements } from "@/hooks/use-common";
import {
  useCustomSections,
  useInfiniteProducts,
  useProductFilters,
  useProducts,
} from "@/hooks/use-products";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  mapProductToCardItem,
  mapAnnouncementToSlide,
  mapSectionProducts,
} from "@/utils/adapters";

interface ProductItem {
  id: string;
  steamAppId?: number;
  title: string;
  imageSrc: string;
  bannerSrc?: string;
  genres: string[];
  originalPrice: string;
  price: string;
  numericPrice: number;
  discount: string;
  platform?: string;
  isBestSeller?: boolean;
}

const TAWARAN_KHUSUS_PRODUCTS: ProductItem[] = productsData.tawaranKhusus;
const RILIS_TERBARU_PRODUCTS: ProductItem[] = productsData.rilisTerbaru;
const ALL_STORE_PRODUCTS: ProductItem[] = productsData.semuaProduk;

const PROMO_BANNERS: BannerSlide[] = [
  {
    id: "summer-promo-1",
    title: "Promo Musim Panas",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas - Gamezygo",
    href: "/store?promo=summer",
  },
  {
    id: "summer-promo-2",
    title: "Promo Musim Panas Spesial",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas Spesial - Gamezygo",
    href: "/store?promo=summer-special",
  },
  {
    id: "summer-promo-3",
    title: "Promo Musim Panas Flash Deals",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas Flash Deals - Gamezygo",
    href: "/store?promo=summer-flash",
  },
];

export default function StorePage() {
  const router = useRouter();

  // Auth state
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  const isUserLoggedIn = isMounted && isAuthenticated;

  // Navigation & Search State
  const [activeNavId, setActiveNavId] = React.useState<string>("toko");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);

  // Interaction Filter State (in the dropdown)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedLaunchers, setSelectedLaunchers] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [selectedSort, setSelectedSort] = React.useState<string>("Terbaru");

  // Applied Filter State (actively affecting the store catalog)
  const [appliedGenres, setAppliedGenres] = React.useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  const [appliedLaunchers, setAppliedLaunchers] = React.useState<string[]>([]);
  const [appliedPriceRange, setAppliedPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  // Query Params aligned with Postman API Contract
  const apiQueryParams = React.useMemo(() => {
    const genre = appliedGenres[0] || appliedCategories[0];
    return {
      search: searchQuery.trim() || undefined,
      category: genre ? genre.toLowerCase() : undefined,
      launcher: appliedLaunchers[0] ? appliedLaunchers[0].toLowerCase() : undefined,
      sort_by:
        appliedSort === "Nama (A - Z)"
          ? "a_z"
          : appliedSort === "Termurah"
          ? "price_asc"
          : appliedSort === "Termahal"
          ? "price_desc"
          : "latest",
      price_range:
        appliedPriceRange[0] > 0 || appliedPriceRange[1] < 200000
          ? `${appliedPriceRange[0]}-${appliedPriceRange[1]}`
          : undefined,
    };
  }, [
    searchQuery,
    appliedGenres,
    appliedCategories,
    appliedLaunchers,
    appliedSort,
    appliedPriceRange,
  ]);

  // React Query API Data Hooks
  const { data: announcementsData, isLoading: isAnnouncementsLoading } = useAnnouncements();
  const { data: sectionsData, isLoading: isSectionsLoading } = useCustomSections();
  const { data: bestSellerData, isLoading: isBestSellerLoading } = useProducts({
    filter: "best_seller",
  });
  const {
    data: productsInfiniteData,
    isLoading: isProductsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteProducts(apiQueryParams);
  useProductFilters();

  const bestSellerApiProducts = React.useMemo(
    () => (Array.isArray(bestSellerData?.data) ? bestSellerData.data : []),
    [bestSellerData]
  );

  const topBestSellerGames = React.useMemo(
    () => bestSellerApiProducts.slice(0, 2).map((item) => mapProductToCardItem(item)),
    [bestSellerApiProducts]
  );

  const allApiProducts = React.useMemo(
    () => productsInfiniteData?.pages.flatMap((page) => page.data ?? []) ?? [],
    [productsInfiniteData]
  );

  const { sentinelRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // Interaction State Simulator for Screenshots 2 & 3
  const [previewState, setPreviewState] = React.useState<
    "default" | "error-500" | "searched" | "searched-empty" | "filter-applied" | "filter-empty"
  >("default");

  // Synchronize router query params (q, search, genres, launchers, price, etc.)
  React.useEffect(() => {
    if (!router.isReady) return;

    const timer = setTimeout(() => {
      const {
        q,
        search,
        genres,
        genre,
        categories,
        category,
        launchers,
        launcher,
        minPrice,
        maxPrice,
        sort,
      } = router.query;

      const rawQuery = (q || search) as string | undefined;
      setSearchQuery(rawQuery || "");

      const rawGenres = (genres || genre) as string | undefined;
      if (rawGenres) {
        const parsedGenres = rawGenres
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        setSelectedGenres(parsedGenres);
        setAppliedGenres(parsedGenres);
      } else {
        setSelectedGenres([]);
        setAppliedGenres([]);
      }

      const rawCategories = (categories || category) as string | undefined;
      if (rawCategories) {
        const parsedCategories = rawCategories
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        setSelectedCategories(parsedCategories);
        setAppliedCategories(parsedCategories);
      } else {
        setSelectedCategories([]);
        setAppliedCategories([]);
      }

      const rawLaunchers = (launchers || launcher) as string | undefined;
      if (rawLaunchers) {
        const parsedLaunchers = rawLaunchers
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        setSelectedLaunchers(parsedLaunchers);
        setAppliedLaunchers(parsedLaunchers);
      } else {
        setSelectedLaunchers([]);
        setAppliedLaunchers([]);
      }

      const parsedMin = minPrice ? parseInt(minPrice as string, 10) : 0;
      const parsedMax = maxPrice ? parseInt(maxPrice as string, 10) : 200000;
      if (
        !isNaN(parsedMin) &&
        !isNaN(parsedMax) &&
        (parsedMin > 0 || parsedMax < 200000)
      ) {
        setPriceRange([parsedMin, parsedMax]);
        setAppliedPriceRange([parsedMin, parsedMax]);
      } else {
        setPriceRange([0, 200000]);
        setAppliedPriceRange([0, 200000]);
      }

      const rawSort = sort as string | undefined;
      if (rawSort) {
        setSelectedSort(rawSort);
        setAppliedSort(rawSort);
      } else {
        setSelectedSort("Terbaru");
        setAppliedSort("Terbaru");
      }

      const hasFilters = Boolean(
        rawGenres ||
          rawCategories ||
          rawLaunchers ||
          (!isNaN(parsedMin) && parsedMin > 0) ||
          (!isNaN(parsedMax) && parsedMax < 200000) ||
          (rawSort && rawSort !== "Terbaru")
      );

      if (rawQuery && rawQuery.trim()) {
        setPreviewState("default");
      } else if (hasFilters) {
        setPreviewState("filter-applied");
      } else {
        setPreviewState("default");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router.isReady, router.query]);

  // Cart notification toast
  const [cartToast, setCartToast] = React.useState<string | null>(null);
  const addItemToStore = useCartStore((s) => s.addItem);
  const isInCartStore = useCartStore((s) => s.isInCart);
  const addToCartMutation = useAddToCart();
  const { isGameOwned } = useOwnedGames();

  const enrichRowItems = React.useCallback(
    (items: ProductCardRowItem[]) =>
      items.map((item) => {
        const owned = isGameOwned(item.id, item.title);
        const inCart = isInCartStore(item.id, item.title);
        return {
          ...item,
          buttonText: owned ? "Sudah Dimiliki" : inCart ? "Di Keranjang" : "Tambah Keranjang",
          isActionDisabled: owned || inCart,
        };
      }),
    [isGameOwned, isInCartStore]
  );

  const handleAddToCart = (gameTitle: string) => {
    const matchedApi =
      allApiProducts.find((p) => p.name === gameTitle) ||
      bestSellerApiProducts.find((p) => p.name === gameTitle);
    const matchedLocal = ALL_STORE_PRODUCTS.find((p) => p.title === gameTitle);
    const prodId = matchedApi ? String(matchedApi.id) : (matchedLocal?.id || gameTitle);

    if (isGameOwned(prodId, gameTitle)) {
      setCartToast(`Anda sudah memiliki "${gameTitle}" di Library.`);
      setTimeout(() => setCartToast(null), 3500);
      return;
    }

    if (isInCartStore(prodId, gameTitle)) {
      setCartToast(`"${gameTitle}" sudah ada di dalam keranjang.`);
      setTimeout(() => setCartToast(null), 3500);
      return;
    }

    const price = matchedApi
      ? (matchedApi.discount_price && matchedApi.discount_price > 0 ? matchedApi.discount_price : matchedApi.price)
      : (matchedLocal ? parseInt(matchedLocal.price.replace(/\D/g, '')) || 0 : 0);
    const originalPrice = matchedApi
      ? matchedApi.price
      : (matchedLocal ? parseInt(matchedLocal.originalPrice?.replace(/\D/g, '') || '0') || price : price);
    const imageSrc = matchedApi?.thumbnail || matchedLocal?.imageSrc || '';
    const discount = matchedApi ? formatDiscount(matchedApi.discount) : (matchedLocal?.discount || '');

    addItemToStore(prodId, 1, {
      title: gameTitle,
      price: price || 0,
      originalPrice: originalPrice || price || 0,
      imageSrc,
      discount,
    });
    if (isAuthenticated && matchedApi?.id) {
      addToCartMutation.mutate(matchedApi.id);
    }
    setCartToast(gameTitle);
    setTimeout(() => {
      setCartToast(null);
    }, 3500);
  };

  // Switch to specific preview state
  const setExactState = (
    state: "default" | "error-500" | "searched" | "searched-empty" | "filter-applied" | "filter-empty"
  ) => {
    setPreviewState(state);
    if (state === "searched") {
      setSearchQuery("Grand Thief Auto V");
      setSelectedGenres([]);
      setAppliedGenres([]);
    } else if (state === "searched-empty") {
      setSearchQuery("GameXYZ123YangTidakAda");
      setSelectedGenres([]);
      setAppliedGenres([]);
    } else if (state === "filter-applied") {
      setSearchQuery("");
      const initial = ["Action", "Adventure", "NSFW"];
      setSelectedGenres(initial);
      setAppliedGenres(initial);
    } else if (state === "filter-empty") {
      setSearchQuery("");
      const initial = ["Action", "Adventure", "NSFW"];
      setSelectedGenres(initial);
      setAppliedGenres(initial);
    } else {
      setSearchQuery("");
      setSelectedGenres([]);
      setAppliedGenres([]);
      setAppliedLaunchers([]);
      setAppliedPriceRange([0, 200000]);
      setAppliedSort("Terbaru");
    }
  };

  // Determine active genres strictly from user-applied filters (never inject mock genres on sort, BUG-031)
  const activeGenres = appliedGenres;

  const handleClearSearch = () => {
    setSearchQuery("");
    setPreviewState("default");
    const nextQuery = { ...router.query };
    delete nextQuery.q;
    delete nextQuery.search;
    router.replace(
      Object.keys(nextQuery).length > 0
        ? { pathname: "/store", query: nextQuery }
        : "/store",
      undefined,
      { shallow: true }
    );
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    const next = activeGenres.filter((g) => g !== genreToRemove);
    setAppliedGenres(next);
    setSelectedGenres(next);
    const queryParams: Record<string, string> = {};
    if (searchQuery.trim()) queryParams.q = searchQuery.trim();
    if (next.length > 0) queryParams.genres = next.join(",");
    if (appliedCategories.length > 0)
      queryParams.categories = appliedCategories.join(",");
    if (appliedLaunchers.length > 0)
      queryParams.launchers = appliedLaunchers.join(",");
    if (appliedPriceRange[0] > 0)
      queryParams.minPrice = appliedPriceRange[0].toString();
    if (appliedPriceRange[1] < 200000)
      queryParams.maxPrice = appliedPriceRange[1].toString();
    if (appliedSort !== "Terbaru") queryParams.sort = appliedSort;

    router.replace(
      Object.keys(queryParams).length > 0
        ? { pathname: "/store", query: queryParams }
        : "/store",
      undefined,
      { shallow: true }
    );
  };

  const handleRemoveCategory = (catToRemove: string) => {
    const next = appliedCategories.filter((c) => c !== catToRemove);
    setAppliedCategories(next);
    setSelectedCategories(next);
    const queryParams: Record<string, string> = {};
    if (searchQuery.trim()) queryParams.q = searchQuery.trim();
    if (activeGenres.length > 0) queryParams.genres = activeGenres.join(",");
    if (next.length > 0) queryParams.categories = next.join(",");
    if (appliedLaunchers.length > 0) queryParams.launchers = appliedLaunchers.join(",");
    if (appliedPriceRange[0] > 0) queryParams.minPrice = appliedPriceRange[0].toString();
    if (appliedPriceRange[1] < 200000) queryParams.maxPrice = appliedPriceRange[1].toString();
    if (appliedSort !== "Terbaru") queryParams.sort = appliedSort;

    router.replace(
      Object.keys(queryParams).length > 0
        ? { pathname: "/store", query: queryParams }
        : "/store",
      undefined,
      { shallow: true }
    );
  };

  const handleRemoveLauncher = (launcherToRemove: string) => {
    const next = appliedLaunchers.filter((l) => l !== launcherToRemove);
    setAppliedLaunchers(next);
    setSelectedLaunchers(next);
    const queryParams: Record<string, string> = {};
    if (searchQuery.trim()) queryParams.q = searchQuery.trim();
    if (activeGenres.length > 0) queryParams.genres = activeGenres.join(",");
    if (appliedCategories.length > 0) queryParams.categories = appliedCategories.join(",");
    if (next.length > 0) queryParams.launchers = next.join(",");
    if (appliedPriceRange[0] > 0) queryParams.minPrice = appliedPriceRange[0].toString();
    if (appliedPriceRange[1] < 200000) queryParams.maxPrice = appliedPriceRange[1].toString();
    if (appliedSort !== "Terbaru") queryParams.sort = appliedSort;

    router.replace(
      Object.keys(queryParams).length > 0
        ? { pathname: "/store", query: queryParams }
        : "/store",
      undefined,
      { shallow: true }
    );
  };

  const handleResetPriceRange = () => {
    setAppliedPriceRange([0, 200000]);
    setPriceRange([0, 200000]);
    const queryParams: Record<string, string> = {};
    if (searchQuery.trim()) queryParams.q = searchQuery.trim();
    if (activeGenres.length > 0) queryParams.genres = activeGenres.join(",");
    if (appliedCategories.length > 0) queryParams.categories = appliedCategories.join(",");
    if (appliedLaunchers.length > 0) queryParams.launchers = appliedLaunchers.join(",");
    if (appliedSort !== "Terbaru") queryParams.sort = appliedSort;

    router.replace(
      Object.keys(queryParams).length > 0
        ? { pathname: "/store", query: queryParams }
        : "/store",
      undefined,
      { shallow: true }
    );
  };

  const handleResetSort = () => {
    setAppliedSort("Terbaru");
    setSelectedSort("Terbaru");
    const queryParams: Record<string, string> = {};
    if (searchQuery.trim()) queryParams.q = searchQuery.trim();
    if (activeGenres.length > 0) queryParams.genres = activeGenres.join(",");
    if (appliedCategories.length > 0) queryParams.categories = appliedCategories.join(",");
    if (appliedLaunchers.length > 0) queryParams.launchers = appliedLaunchers.join(",");
    if (appliedPriceRange[0] > 0) queryParams.minPrice = appliedPriceRange[0].toString();
    if (appliedPriceRange[1] < 200000) queryParams.maxPrice = appliedPriceRange[1].toString();

    router.replace(
      Object.keys(queryParams).length > 0
        ? { pathname: "/store", query: queryParams }
        : "/store",
      undefined,
      { shallow: true }
    );
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setAppliedGenres([]);
    setSelectedCategories([]);
    setAppliedCategories([]);
    setSelectedLaunchers([]);
    setAppliedLaunchers([]);
    setPriceRange([0, 200000]);
    setAppliedPriceRange([0, 200000]);
    setSelectedSort("Terbaru");
    setAppliedSort("Terbaru");
    setPreviewState("default");
    router.replace("/store", undefined, { shallow: true });
  };

  // Dynamic Banners from Backend (fallback to PROMO_BANNERS)
  const heroBanners = React.useMemo(() => {
    if (announcementsData?.data && announcementsData.data.length > 0) {
      return announcementsData.data.map(mapAnnouncementToSlide);
    }
    return PROMO_BANNERS;
  }, [announcementsData]);

  // Dynamic Custom Sections from Backend
  const customSections = React.useMemo(() => {
    if (sectionsData?.data && sectionsData.data.length > 0) {
      return sectionsData.data;
    }
    return null;
  }, [sectionsData]);

  // Filtered Products Logic
  const searchResults = React.useMemo(() => {
    if (previewState === "filter-empty" || previewState === "searched-empty") {
      return [];
    }

    let list: Array<ProductItem | ProductCardRowItem> = ALL_STORE_PRODUCTS;

    if (allApiProducts.length > 0 || !isProductsLoading) {
      if (productsInfiniteData !== undefined) {
        list = allApiProducts.map(mapProductToCardItem);
      }
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (query.includes("gta") &&
            p.title.toLowerCase().includes("grand theft auto")) ||
          (query.includes("grand") &&
            p.title.toLowerCase().includes("grand theft auto")) ||
          p.genres?.some((g) => g.toLowerCase().includes(query)) ||
          p.platform?.toLowerCase().includes(query)
      );
    }

    // Also respect active filters if any
    if (activeGenres.length > 0) {
      list = list.filter((p) =>
        activeGenres.some((g) => p.genres.includes(g))
      );
    }
    if (appliedCategories.length > 0) {
      list = list.filter((p) =>
        appliedCategories.some((c) => p.genres.includes(c))
      );
    }
    if (appliedLaunchers.length > 0) {
      list = list.filter((p) =>
        appliedLaunchers.some(
          (l) =>
            p.platform?.toLowerCase().includes(l.toLowerCase()) ||
            l.toLowerCase().includes(p.platform?.toLowerCase() || "")
        )
      );
    }
    if (appliedPriceRange[0] > 0 || appliedPriceRange[1] < 200000) {
      list = list.filter((p) => {
        const price = p.numericPrice ?? 0;
        return (
          price >= appliedPriceRange[0] && price <= appliedPriceRange[1]
        );
      });
    }

    if (appliedSort === "Nama (A - Z)") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [
    searchQuery,
    activeGenres,
    appliedCategories,
    appliedLaunchers,
    appliedPriceRange,
    appliedSort,
    previewState,
    allApiProducts,
    isProductsLoading,
    productsInfiniteData,
  ]);


  const storeCatalogProducts = React.useMemo(() => {
    if (productsInfiniteData !== undefined) {
      return allApiProducts.map(mapProductToCardItem);
    }
    return ALL_STORE_PRODUCTS;
  }, [allApiProducts, productsInfiniteData]);

  // Is Search Active?
  const isSearchActive =
    previewState === "searched" ||
    previewState === "searched-empty" ||
    searchQuery.trim().length > 0;

  // Is Filter Active?
  const isFilterActive =
    previewState === "filter-applied" ||
    previewState === "filter-empty" ||
    activeGenres.length > 0 ||
    appliedCategories.length > 0 ||
    appliedLaunchers.length > 0 ||
    appliedPriceRange[0] > 0 ||
    appliedPriceRange[1] < 200000 ||
    appliedSort !== "Terbaru";

  const displaySearchQuery = React.useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return "";
    return q.length > 28 ? `${q.slice(0, 28)}...` : q;
  }, [searchQuery]);

  const totalFilterCount =
    activeGenres.length +
    appliedCategories.length +
    appliedLaunchers.length +
    (appliedPriceRange[0] > 0 || appliedPriceRange[1] < 200000 ? 1 : 0) +
    (appliedSort && appliedSort !== "Terbaru" ? 1 : 0);

  const isHeaderFlexCol =
    totalFilterCount >= 4 ||
    (searchQuery.trim().length > 0 && totalFilterCount >= 1) ||
    searchQuery.trim().length > 20;

  return (
    <>
      <Head>
        <title>Gamezygo — Toko Koleksi Akun Game Original Murah & Instan</title>
        <meta
          name="description"
          content="Beli game PC Steam, Epic Games, dan EA original dengan harga terjangkau, pengiriman instan langsung ke Game Library Anda."
        />
      </Head>

      <StoreLayout
        navbarVariant={isAuthenticated ? "login" : "guest"}
        hideSidebar={true}
        activeNavId={activeNavId}
        onNavItemClick={(item) => setActiveNavId(item.id)}
        user={
          authUser
            ? {
                name: authUser.name || "Customer Gamezygo",
                avatarUrl: authUser.avatarUrl,
              }
            : undefined
        }
        searchValue={searchQuery}
        searchPlaceholder="Cari game"
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (val.trim()) {
            setPreviewState("default");
          }
        }}
        onSearchClear={() => {
          handleClearSearch();
        }}
        onSearchSubmit={(val) => {
          const q = val.trim();
          setSearchQuery(q);
          setPreviewState("default");
          const nextQuery = { ...router.query };
          if (q) {
            nextQuery.q = q;
            delete nextQuery.search;
          } else {
            delete nextQuery.q;
            delete nextQuery.search;
          }
          router.replace(
            { pathname: "/store", query: nextQuery },
            undefined,
            { shallow: true }
          );
        }}
        onFilterClick={() => setIsFilterModalOpen((prev) => !prev)}
        contentClassName="w-full max-w-360 mx-auto px-4 sm:px-8 lg:px-20 pb-20 flex flex-col gap-50"
      >
        {/* ======================================================
            CASE A: STATE 500 SERVER ERROR (Screenshot 2: Empty)
           ====================================================== */}
        {previewState === "error-500" ? (
          <div className="py-16 sm:py-24 flex items-center justify-center w-full">
            <EmptyState
              icon={<FluentWifiFilledIcon className="w-8 h-8 text-gray-50" />}
              title="500: Terjadi Gangguan Server"
              description="Layanan toko sedang tidak dapat dijangkau. Silakan coba beberapa saat lagi."
              backLabel="Kembali"
              searchLabel="Muat Ulang"
              onBack={() => setExactState("default")}
              onSearch={() => setExactState("default")}
            />
          </div>
        ) : isSearchActive || isFilterActive ? (
          /* ======================================================
              CASE B & C: UNIFIED SEARCH & FILTER APPLIED STATE
              (Handles: Search Only, Filter Only, and Search + Filter)
             ====================================================== */
          <div className="flex flex-col gap-8 pt-8 min-h-screen pb-16">
            {/* Header with Dynamic Title and Active Filter Badges */}
            <div
              className={cn(
                "w-full pb-6.5 border-b border-b-gradient-secondary select-none",
                isHeaderFlexCol
                  ? "flex flex-col items-start gap-3"
                  : "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              )}
            >
              <div className={cn("min-w-0", isHeaderFlexCol ? "w-full" : "shrink-0 max-w-full sm:max-w-[40%]")}>
                <h3
                  className="text-h3 font-semibold text-gray-50 tracking-normal break-words"
                  title={searchQuery.trim() ? `Cari "${searchQuery.trim()}"` : "Semua Produk"}
                >
                  {searchQuery.trim()
                    ? `Cari "${displaySearchQuery}"`
                    : "Semua Produk"}
                </h3>
              </div>

              {isFilterActive && (
                <FilterBadgeSwiper
                  onClearAll={handleClearAllFilters}
                  className={cn(
                    "min-w-0",
                    isHeaderFlexCol ? "w-full" : "w-full sm:w-auto max-w-full sm:max-w-[65%]"
                  )}
                >
                  {/* 1. Genre Badges */}
                  {activeGenres.map((genre) => (
                    <Button
                      key={`genre-${genre}`}
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

                  {/* 2. Category Badges */}
                  {appliedCategories.map((cat) => (
                    <Button
                      key={`cat-${cat}`}
                      type="button"
                      variant="secondary"
                      size="sm"
                      rightIcon={<CrossIcon />}
                      onClick={() => handleRemoveCategory(cat)}
                      className="cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {cat}
                    </Button>
                  ))}

                  {/* 3. Launcher Badges */}
                  {appliedLaunchers.map((launcher) => (
                    <Button
                      key={`launcher-${launcher}`}
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

                  {/* 4. Price Range Badge */}
                  {(appliedPriceRange[0] > 0 || appliedPriceRange[1] < 200000) && (
                    <Button
                      key="price-badge"
                      type="button"
                      variant="secondary"
                      size="sm"
                      rightIcon={<CrossIcon />}
                      onClick={handleResetPriceRange}
                      className="cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {`Rp ${appliedPriceRange[0].toLocaleString("id-ID")} - Rp ${appliedPriceRange[1].toLocaleString("id-ID")}`}
                    </Button>
                  )}

                  {/* 5. Sort Badge */}
                  {appliedSort && appliedSort !== "Terbaru" && (
                    <Button
                      key="sort-badge"
                      type="button"
                      variant="secondary"
                      size="sm"
                      rightIcon={<CrossIcon />}
                      onClick={handleResetSort}
                      className="cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {`Urutan: ${appliedSort}`}
                    </Button>
                  )}
                </FilterBadgeSwiper>
              )}
            </div>

            {/* Filtered Grid or Empty State */}
            {isProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductCardSkeleton key={`search-skel-${idx}`} />
                ))}
              </div>
            ) : searchResults.length > 0 &&
            previewState !== "searched-empty" &&
            previewState !== "filter-empty" ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {searchResults.map((product) => {
                    const owned = isMounted && isGameOwned(product.id, product.title);
                    const inCart = isMounted && isInCartStore(product.id, product.title);
                    return (
                      <ProductCard
                        key={product.id}
                        title={product.title}
                        imageSrc={product.imageSrc}
                        genres={product.genres}
                        originalPrice={product.originalPrice}
                        price={product.price}
                        discount={product.discount}
                        platform={product.platform}
                        buttonText={owned ? "Sudah Dimiliki" : inCart ? "Di Keranjang" : "Tambah Keranjang"}
                        isActionDisabled={owned || inCart}
                        href={`/store/${(product as { slug?: string }).slug || product.id}`}
                        onActionClick={() => handleAddToCart(product.title)}
                        className="pb-8xl"
                      />
                    );
                  })}
                  {isFetchingNextPage &&
                    Array.from({ length: 4 }).map((_, idx) => (
                      <ProductCardSkeleton key={`search-next-skel-${idx}`} />
                    ))}
                </div>
                {hasNextPage && <div ref={sentinelRef} className="h-10 w-full" />}
              </>
            ) : (
              <div className="py-10xl">
                <EmptyState
                  title="Ups!... Hasil tidak ditemukan"
                  description={
                    searchQuery.trim() &&
                    (activeGenres.length > 0 ||
                      appliedCategories.length > 0 ||
                      appliedLaunchers.length > 0 ||
                      appliedPriceRange[0] > 0 ||
                      appliedPriceRange[1] < 200000)
                      ? `Tidak ada produk "${displaySearchQuery}" yang cocok dengan filter yang dipilih.`
                      : searchQuery.trim()
                      ? `Tidak ada produk yang cocok dengan pencarian "${displaySearchQuery}".`
                      : "Coba cari hal lain atau hapus filter!"
                  }
                  backLabel="Kembali"
                  searchLabel="Search"
                  onBack={handleClearAllFilters}
                  onSearch={handleClearAllFilters}
                />
              </div>
            )}
          </div>
        ) : (
          /* ======================================================
              CASE D: DEFAULT HOME PAGE (Screenshot 1)
             ====================================================== */
          <>
            {/* 1. HERO HEADER (Rule: ada tambahan pt 30 -> pt-[30px]) */}
            <Header
              pillText="Promo Musim Panas Telah Datang!"
              title="Rasakan Pengalaman Bermain Dengan Bebas!"
              subtitle="Ingin Langsung Buka Semua? Beli Premium!"
              actionLabel="Lihat Premium"
              actionVariant="primary"
              onActionClick={() => router.push("/bundle")}
              className="pt-10xl w-full sm:max-w-5/8 lg:max-w-4/8"
            />

            {/* 2. PROMO BANNER & MINI FEATURED CARDS SECTION */}
            <section className="flex flex-col xl:grid xl:grid-cols-5 gap-6 items-stretch">
              {/* Promo Banner Carousel: Di atas pada layar kecil/zoom (order-1), di kanan pada layar lebar (xl:order-2) */}
              {isAnnouncementsLoading ? (
                <Skeleton className="order-1 xl:order-2 flex-1 min-w-0 xl:col-span-3 w-full h-65 sm:h-85 md:h-100 xl:h-136 rounded-xl" />
              ) : (
                <BannerCarousel
                  slides={heroBanners}
                  className="order-1 xl:order-2 flex-1 min-w-0 xl:col-span-3 w-full h-65 sm:h-85 md:h-100 xl:h-136 min-h-65 sm:min-h-85 md:min-h-100 xl:min-h-136"
                />
              )}

              {/* 2 Horizontal Product Cards: 2 Game dengan Pembelian Terbanyak (best_seller) */}
              <div className="order-2 xl:order-1 xl:col-span-2 flex flex-col gap-6 shrink-0 w-full justify-between">
                {isBestSellerLoading ? (
                  Array.from({ length: 2 }).map((_, idx) => (
                    <div
                      key={`best-seller-skel-${idx}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary-default border border-white/5 h-[250px] w-full"
                    >
                      <Skeleton className="w-[140px] h-full rounded-lg shrink-0" />
                      <div className="flex flex-col justify-between flex-1 h-full py-1 gap-3">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-5 w-3/4 rounded" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-5 w-1/2 rounded" />
                          <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : topBestSellerGames.length > 0 ? (
                  topBestSellerGames.map((game) => {
                    const owned = isGameOwned(game.id, game.title);
                    const inCart = isInCartStore(game.id, game.title);
                    return (
                      <ProductCard
                        key={game.id}
                        orientation="horizontal"
                        title={game.title}
                        imageSrc={game.imageSrc}
                        genres={game.genres}
                        originalPrice={game.originalPrice}
                        price={game.price}
                        discount={game.discount}
                        platform={game.platform}
                        isBestSeller={false}
                        buttonText={
                          owned
                            ? "Sudah Dimiliki"
                            : inCart
                            ? "Di Keranjang"
                            : "Tambah Keranjang"
                        }
                        isActionDisabled={owned || inCart}
                        href={`/store/${game.slug || game.id}`}
                        onActionClick={() => handleAddToCart(game.title)}
                        className="w-full sm:min-w-0"
                      />
                    );
                  })
                ) : (
                  <div className="w-full flex-1 flex flex-col items-center justify-center p-6 rounded-xl bg-surface-secondary-default/60 border border-white/5 text-center gap-1.5">
                    <p className="text-body-md font-semibold text-gray-200">
                      Belum ada game terlaris saat ini
                    </p>
                    <p className="text-body-sm text-gray-400">
                      2 game dengan pembelian terbanyak akan tampil otomatis di sini.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 3. SECTIONS: DYNAMIC CUSTOM SECTIONS OR FALLBACK */}
            {isSectionsLoading ? (
              <section className="flex flex-col gap-6">
                <Skeleton className="h-8 w-52" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <ProductCardSkeleton key={`sec-skel-${idx}`} />
                  ))}
                </div>
              </section>
            ) : customSections && customSections.length > 0 ? (
              customSections.map((sec) => {
                const secProducts = enrichRowItems(mapSectionProducts(sec));
                if (secProducts.length === 0) return null;
                return (
                  <section key={sec.id} className="flex flex-col gap-10">
                    <SectionHeader
                      type="outer"
                      title={sec.title}
                      actionLabel="Lihat Semua"
                      onActionClick={() => setExactState("filter-applied")}
                    />
                    <ProductCardRow
                      products={secProducts}
                      visibleCount={
                        isUserLoggedIn
                          ? 4
                          : sec.slug === "rilis-terbaru" || sec.title?.toLowerCase().includes("terbaru")
                          ? 5
                          : 4
                      }
                      onAddToCart={handleAddToCart}
                    />
                  </section>
                );
              })
            ) : (
              <>
                {/* Fallback TAWARAN KHUSUS! */}
                <section className="flex flex-col gap-10">
                  <SectionHeader
                    type="outer"
                    title="Tawaran Khusus!"
                    actionLabel="Lihat Semua"
                    onActionClick={() => setExactState("filter-applied")}
                  />
                  <ProductCardRow
                    products={TAWARAN_KHUSUS_PRODUCTS}
                    onAddToCart={handleAddToCart}
                  />
                </section>

                {/* Fallback RILIS TERBARU! */}
                <section className="flex flex-col gap-10">
                  <SectionHeader
                    type="outer"
                    title="Rilis Terbaru!"
                    actionLabel="Lihat Semua"
                    onActionClick={() => setExactState("filter-applied")}
                  />
                  <ProductCardRow
                    products={RILIS_TERBARU_PRODUCTS}
                    visibleCount={isUserLoggedIn ? 4 : 5}
                    onAddToCart={handleAddToCart}
                  />
                </section>
              </>
            )}

            {/* 5. SECTION: SEMUA PRODUK */}
            <section className="flex flex-col gap-10">
              <SectionHeader
                type="outer"
                title="Semua Produk"
                showAction={false}
              />

              {isProductsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <ProductCardSkeleton key={`catalog-skel-${idx}`} />
                  ))}
                </div>
              ) : storeCatalogProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {storeCatalogProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        title={product.title}
                        imageSrc={product.imageSrc}
                        genres={product.genres}
                        originalPrice={product.originalPrice}
                        price={product.price}
                        discount={product.discount}
                        platform={product.platform}
                        href={`/store/${(product as { slug?: string }).slug || product.id}`}
                        onActionClick={() => handleAddToCart(product.title)}
                        className="pb-8xl"
                      />
                    ))}
                    {isFetchingNextPage &&
                      Array.from({ length: 4 }).map((_, idx) => (
                        <ProductCardSkeleton key={`catalog-next-skel-${idx}`} />
                      ))}
                  </div>
                  {hasNextPage && <div ref={sentinelRef} className="h-10 w-full" />}
                </>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-body-md">Belum ada game yang ditampilkan di katalog toko.</p>
                </div>
              )}
            </section>
          </>
        )}

      {/* ========================================================
          FILTER & SORT DROPDOWN (Screenshot 3: Filter Dropdown)
         ======================================================== */}
      <FilterModal
        isOpen={isFilterModalOpen}
        variant="dialog"
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategories={selectedCategories}
        onToggleCategory={(category) => {
          setSelectedCategories((prev) =>
            prev.includes(category)
              ? prev.filter((c) => c !== category)
              : [...prev, category]
          );
        }}
        selectedGenres={selectedGenres}
        onToggleGenre={(genre) => {
          setSelectedGenres((prev) =>
            prev.includes(genre)
              ? prev.filter((g) => g !== genre)
              : [...prev, genre]
          );
        }}
        selectedLaunchers={selectedLaunchers}
        onToggleLauncher={(launcher) => {
          setSelectedLaunchers((prev) =>
            prev.includes(launcher)
              ? prev.filter((l) => l !== launcher)
              : [...prev, launcher]
          );
        }}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
        onReset={() => {
          handleClearAllFilters();
          setIsFilterModalOpen(false);
        }}
        onApply={() => {
          setAppliedGenres(selectedGenres);
          setAppliedCategories(selectedCategories);
          setAppliedLaunchers(selectedLaunchers);
          setAppliedPriceRange(priceRange);
          setAppliedSort(selectedSort);
          setIsFilterModalOpen(false);
          const hasFilters =
            selectedGenres.length > 0 ||
            selectedCategories.length > 0 ||
            selectedLaunchers.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 200000 ||
            selectedSort !== "Terbaru";
          setPreviewState(hasFilters ? "filter-applied" : "default");

          const queryParams: Record<string, string> = {};
          if (searchQuery.trim()) queryParams.q = searchQuery.trim();
          if (selectedGenres.length > 0) queryParams.genres = selectedGenres.join(",");
          if (selectedCategories.length > 0) queryParams.categories = selectedCategories.join(",");
          if (selectedLaunchers.length > 0) queryParams.launchers = selectedLaunchers.join(",");
          if (priceRange[0] > 0) queryParams.minPrice = priceRange[0].toString();
          if (priceRange[1] < 200000) queryParams.maxPrice = priceRange[1].toString();
          if (selectedSort !== "Terbaru") queryParams.sort = selectedSort;

          router.replace({ pathname: "/store", query: queryParams }, undefined, { shallow: true });
        }}
      />

      {/* ========================================================
          CART ACTION TOAST FEEDBACK
         ======================================================== */}
      {cartToast && (
        <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
          <Toast
            variant="success"
            title="Added to Cart"
            description={`${cartToast} telah masuk ke keranjang belanja Anda.`}
            onClose={() => setCartToast(null)}
          />
        </div>
      )}

      </StoreLayout>
    </>
  );
}