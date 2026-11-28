import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  Breadcrumbs,
  Button,
  Pill,
  Skeleton,
  Toast,
} from "@/components/ui";
import {
  fetchSteamGame,
  searchSteamGames,
  parseSteamRequirements,
  type SteamGameDetails,
  type ParsedSystemRequirements,
} from "@/services/steam";
import productsData from "@/json/products.json";
import { OWNED_LIBRARY_GAMES } from "@/pages/library";
import { BUNDLE_GAMES } from "@/pages/bundle";
import { INITIAL_WISHLIST_GAMES } from "@/pages/wishlist";
import { useCartStore } from "@/stores/use-cart-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { useOwnedGames } from "@/hooks/use-library";
import { useProductDetail } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/stores/use-auth-store";
import { formatRupiah, formatDiscount } from "@/utils/formatters";
import { parseInstructionContentToSteps } from "@/services/admin-instruction.service";

// ============================================================================
// SVG ICONS
// ============================================================================

const SteamIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 fill-current shrink-0"
    {...props}
  >
    <path
      d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C7.4 22 3.55 18.92 2.36 14.73L6.19 16.31C6.32124 16.9506 6.66949 17.5262 7.17597 17.9398C7.68245 18.3534 8.31612 18.5795 8.97 18.58C10.53 18.58 11.8 17.31 11.8 15.75V15.62L15.2 13.19H15.28C17.36 13.19 19.05 11.5 19.05 9.42C19.05 7.34 17.36 5.65 15.28 5.65C13.2 5.65 11.5 7.34 11.5 9.42V9.47L9.13 12.93L8.97 12.92C8.38 12.92 7.83 13.1 7.38 13.41L2 11.2C2.43 6.05 6.73 2 12 2ZM8.28 17.17C9.08 17.5 10 17.13 10.33 16.33C10.66 15.53 10.28 14.62 9.5 14.29L8.22 13.76C8.71 13.58 9.26 13.57 9.78 13.79C10.31 14 10.72 14.41 10.93 14.94C11.15 15.46 11.15 16.04 10.93 16.56C10.5 17.64 9.23 18.16 8.15 17.71C7.65 17.5 7.27 17.12 7.06 16.67L8.28 17.17ZM17.8 9.42C17.8 10.81 16.67 11.94 15.28 11.94C14.6134 11.9374 13.975 11.6707 13.5046 11.1984C13.0341 10.7261 12.77 10.0866 12.77 9.42C12.7687 9.09001 12.8327 8.76303 12.9584 8.4579C13.084 8.15278 13.2689 7.87555 13.5022 7.64221C13.7356 7.40887 14.0128 7.22404 14.3179 7.09837C14.623 6.9727 14.95 6.90868 15.28 6.91C15.9466 6.90999 16.5861 7.17412 17.0584 7.64455C17.5307 8.11498 17.7974 8.75339 17.8 9.42ZM13.4 9.42C13.4 10.46 14.24 11.31 15.29 11.31C16.33 11.31 17.17 10.46 17.17 9.42C17.17 8.38 16.33 7.53 15.29 7.53C14.24 7.53 13.4 8.38 13.4 9.42Z"
      fill="currentColor"
    />
  </svg>
);

const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current shrink-0"
    {...props}
  >
    <path
      d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198Z"
      fill="currentColor"
    />
  </svg>
);

const StarRegularIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current shrink-0"
    {...props}
  >
    <path
      d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198ZM11.998 4.03898L9.74003 8.61398C9.64327 8.81029 9.50023 8.98013 9.32323 9.10887C9.14624 9.23761 8.9406 9.32139 8.72403 9.35298L3.67403 10.087L7.32803 13.649C7.64603 13.959 7.79103 14.406 7.71603 14.844L6.85403 19.873L11.37 17.498C11.5638 17.396 11.7795 17.3428 11.9985 17.3428C12.2175 17.3428 12.4332 17.396 12.627 17.498L17.143 19.873L16.281 14.843C16.2442 14.6274 16.2602 14.4061 16.3278 14.1981C16.3954 13.9901 16.5125 13.8017 16.669 13.649L20.323 10.087L15.273 9.35298C15.0565 9.32139 14.8508 9.23761 14.6738 9.10887C14.4968 8.98013 14.3538 8.81029 14.257 8.61398L11.998 4.03898Z"
      fill="currentColor"
    />
  </svg>
);

const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookGuideIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    {...props}
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="8.5"
      y="6.5"
      width="7"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



// ============================================================================
// SYSTEM SPEC DEFAULT
// ============================================================================

const DEFAULT_EMPTY_SPECS: ParsedSystemRequirements = {
  os: "-",
  cpu: "-",
  ram: "-",
  gpu: "-",
  directx: "-",
  storage: "-",
  soundCard: "-",
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function GameStoreDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const slug = typeof id === "string" ? id : "";

  // API Data Hook
  const { data: productApiRes, isLoading: isProductLoading } = useProductDetail(slug);
  const apiProduct = productApiRes?.data;

  // Cart store integration
  const { addItem, toggleCart, isInCart, clearOrderDetails } = useCartStore();
  const { isGameOwned } = useOwnedGames();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = authUser?.id ? String(authUser.id) : undefined;
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Wishlist store integration
  const isItemWishlisted = useWishlistStore((s) => s.isWishlisted);
  const toggleWishlistStore = useWishlistStore((s) => s.toggleWishlist);
  const [searchedSteamAppId, setSearchedSteamAppId] = React.useState<number | null>(null);
  const [steamData, setSteamData] = React.useState<SteamGameDetails | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [toast, setToast] = React.useState<{
    title: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  const showToast = (
    title: string,
    variant: "success" | "error" | "warning" = "success"
  ) => {
    setToast({ title, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const thumbnailsRef = React.useRef<HTMLDivElement>(null);

  const handlePrevMedia = () => {
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
    if (thumbnailsRef.current) {
      thumbnailsRef.current.scrollBy({ left: -140, behavior: "smooth" });
    }
  };

  const handleNextMedia = () => {
    setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
    if (thumbnailsRef.current) {
      thumbnailsRef.current.scrollBy({ left: 140, behavior: "smooth" });
    }
  };

  // Match game in catalog or library
  const matchedProduct = React.useMemo(() => {
    if (!id || typeof id !== "string") return null;

    const allProducts = [
      ...OWNED_LIBRARY_GAMES,
      ...((productsData as { miniFeatured?: Array<Record<string, unknown>> }).miniFeatured || []),
      ...((productsData as { tawaranKhusus?: Array<Record<string, unknown>> }).tawaranKhusus || []),
      ...((productsData as { rilisTerbaru?: Array<Record<string, unknown>> }).rilisTerbaru || []),
      ...((productsData as { semuaProduk?: Array<Record<string, unknown>> }).semuaProduk || []),
      ...BUNDLE_GAMES,
      ...INITIAL_WISHLIST_GAMES,
    ];

    const found = allProducts.find(
      (p) =>
        String(p.id).toLowerCase() === id.toLowerCase() ||
        String((p as { slug?: string }).slug || "").toLowerCase() === id.toLowerCase() ||
        String((p as { steamAppId?: number }).steamAppId) === id ||
        String((p as { title?: string }).title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") === id.toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    if (found) {
      const steamAppId =
        (found as { steamAppId?: number }).steamAppId ||
        Number(String((found as { imageSrc?: string }).imageSrc).match(/\/apps\/(\d+)\//)?.[1]) ||
        searchedSteamAppId ||
    0;

      return {
        ...found,
        steamAppId,
        bannerSrc:
          (found as { bannerSrc?: string }).bannerSrc ||
          `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/header.jpg`,
      };
    }

    // Numeric Steam App ID fallback
    const numericId = Number(id);
    if (!isNaN(numericId) && numericId > 0) {
      return {
        id,
        steamAppId: numericId,
        title: steamData?.name || `Steam Game #${numericId}`,
        originalPrice: "Rp 350.000",
        price: "Rp 210.000",
        discount: "-40%",
        imageSrc: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${numericId}/library_600x900_2x.jpg`,
        bannerSrc: `https://cdn.akamai.steamstatic.com/steam/apps/${numericId}/header.jpg`,
        genres: [],
      };
    }

    // Default: Assassin's Creed IV Black Flag (appId 242050)
    return {
      id: id,
      steamAppId: undefined,
      title: "-",
      originalPrice: "-",
      price: "-",
      discount: "",
      imageSrc:
        "",
      bannerSrc:
        "",
      genres: [],
    };
  }, [id, steamData?.name, searchedSteamAppId]);

  // Pre-order detection: query param (?preorder=true or ?state=pre-order), product status, or game state
  const isPreorder = React.useMemo(() => {
    if (router.query.preorder === "true" || router.query.state === "pre-order") return true;
    if (router.query.preorder === "false") return false;
    const prod = matchedProduct as { isPreorder?: boolean; state?: string; status?: string } | null;
    return Boolean(prod?.isPreorder || prod?.state === "pre-order" || prod?.status === "pre-order");
  }, [router.query.preorder, router.query.state, matchedProduct]);

  // Dynamic Genres list
  const gameGenres = React.useMemo(() => {
    if (apiProduct?.categories && apiProduct.categories.length > 0) {
      return apiProduct.categories.map((c) => c.name);
    }
    if (apiProduct?.product_genre_categories && apiProduct.product_genre_categories.length > 0) {
      return apiProduct.product_genre_categories.map((c) => c.name);
    }
    if (steamData?.genres && steamData.genres.length > 0) {
      return steamData.genres;
    }
    if (
      Array.isArray((matchedProduct as { genres?: string[] })?.genres) &&
      (matchedProduct as { genres?: string[] }).genres!.length > 0
    ) {
      return (matchedProduct as { genres?: string[] }).genres!;
    }
    return [];
  }, [apiProduct, steamData, matchedProduct]);

  // Fetch Steam Game Details (including pc_requirements)
  const extractedSteamId = React.useMemo(() => {
    if (apiProduct?.steam_url) {
      const match = apiProduct.steam_url.match(/\/app\/(\d+)/);
      if (match && match[1]) {
        return Number(match[1]);
      }
    }
    return null;
  }, [apiProduct]);

  // Auto search Steam if no steam_url or numeric ID
  React.useEffect(() => {
    if (extractedSteamId) return;
    const gameName = apiProduct?.name || (matchedProduct as { title?: string } | null)?.title;
    if (!gameName || gameName === "-") return;

    let isMounted = true;
    searchSteamGames(gameName)
      .then((results) => {
        if (isMounted && results && results.length > 0) {
          setSearchedSteamAppId(results[0].id);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [apiProduct?.name, extractedSteamId, matchedProduct]);

  const appId =
    extractedSteamId ||
    searchedSteamAppId ||
    (matchedProduct as { steamAppId?: number })?.steamAppId ||
    0;

  React.useEffect(() => {
    if (!appId || appId <= 0) return;

    let isMounted = true;
    fetchSteamGame(appId)
      .then((data) => {
        if (isMounted) {
          setSteamData(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching steam data:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [appId]);

  const effectiveSteamData = appId > 0 ? steamData : null;

  // Parse Minimum & Recommended specifications from Steam Store API or Backend API
  const minSpecs: ParsedSystemRequirements = React.useMemo(() => {
    const apiSpecs =
      apiProduct?.specification_requirements ||
      apiProduct?.product_specification_requirements ||
      [];
    const minApi = apiSpecs.filter((s) => s.type === "minimum");
    if (minApi.length > 0) {
      const findReq = (key: string) =>
        minApi.find((s) => s.label.toLowerCase().includes(key))?.requirement || "-";
      return {
        os: findReq("os"),
        cpu: findReq("cpu") !== "-" ? findReq("cpu") : findReq("processor"),
        ram: findReq("ram") !== "-" ? findReq("ram") : findReq("memory"),
        gpu: findReq("gpu") !== "-" ? findReq("gpu") : findReq("graphics"),
        directx: findReq("directx"),
        storage: findReq("storage"),
        soundCard: findReq("sound"),
      };
    }
    if (effectiveSteamData?.pc_requirements?.minimum) {
      return parseSteamRequirements(effectiveSteamData.pc_requirements.minimum, DEFAULT_EMPTY_SPECS);
    }
    return DEFAULT_EMPTY_SPECS;
  }, [apiProduct, effectiveSteamData]);

  const recSpecs: ParsedSystemRequirements = React.useMemo(() => {
    const apiSpecs =
      apiProduct?.specification_requirements ||
      apiProduct?.product_specification_requirements ||
      [];
    const recApi = apiSpecs.filter((s) => s.type === "recommended");
    if (recApi.length > 0) {
      const findReq = (key: string) =>
        recApi.find((s) => s.label.toLowerCase().includes(key))?.requirement || "-";
      return {
        os: findReq("os"),
        cpu: findReq("cpu") !== "-" ? findReq("cpu") : findReq("processor"),
        ram: findReq("ram") !== "-" ? findReq("ram") : findReq("memory"),
        gpu: findReq("gpu") !== "-" ? findReq("gpu") : findReq("graphics"),
        directx: findReq("directx"),
        storage: findReq("storage"),
        soundCard: findReq("sound"),
      };
    }
    if (effectiveSteamData?.pc_requirements?.recommended) {
      return parseSteamRequirements(effectiveSteamData.pc_requirements.recommended, DEFAULT_EMPTY_SPECS);
    }
    return DEFAULT_EMPTY_SPECS;
  }, [apiProduct, effectiveSteamData]);

  // Gallery screenshots from Steam or Backend
  const mediaList = (() => {
    const list: string[] = [];
    if (apiProduct?.thumbnail) {
      list.push(apiProduct.thumbnail);
    }
    if (effectiveSteamData?.screenshots && effectiveSteamData.screenshots.length > 0) {
      effectiveSteamData.screenshots.forEach((s) => {
        const url = s.full || s.thumbnail;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    const banner = (matchedProduct as { bannerSrc?: string })?.bannerSrc;
    if (banner && !list.includes(banner)) {
      list.push(banner);
    }
    const cover = (matchedProduct as { imageSrc?: string })?.imageSrc;
    if (cover && !list.includes(cover)) {
      list.push(cover);
    }
    if (list.length === 0 && appId > 0) {
      list.push(`https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`);
    }
    return list.filter(Boolean);
  })();

  // Dynamic Game Title & Description
  const gameTitle =
    apiProduct?.name ||
    effectiveSteamData?.name ||
    (matchedProduct as { title?: string })?.title ||
    "-";

  const gameDescription =
    apiProduct?.description ||
    steamData?.description ||
    (matchedProduct as { description?: string })?.description ||
    "-";

  const originalPrice = apiProduct
    ? formatRupiah(apiProduct.price)
    : (matchedProduct as { originalPrice?: string })?.originalPrice || "-";

  const price = apiProduct
    ? formatRupiah(apiProduct.price_discount || apiProduct.price)
    : (matchedProduct as { price?: string })?.price || "-";

  const discount = apiProduct
    ? formatDiscount(apiProduct.discount)
    : (matchedProduct as { discount?: string })?.discount || "";

  const currentProdId = String(
    (matchedProduct as { id?: string | number } | null)?.id || id || appId
  );
  const isOwned = isGameOwned(currentProdId, gameTitle, String(id));
  const isAlreadyInCart = isInCart(currentProdId, gameTitle);
  const isWishlisted = isItemWishlisted(currentProdId, gameTitle, currentUserId);

  // Buy Now Handler
  const handleBuyNow = () => {
    if (isOwned) {
      showToast("Anda sudah memiliki game ini di Library Anda!", "warning");
      return;
    }

    const prodId = currentProdId;
    const numericPrice = apiProduct?.price_discount || apiProduct?.price || 0;
    const numericOrigPrice = apiProduct?.price || numericPrice;
    const steamCover = appId ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/hero_capsule.jpg` : undefined;
    const coverImg = (matchedProduct as { imageSrc?: string })?.imageSrc || steamCover || apiProduct?.thumbnail || mediaList[0] || "";

    const productPayload = {
      id: prodId,
      title: gameTitle,
      price: numericPrice,
      originalPrice: numericOrigPrice,
      discount: discount,
      imageSrc: coverImg,
      cover_image_url: coverImg,
    };

    if (!isAlreadyInCart) {
      addItem(prodId, 1, productPayload);
      const numericId = apiProduct?.id || Number(prodId);
      if (isAuthenticated && !isNaN(numericId) && numericId > 0) {
        addToCartMutation.mutate(numericId);
      }
    }

    // Reset any stale previous order state before starting direct purchase
    clearOrderDetails();

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "gamezygo_checkout_items",
          JSON.stringify([
            {
              id: prodId,
              productId: Number(prodId) || 1,
              title: gameTitle,
              imageSrc: coverImg,
              price: numericPrice,
            },
          ])
        );
      }
    } catch {
      // ignore
    }

    const backTarget = router.asPath && router.asPath.startsWith("/") ? router.asPath : `/store/${id}`;
    const directCheckoutUrl = `/checkout?mode=direct&from=${encodeURIComponent(backTarget)}`;

    if (!isAuthenticated) {
      showToast("Silakan login terlebih dahulu untuk checkout.", "warning");
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(directCheckoutUrl)}`);
      }, 500);
      return;
    }

    router.push(directCheckoutUrl);
  };

  // Wishlist Handler
  const handleToggleWishlist = () => {
    const rawId = apiProduct?.id || (matchedProduct as { id?: string | number } | null)?.id || id;
    const numericId = typeof rawId === "number" ? rawId : Number(rawId);
    const steamCover = appId
      ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/hero_capsule.jpg`
      : undefined;

    const targetGame = {
      id: String(rawId),
      userId: currentUserId,
      productId: !isNaN(numericId) && numericId > 0 ? numericId : undefined,
      slug: typeof id === "string" ? id : undefined,
      steamAppId: appId,
      title: gameTitle,
      imageSrc:
        (matchedProduct as { imageSrc?: string })?.imageSrc ||
        steamCover ||
        apiProduct?.thumbnail ||
        mediaList[0] ||
        "",
      genres: gameGenres,
      platform: "Steam",
      launcher: "Steam",
    };

    const next = toggleWishlistStore(targetGame);

    if (isAuthenticated && !isNaN(numericId) && numericId > 0) {
      if (next) {
        addToWishlistMutation.mutate(numericId);
      } else {
        removeFromWishlistMutation.mutate(numericId);
      }
    }

    showToast(
      next
        ? `"${gameTitle}" berhasil ditambahkan ke Wishlist!`
        : `"${gameTitle}" dihapus dari Wishlist.`,
      next ? "success" : "error"
    );
  };

  // Shared product info & action buttons block
  const productInfoAndActions = (
    <div className="flex flex-col gap-6 w-full min-w-0 pt-0">
      {/* Product Info Block */}
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-8xl pb-6 sm:pb-8 lg:pb-12 border-b-gradient-secondary min-w-0">
        <div className="grid gap-3 sm:gap-6 lg:gap-8 min-w-0">
          {/* Launcher Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
            <SteamIcon className="w-4 h-4 text-white" />
            <span className="text-white">
              {apiProduct?.launcher_category?.name ||
                apiProduct?.product_launcher_category?.name ||
                (appId > 0 ? "Steam" : "-")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-h3 font-semibold text-white wrap-break-word">
            {gameTitle}
          </h1>

          {/* Description */}
          <p className="text-body-sm text-gray-400">
            {gameDescription}
          </p>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-1 sm:px-2">
            {originalPrice && originalPrice !== "-" && originalPrice !== price && (
              <span className="text-body-sm sm:text-body-md text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-2xl sm:text-h4 font-semibold text-white">
              {price}
            </span>
          </div>
          {discount && discount !== "0%" && discount !== "-0%" && (
            <Pill variant="primary" size="sm">
              {discount}
            </Pill>
          )}
        </div>
      </div>

      {/* Action Buttons Stack */}
      <div className="flex flex-col gap-3 w-full min-w-0">
        {isOwned ? (
          <div className="flex flex-col gap-2.5 w-full">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-body-sm flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Game ini sudah ada di Library akun Anda</span>
            </div>
            <Button
              onClick={() => router.push("/library")}
              size="sm"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
            >
              Buka di Library
            </Button>
          </div>
        ) : (
          <div className="flex gap-2.5 sm:gap-3 w-full">
            <Button
              onClick={handleBuyNow}
              size="sm"
              className="flex-1 py-3"
            >
              {isPreorder ? "Pre-order Sekarang" : "Beli Sekarang"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (isAlreadyInCart) {
                  showToast(`"${gameTitle}" sudah ada di keranjang belanja Anda!`, "warning");
                  setTimeout(() => toggleCart(true), 300);
                  return;
                }

                const prodId = currentProdId;
                const numericPrice = apiProduct?.price_discount || apiProduct?.price || 0;
                const numericOrigPrice = apiProduct?.price || numericPrice;
                const coverImg = mediaList[0] || apiProduct?.thumbnail || "";

                const productPayload = {
                  id: prodId,
                  title: gameTitle,
                  price: numericPrice,
                  originalPrice: numericOrigPrice,
                  discount: discount,
                  imageSrc: coverImg,
                  cover_image_url: coverImg,
                };

                addItem(prodId, 1, productPayload);
                showToast(`"${gameTitle}" berhasil ditambahkan ke keranjang!`, "success");
                const numericId = apiProduct?.id || Number(prodId);
                if (isAuthenticated && !isNaN(numericId) && numericId > 0) {
                  addToCartMutation.mutate(numericId);
                }
              }}
              className={cn(
                "w-12 sm:w-fit px-3 py-3 shrink-0 flex items-center justify-center cursor-pointer transition-all",
                isAlreadyInCart && "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
              )}
              aria-label="Tambah ke Keranjang"
              title={isAlreadyInCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}
            >
              <CartIcon className="size-4 text-deep-blue-100" />
            </Button>
          </div>
        )}

        {/* 2. Masukan Wishlist (Dark Secondary Button with Bookmark Icon on Right) */}
        <Button
          type="button"
          variant="outline"
          size='sm'
          onClick={handleToggleWishlist}
          className={cn(
            "w-full",
            isWishlisted && "border-rose-500/50 bg-rose-950/20"
          )}
        >
          <span className="text-sm font-medium">
            {isWishlisted ? "Tersimpan di Wishlist" : "Masukan Wishlist"}
          </span>
          <BookmarkIcon
            className={cn(
              "size-4 transition-colors",
              isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400"
            )}
          />
        </Button>

        {/* 3. Lihat di Launcher (Matching credentials page) */}
        <Button
          variant="outline"
          size="sm"
          className="w-full py-3"
          disabled={!apiProduct?.steam_url && appId <= 0}
          onClick={() => {
            const launcherUrl =
              apiProduct?.steam_url ||
              (appId > 0 ? `https://store.steampowered.com/app/${appId}` : null);
            if (launcherUrl) {
              window.open(launcherUrl, "_blank");
            }
          }}
        >
          Lihat di Launcher
        </Button>
      </div>

      {/* 4. Action Links: Hubungi Admin & Cara Bermain */}
      <div className="flex items-center justify-between py-1 w-full">
        <button
          type="button"
          onClick={() => {
            window.open(
              `https://wa.me/6281234567890?text=Halo%20Admin%20Gamezygo,%20saya%20butuh%20bantuan%20untuk%20game%20${encodeURIComponent(
                gameTitle
              )}`,
              "_blank"
            );
          }}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2 text-label-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer group"
        >
          <span>Hubungi Admin</span>
          <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-white transition-colors -scale-x-100 shrink-0" />
        </button>

        <div className="w-px h-5 sm:h-6 bg-white/10 shrink-0 mx-1" />

        <button
          type="button"
          onClick={() => {
            const guideEl = document.getElementById("panduan-mengunduh");
            if (guideEl) {
              guideEl.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              router.push("/blogs");
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2 text-label-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer group"
        >
          <span>Cara Bermain</span>
          <BookGuideIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-white transition-colors shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{`${gameTitle} — Toko Game Original | Gamezygo`}</title>
        <meta
          name="description"
          content={`Beli ${gameTitle} original murah dan bergaransi hanya di Gamezygo. Dapatkan akun instan dan panduan bermain lengkap.`}
        />
      </Head>

      <StoreLayout 
        hideSidebar={true} 
        navbarVariant={isAuthenticated ? "login" : "guest"} 
        activeNavId="toko"
        user={
          authUser
            ? {
                name: authUser.name || "Customer Gamezygo",
                avatarUrl: authUser.avatarUrl,
              }
            : undefined
        }
        onLoginClick={() =>
          router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
        }
        onSignUpClick={() =>
          router.push(
            `/login?mode=signup&redirect=${encodeURIComponent(router.asPath)}`
          )
        }
        onCartClick={() => toggleCart()}
        contentClassName="p-0"
      >
        <div className="w-full max-w-full min-w-0 px-4 sm:px-6 md:px-8 lg:px-20 flex flex-col gap-8 sm:gap-12 lg:gap-11xl py-6 sm:py-10 lg:py-16">
          {isProductLoading && !apiProduct ? (
            <section className="w-full max-w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="w-full min-w-0 flex flex-col gap-6 col-span-1 lg:col-span-7">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="w-full aspect-square sm:aspect-video rounded-xl" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 sm:w-16 h-13 sm:h-16 rounded-lg shrink-0" />
                  <div className="flex-1 flex gap-3 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <Skeleton key={idx} className="w-20 sm:w-28 aspect-video rounded-lg shrink-0" />
                    ))}
                  </div>
                  <Skeleton className="w-12 sm:w-16 h-13 sm:h-16 rounded-lg shrink-0" />
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="w-full min-w-0 col-span-1 lg:col-span-5 flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-9 w-44" />
                <div className="flex flex-col gap-3 pt-2">
                  <Skeleton className="h-11 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </section>
          ) : (
          <>
          {/* =========================================================================
              MAIN GRID: 1 Column on Mobile/Tablet (< lg), 7 Columns on Desktop (>= lg)
              ========================================================================= */}
          <section className="w-full max-w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* =====================================================================
                LEFT COLUMN (4 cols on Desktop, full width on Mobile/Tablet)
                ===================================================================== */}
            <div className="w-full min-w-0 max-w-full flex flex-col gap-30 lg:gap-11xl col-span-1 lg:col-span-7">
              {/* Media & Badges Section */}
              <section className="grid gap-6 sm:gap-10 min-w-0 max-w-full">
                <div className="flex flex-col gap-4 sm:gap-5 min-w-0 max-w-full">
                  <div className="w-full min-w-0 max-w-full overflow-hidden">
                    <Breadcrumbs
                      className="min-w-0 max-w-full"
                      items={[
                        { label: "Home", href: "/" },
                        { label: "Toko", href: "/store" },
                        { label: gameTitle },
                      ]}
                    />
                  </div>

                  {/* Main Media Display */}
                  {mediaList.length > 0 && (mediaList[activeMediaIndex] || mediaList[0]) ? (
                    <div className="relative w-full aspect-square sm:aspect-video rounded-xl overflow-hidden bg-deep-blue-900 border border-white/10 shadow-lg group">
                      <Image
                        src={mediaList[activeMediaIndex] || mediaList[0]}
                        alt={gameTitle}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square sm:aspect-video rounded-xl overflow-hidden bg-deep-blue-900/40 border border-white/10 shadow-lg flex flex-col items-center justify-center text-gray-500 gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-body-sm font-medium text-gray-400">Gambar tidak tersedia</span>
                    </div>
                  )}

                  {/* Thumbnails Row with Left and Right Navigation Buttons */}
                  {mediaList.length > 0 ? (
                    <div className="w-full min-w-0 max-w-full flex items-center gap-2.5 sm:gap-3">
                      {/* Previous Button */}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-12 sm:w-16 h-13 sm:h-16 p-0 shrink-0 flex items-center justify-center rounded-lg cursor-pointer"
                        onClick={handlePrevMedia}
                        aria-label="Media sebelumnya"
                      >
                        <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-50" />
                      </Button>

                      {/* Scrollable Thumbnails */}
                      <div
                        ref={thumbnailsRef}
                        className="flex-1 min-w-0 flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth"
                      >
                        {mediaList.map((thumb, idx) => (
                          <button
                            key={`thumb-${idx}`}
                            type="button"
                            onClick={() => setActiveMediaIndex(idx)}
                            className={`relative w-20 sm:w-28 aspect-video rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                              activeMediaIndex === idx
                                ? "border-rose-500 ring-2 ring-rose-500/40 opacity-100 scale-102"
                                : "border-white/10 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={thumb}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              sizes="112px"
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-12 sm:w-16 h-13 sm:h-16 p-0 shrink-0 flex items-center justify-center rounded-lg cursor-pointer"
                        onClick={handleNextMedia}
                        aria-label="Media berikutnya"
                      >
                        <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-50" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full min-w-0 max-w-full flex items-center gap-2.5 sm:gap-3 py-1">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={`skeleton-thumb-${idx}`}
                          className="relative w-20 sm:w-28 aspect-video rounded-lg overflow-hidden border border-white/5 bg-white/5"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Badges Row (Genre, Rating, Launcher) */}
                <div className="w-full min-w-0 max-w-full flex items-center justify-between gap-2.5 sm:gap-6 pt-2 sm:pt-4">
                  {/* Genre Column */}
                  <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1 overflow-hidden">
                    <span className="text-body-xs sm:text-body-sm text-gray-400">
                      GENRE
                    </span>
                    <div className="relative w-full overflow-hidden">
                      {gameGenres.length > 0 ? (
                        <>
                          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pr-6 py-0.5">
                            {gameGenres.map((g) => (
                              <Pill
                                key={g}
                                variant="secondary"
                                size="xs"
                                className="px-2 sm:px-3 shrink-0 whitespace-nowrap text-label-xs"
                              >
                                {g}
                              </Pill>
                            ))}
                          </div>
                          {/* Shadow at the right of content when having > 2 genres */}
                          {gameGenres.length > 2 && (
                            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-linear-to-l from-deep-blue-950 via-deep-blue-950/70 to-transparent" />
                          )}
                        </>
                      ) : (
                        <span className="text-body-sm text-gray-400 font-medium">-</span>
                      )}
                    </div>
                  </div>

                  {/* Rating Column: border-x-gradient-secondary with responsive padding */}
                  <div className="flex flex-col gap-1 sm:gap-1.5 shrink-0 border-x-gradient-secondary px-3 sm:px-8 lg:px-16 min-w-0">
                    <span className="text-body-xs sm:text-body-sm text-gray-400">
                      RATING
                    </span>
                    {apiProduct?.rating && apiProduct.rating > 0 ? (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-body-xs sm:text-body-md font-semibold text-white">
                          {apiProduct.rating.toFixed(1)}
                        </span>
                        <div className="flex items-center gap-0.5 sm:gap-1 text-white">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= Math.round(apiProduct.rating!) ? (
                              <StarFilledIcon key={star} className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current text-white shrink-0" />
                            ) : (
                              <StarRegularIcon key={star} className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current text-gray-500 shrink-0" />
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-body-sm text-gray-400 font-medium">-</span>
                    )}
                  </div>

                  {/* Launcher Column */}
                  <div className="flex flex-col gap-1 sm:gap-1.5 shrink-0 items-start pl-1 sm:pl-2 min-w-0">
                    <span className="text-body-xs sm:text-body-sm text-gray-400">
                      LAUNCHER
                    </span>
                    <span className="text-body-sm sm:text-body-md font-semibold text-gray-50">
                      {apiProduct?.launcher_category?.name ||
                        apiProduct?.product_launcher_category?.name ||
                        (appId > 0 ? "Steam" : "-")}
                    </span>
                  </div>
                </div>
              </section>

              {/* ===================================================================
                  MOBILE/TABLET ONLY: Product Info & Actions (< lg breakpoint)
                  Seamlessly placed between Media and Specs for mobile/tablet UX
                  =================================================================== */}
              <div className="block lg:hidden w-full min-w-0 ">
                {productInfoAndActions}
              </div>

              {/* ===================================================================
                  DETAIL SPESIFIKASI (MINIMUM & REKOMENDASI)
                  =================================================================== */}
              {(() => {
                const hasSpecValue = (val?: string | null) => {
                  const trimmed = (val ?? "").trim();
                  return Boolean(trimmed) && trimmed !== "-";
                };
                const minSpecItems = [
                  { label: "OS", value: minSpecs.os },
                  { label: "CPU", value: minSpecs.cpu },
                  { label: "RAM", value: minSpecs.ram },
                  { label: "GPU", value: minSpecs.gpu },
                  { label: "DirectX", value: minSpecs.directx },
                  { label: "Storage", value: minSpecs.storage },
                  { label: "Sound Card", value: minSpecs.soundCard },
                ].filter((item) => hasSpecValue(item.value));

                const recSpecItems = [
                  { label: "OS", value: recSpecs.os },
                  { label: "CPU", value: recSpecs.cpu },
                  { label: "RAM", value: recSpecs.ram },
                  { label: "GPU", value: recSpecs.gpu },
                  { label: "DirectX", value: recSpecs.directx },
                  { label: "Storage", value: recSpecs.storage },
                  { label: "Sound Card", value: recSpecs.soundCard },
                ].filter((item) => hasSpecValue(item.value));

                if (minSpecItems.length === 0 && recSpecItems.length === 0) {
                  return null;
                }

                return (
                  <section className="w-full min-w-0 max-w-full flex flex-col gap-4 sm:gap-6 pt-2 sm:pt-4">
                    <h2 className="text-h3 font-semibold text-gray-100">
                      Detail Spesifikasi
                    </h2>

                    <div
                      className={cn(
                        "grid gap-4 sm:gap-6 min-w-0",
                        minSpecItems.length > 0 && recSpecItems.length > 0
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1"
                      )}
                    >
                      {/* Card 1: MINIMUM */}
                      {minSpecItems.length > 0 && (
                        <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-4 sm:p-6 flex flex-col gap-4 min-w-0">
                          <span className="text-body-md font-semibold text-gray-50 uppercase">
                            MINIMUM
                          </span>

                          <div className="flex flex-col gap-4 sm:gap-6 text-body-sm min-w-0">
                            {minSpecItems.map((spec) => (
                              <div key={spec.label} className="flex flex-col gap-1.5 sm:gap-2">
                                <span className="text-body-xs text-gray-400">{spec.label}</span>
                                <span className="text-body-sm text-gray-100 font-semibold wrap-break-word">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card 2: REKOMENDASI */}
                      {recSpecItems.length > 0 && (
                        <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-4 sm:p-6 flex flex-col gap-4 min-w-0">
                          <span className="text-body-md font-semibold text-gray-50 uppercase">
                            REKOMENDASI
                          </span>

                          <div className="flex flex-col gap-4 sm:gap-6 text-body-sm min-w-0">
                            {recSpecItems.map((spec) => (
                              <div key={spec.label} className="flex flex-col gap-1.5 sm:gap-2">
                                <span className="text-body-xs text-gray-400">{spec.label}</span>
                                <span className="text-body-sm text-gray-100 font-semibold wrap-break-word">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* ===================================================================
                  PANDUAN MENGUNDUH (DYNAMIC INSTRUCTION TEMPLATE OR DEFAULT 4 STEPS)
                  =================================================================== */}
              <section id="panduan-mengunduh" className="w-full min-w-0 max-w-full flex flex-col gap-4 sm:gap-6 pt-2 sm:pt-4 scroll-mt-28">
                <h2 className="text-h3 font-semibold text-gray-100">
                  {apiProduct?.product_instruction?.title || "Panduan Mengunduh"}
                </h2>

                <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-5 sm:p-8 flex flex-col gap-4 sm:gap-6 min-w-0">
                  <div className="grid gap-5 sm:gap-6 pl-4 sm:pl-6 border-l-gradient-primary min-w-0">
                    {(() => {
                      const dynamicSteps = apiProduct?.product_instruction?.content
                        ? parseInstructionContentToSteps(
                            apiProduct.product_instruction.content,
                            apiProduct.product_instruction.title || "Panduan Mengunduh"
                          )
                        : [];

                      if (dynamicSteps.length > 0) {
                        return dynamicSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="grid gap-1.5 sm:gap-2 border-b-gradient-secondary pb-4 sm:pb-6 min-w-0"
                          >
                            <span className="text-body-xs text-gray-400 uppercase">
                              LANGKAH {step.stepNumber}
                            </span>
                            <h3 className="text-body-md font-semibold text-gray-100">
                              {step.title}
                            </h3>
                            {step.description && (
                              <p className="text-body-sm text-gray-400 whitespace-pre-line">
                                {step.description}
                              </p>
                            )}
                          </div>
                        ));
                      }

                      return (
                        <>
                          {/* Step 1 */}
                          <div className="grid gap-1.5 sm:gap-2 border-b-gradient-secondary pb-4 sm:pb-6 min-w-0">
                            <span className="text-body-xs text-gray-400 uppercase">
                              LANGKAH 1
                            </span>
                            <h3 className="text-body-md font-semibold text-gray-100">
                              Buka launcher Steam atau unduh di Gamezygo
                            </h3>
                            <p className="text-body-sm text-gray-400">
                              Buka katalog pembelian Anda di Gamezygo lalu klik &apos;Unduh Game&apos; atau buka launcher Steam resmi di PC Anda.
                            </p>
                          </div>

                          {/* Step 2 */}
                          <div className="grid gap-1.5 sm:gap-2 border-b-gradient-secondary pb-4 sm:pb-6 min-w-0">
                            <span className="text-body-xs text-gray-400 uppercase">
                              LANGKAH 2
                            </span>
                            <h3 className="text-body-md font-semibold text-gray-100">
                              Masukkan Akun yang telah diberikan
                            </h3>
                            <p className="text-body-sm text-gray-400">
                              Salin dan tempel Username serta Password akun game yang tertera pada kotak &apos;Informasi Akun Game&apos; di atas.
                            </p>
                          </div>

                          {/* Step 3 */}
                          <div className="grid gap-1.5 sm:gap-2 border-b-gradient-secondary pb-4 sm:pb-6 min-w-0">
                            <span className="text-body-xs text-gray-400 uppercase">
                              LANGKAH 3
                            </span>
                            <h3 className="text-body-md font-semibold text-gray-100">
                              Masuk ke library dan install game
                            </h3>
                            <p className="text-body-sm text-gray-400">
                              Setelah berhasil login ke Steam, buka tab Library, temukan game ini dan klik &apos;Install&apos; lalu tunggu hingga proses unduhan selesai.
                            </p>
                          </div>

                          {/* Step 4 */}
                          <div className="grid gap-1.5 sm:gap-2 border-b-gradient-secondary pb-4 sm:pb-6 min-w-0">
                            <span className="text-body-xs text-gray-400 uppercase">
                              LANGKAH 4
                            </span>
                            <h3 className="text-body-md font-semibold text-gray-100">
                              Login Steam &gt; Aktifkan Steam Mode Offline &gt; Mainkan Game Offline
                            </h3>
                            <p className="text-body-sm text-gray-400">
                              Penting: Sebelum bermain, ubah status Steam ke &apos;Go Offline&apos; melalui menu Steam &gt; Go Offline agar akun tidak bentrok dengan pengguna lain.
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </section>
            </div>

            {/* =====================================================================
                RIGHT COLUMN: DESKTOP ONLY (>= lg breakpoint)
                Sticky sidebar on desktop matching 100% designer specification
                ===================================================================== */}
            <div 
              style={{ position: "sticky", top: "150px" }}
              className="hidden lg:flex w-full self-start flex-col gap-6 col-span-5 min-w-0 z-10"
            >
              {productInfoAndActions}
            </div>
          </section>
          </>
          )}
        </div>

        {/* Global Floating Toast */}
        {toast && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant={toast.variant}
              title={toast.title}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
