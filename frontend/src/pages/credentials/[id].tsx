import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Breadcrumbs,
  Button,
  Pill,
  Skeleton,
  TestimonialCard,
  Toast,
} from "@/components/ui";
import { CredentialRevealer } from "@/features/library";
import {
  fetchSteamGame,
  parseSteamRequirements,
  type SteamGameDetails,
  type ParsedSystemRequirements,
} from "@/services/steam";
import productsData from "@/json/products.json";
import { OWNED_LIBRARY_GAMES } from "@/pages/library";
import { useGameCredentials, useUserLibrary } from "@/hooks/use-library";
import { useProductDetail } from "@/hooks/use-products";
import { formatRupiah } from "@/utils/formatters";
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

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================================
// MOCK TESTIMONIAL DATA
// ============================================================================

const TESTIMONIALS_DATA = [
  {
    id: "t-1",
    userName: "Cihuyy6767",
    gameName: "Black Myth Wukong, 2+",
    avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh \" test drive \" buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...”",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
  {
    id: "t-2",
    userName: "Rendy Pratama",
    gameName: "Assassin's Creed Black Flag",
    avatarSrc: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“Proses instan banget, begitu selesai bayar langsung muncul username sama passwordnya. Akun lancar jaya tinggal switch Steam ke offline mode trus tamatin story-nya tanpa gangguan. Recommended seller!”",
    images: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1552824722-ddab1374e622?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
  {
    id: "t-3",
    userName: "Bima_Gaming99",
    gameName: "Elden Ring: Shadow of the Erdtree",
    avatarSrc: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“Awalnya ragu beli shared account, pas dicoba ternyata gampang banget tutorialnya. Adminnya juga responsif pas ditanya cara aktivasi offline. Hemat ratusan ribu buat main game AAA impian!”",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
  {
    id: "t-4",
    userName: "Aldo_Kurnia",
    gameName: "Cyberpunk 2077: Phantom Liberty",
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“Gamezygo penyelamat dompet mahasiswa! Spek game detail banget ditampilin jadi sebelum beli tau kuat apa ngga PC gue. Sukses terus Gamezygo!”",
    images: [
      "https://images.unsplash.com/photo-1612287233216-52c6f1f8b65c?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
];

interface StaticProductFallback {
  id?: string | number;
  steamAppId?: number;
  title?: string;
  name?: string;
  description?: string;
  isPreorder?: boolean;
  state?: string;
  genres?: string[];
  bannerSrc?: string;
  imageSrc?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
}

interface SpecItem {
  type?: string;
  label?: string;
  requirement?: string;
}

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

export default function GameCredentialPage() {
  const router = useRouter();
  const { id } = router.query;
  const productSlug = typeof id === "string" ? id : "";

  // 1. Fetch user's purchased games in library
  const { data: libraryRes, isLoading: isLibraryLoading } = useUserLibrary();
  const libraryGame = React.useMemo(() => {
    if (!id || !libraryRes?.data) return null;
    const target = String(id).toLowerCase();
    return libraryRes.data.find(
      (g) => g.slug?.toLowerCase() === target || String(g.id) === target
    );
  }, [id, libraryRes]);

  // 2. Fetch product catalog detail by slug
  const { data: productApiRes, isLoading: isProductLoading } = useProductDetail(productSlug);
  const apiProduct = productApiRes?.data;

  // Local state
  const [steamData, setSteamData] = React.useState<SteamGameDetails | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [failedHeroSrc, setFailedHeroSrc] = React.useState<string | null>(null);
  const [prevId, setPrevId] = React.useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setActiveMediaIndex(0);
  }

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [opinionInput, setOpinionInput] = React.useState("");

  // Quadrupled items for seamless infinite moving carousel (matching blogs/[id].tsx)
  const infiniteTestimonials = React.useMemo(() => {
    return [
      ...TESTIMONIALS_DATA,
      ...TESTIMONIALS_DATA,
      ...TESTIMONIALS_DATA,
      ...TESTIMONIALS_DATA,
    ];
  }, []);

  // Match game in local static catalog fallback if any
  const matchedStaticProduct = React.useMemo((): StaticProductFallback | null => {
    if (!id || typeof id !== "string") return null;

    const allProducts = [
      ...OWNED_LIBRARY_GAMES,
      ...((productsData as { miniFeatured?: Array<Record<string, unknown>> }).miniFeatured || []),
      ...((productsData as { tawaranKhusus?: Array<Record<string, unknown>> }).tawaranKhusus || []),
    ];

    const match = allProducts.find(
      (p) =>
        String(p.id).toLowerCase() === id.toLowerCase() ||
        String((p as { steamAppId?: number }).steamAppId) === id
    );
    return (match as StaticProductFallback) || null;
  }, [id]);

  // Detected Steam App ID (only if real steam URL or valid steam ID exists)
  const detectedSteamAppId = React.useMemo(() => {
    const rawSteamUrl =
      apiProduct?.steam_url || (libraryGame as { steam_url?: string } | null)?.steam_url || "";
    const match =
      rawSteamUrl.match(/\/app(?:s)?\/(\d+)/i) ||
      rawSteamUrl.match(/\/apps\/(\d+)\//i);
    if (match && match[1]) {
      const parsed = Number(match[1]);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    const numId = Number(id);
    if (!isNaN(numId) && numId > 1000) return numId;

    if (matchedStaticProduct?.steamAppId) {
      return matchedStaticProduct.steamAppId;
    }

    return null;
  }, [apiProduct, libraryGame, id, matchedStaticProduct]);

  // Fetch Steam Game Details only when a legitimate steamAppId exists
  React.useEffect(() => {
    if (!detectedSteamAppId) return;

    let isMounted = true;
    fetchSteamGame(detectedSteamAppId)
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
  }, [detectedSteamAppId]);

  const effectiveSteamData = detectedSteamAppId ? steamData : null;

  // Resolve Real Game Title (Prioritize user library / catalog DB over fallback)
  const gameTitle = React.useMemo(() => {
    if (libraryGame?.name) return libraryGame.name;
    if (apiProduct?.name) return apiProduct.name;
    if (effectiveSteamData?.name) return effectiveSteamData.name;
    if (matchedStaticProduct?.title)
      return matchedStaticProduct.title;
    if (typeof id === "string" && id) {
      // Convert slug into Title Case, removing random trailing numbers
      return id
        .replace(/-\d+$/, "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return "Informasi Game";
  }, [libraryGame, apiProduct, effectiveSteamData, matchedStaticProduct, id]);

  // Resolve Game Description
  const gameDescription = React.useMemo(() => {
    if (apiProduct?.description) return apiProduct.description;
    if ((libraryGame as { description?: string } | null)?.description)
      return (libraryGame as { description?: string }).description;
    if (effectiveSteamData?.description) return effectiveSteamData.description;
    if (matchedStaticProduct?.description)
      return matchedStaticProduct.description;
    return "-";
  }, [apiProduct, libraryGame, effectiveSteamData, matchedStaticProduct]);

  // Pre-order detection: If game is in Library, it is already owned & delivered!
  const isPreorder = React.useMemo(() => {
    if (libraryGame) return false;
    if (router.query.preorder === "true" || router.query.state === "pre-order")
      return true;
    if (router.query.preorder === "false") return false;
    return Boolean(
      apiProduct?.status === "pre-order" ||
        matchedStaticProduct?.isPreorder ||
        matchedStaticProduct?.state === "pre-order"
    );
  }, [libraryGame, router.query, apiProduct, matchedStaticProduct]);

  // Resolved genres list
  const gameGenres: string[] = React.useMemo(() => {
    if (libraryGame?.categories && libraryGame.categories.length > 0) {
      return libraryGame.categories.map((c: { name?: string } | string) =>
        typeof c === "string" ? c : c.name || ""
      );
    }
    if (apiProduct?.categories && apiProduct.categories.length > 0) {
      return apiProduct.categories.map((c: { name?: string } | string) =>
        typeof c === "string" ? c : c.name || ""
      );
    }
    if (
      apiProduct?.product_genre_categories &&
      apiProduct.product_genre_categories.length > 0
    ) {
      return apiProduct.product_genre_categories.map((c: { name?: string } | string) =>
        typeof c === "string" ? c : c.name || ""
      );
    }
    if (effectiveSteamData?.genres && effectiveSteamData.genres.length > 0) {
      return effectiveSteamData.genres.map((g: { description?: string; name?: string } | string) =>
        typeof g === "string" ? g : g.description || g.name || "Action"
      );
    }
    if (
      Array.isArray(matchedStaticProduct?.genres) &&
      matchedStaticProduct.genres.length > 0
    ) {
      return matchedStaticProduct.genres;
    }
    return ["Action", "Adventure", "RPG"];
  }, [libraryGame, apiProduct, effectiveSteamData, matchedStaticProduct]);

  // Gallery Media List (matching store/[id].tsx without hardcoded dummy fallbacks)
  const mediaList = React.useMemo(() => {
    const list: string[] = [];
    if (libraryGame?.thumbnail) list.push(libraryGame.thumbnail);
    if (apiProduct?.thumbnail && !list.includes(apiProduct.thumbnail)) {
      list.push(apiProduct.thumbnail);
    }
    if (effectiveSteamData?.screenshots && effectiveSteamData.screenshots.length > 0) {
      effectiveSteamData.screenshots.slice(0, 5).forEach((s) => {
        const url = s.full || s.thumbnail;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    if (
      matchedStaticProduct?.bannerSrc &&
      !list.includes(matchedStaticProduct.bannerSrc)
    ) {
      list.push(matchedStaticProduct.bannerSrc);
    }
    if (
      matchedStaticProduct?.imageSrc &&
      !list.includes(matchedStaticProduct.imageSrc)
    ) {
      list.push(matchedStaticProduct.imageSrc);
    }
    if (list.length === 0 && detectedSteamAppId && detectedSteamAppId > 0) {
      list.push(`https://cdn.akamai.steamstatic.com/steam/apps/${detectedSteamAppId}/header.jpg`);
    }
    return list.filter(Boolean);
  }, [libraryGame, apiProduct, effectiveSteamData, matchedStaticProduct, detectedSteamAppId]);

  // Price calculations
  const rawPrice = libraryGame?.price || apiProduct?.price || 0;
  const rawDiscountPrice =
    libraryGame?.discount_price || (apiProduct as { discount_price?: number } | null)?.discount_price || 0;

  const displayPrice = rawPrice
    ? formatRupiah(rawDiscountPrice > 0 ? rawDiscountPrice : rawPrice)
    : matchedStaticProduct?.price || "-";

  const displayOriginalPrice =
    rawDiscountPrice > 0 && rawPrice > rawDiscountPrice
      ? formatRupiah(rawPrice)
      : matchedStaticProduct?.originalPrice || null;

  const displayDiscount =
    rawDiscountPrice > 0 && rawPrice > rawDiscountPrice
      ? `-${Math.round(((rawPrice - rawDiscountPrice) / rawPrice) * 100)}%`
      : matchedStaticProduct?.discount || null;

  // Parse Minimum & Recommended specifications matching store/[id].tsx
  const minSpecs: ParsedSystemRequirements = React.useMemo(() => {
    const apiSpecs =
      (apiProduct?.specification_requirements as SpecItem[] | undefined) ||
      (apiProduct?.product_specification_requirements as SpecItem[] | undefined) ||
      ((libraryGame as { specification_requirements?: SpecItem[] } | null)?.specification_requirements) ||
      [];
    const minApi = apiSpecs.filter((s) => s.type === "minimum");
    if (minApi.length > 0) {
      const findReq = (key: string) =>
        minApi.find((s) => s.label?.toLowerCase().includes(key))?.requirement || "-";
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
  }, [apiProduct, libraryGame, effectiveSteamData]);

  const recSpecs: ParsedSystemRequirements = React.useMemo(() => {
    const apiSpecs =
      (apiProduct?.specification_requirements as SpecItem[] | undefined) ||
      (apiProduct?.product_specification_requirements as SpecItem[] | undefined) ||
      ((libraryGame as { specification_requirements?: SpecItem[] } | null)?.specification_requirements) ||
      [];
    const recApi = apiSpecs.filter((s) => s.type === "recommended");
    if (recApi.length > 0) {
      const findReq = (key: string) =>
        recApi.find((s) => s.label?.toLowerCase().includes(key))?.requirement || "-";
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
  }, [apiProduct, libraryGame, effectiveSteamData]);

  // Fetch real credentials from API (GET /api/v1/user/products/:slug/credentials)
  const {
    data: credentialsRes,
    isLoading: isCredsLoading,
    isError: isCredsError,
    error: credsError,
  } = useGameCredentials(productSlug);

  // Strict ownership verification to protect against IDOR (BUG-002)
  const isOwnershipVerified = Boolean(
    libraryGame || (credentialsRes?.data && credentialsRes.data.username)
  );

  const credsStatus = (credsError as { response?: { status?: number } } | null)?.response?.status;
  const isAccessDenied =
    !isCredsLoading &&
    !isLibraryLoading &&
    (credsStatus === 403 || credsStatus === 401 || credsStatus === 404 || isCredsError || !isOwnershipVerified);

  // Strictly only expose credentials if ownership is verified
  const accountUsername = isOwnershipVerified
    ? credentialsRes?.data?.username || ""
    : "";
  const accountPassword = isOwnershipVerified
    ? credentialsRes?.data?.password || ""
    : "";

  return (
    <>
      <Head>
        <title>{`${gameTitle} — Akun & Kredensial | Gamezygo`}</title>
        <meta
          name="description"
          content={`Informasi kredensial login akun dan panduan bermain ${gameTitle} di Gamezygo.`}
        />
      </Head>

      <StoreLayout 
        navbarVariant="private">
        <div className="w-full flex flex-col gap-10 lg:gap-11xl pb-16">
          {(isProductLoading || isCredsLoading || isLibraryLoading) && !apiProduct && !credentialsRes && !libraryGame ? (
            <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="flex flex-col gap-6">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="w-full aspect-square rounded-xl" />
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="w-24 aspect-video rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <Skeleton className="h-7 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </section>
          ) : (
          <>
          {/* =========================================================================
              B. HERO SECTION (GAME MEDIA & CREDENTIAL CARD)
              ========================================================================= */}
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Media Preview, Carousel & Badges (7 cols) */}
            <div className=" h-full flex flex-col gap-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Perpustakaan", href: "/library" },
                { label: gameTitle },
              ]}
            />

              {/* Main Media Display matching store/[id].tsx */}
              {(() => {
                const currentHeroImage = mediaList[activeMediaIndex] || mediaList[0];
                const isHeroError = Boolean(failedHeroSrc && failedHeroSrc === currentHeroImage);
                if (mediaList.length > 0 && currentHeroImage && !isHeroError) {
                  return (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-deep-blue-900 border border-white/10 shadow-lg group">
                      <Image
                        src={currentHeroImage}
                        alt={gameTitle}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        onError={() => setFailedHeroSrc(currentHeroImage)}
                        className="object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  );
                }
                return (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-deep-blue-900/40 border border-white/10 shadow-lg flex flex-col items-center justify-center text-gray-500 gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-body-sm font-medium text-gray-400">Gambar tidak tersedia</span>
                  </div>
                );
              })()}

              {/* Thumbnails Row matching store/[id].tsx */}
              {mediaList.length > 0 ? (
                <div className="w-full flex gap-3 overflow-x-auto no-scrollbar py-2">
                  {mediaList.map((thumb, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
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
              ) : (
                <div className="w-full flex items-center gap-2.5 sm:gap-3 py-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={`empty-thumb-${idx}`}
                      className="w-24 sm:w-28 aspect-video rounded-lg bg-deep-blue-900/30 border border-white/5 shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Badges Row (Genre, Rating, Launcher) */}
              <div className="w-full grid grid-cols-3 items-center justify-between sm:justify-start flex-wrap sm:flex-nowrap gap-3 sm:gap-5 pt-4">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1 sm:flex-none">
                  <span className="text-body-xs text-gray-400">
                    GENRE
                  </span>
                  <div className="relative w-full overflow-hidden">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pr-6 py-0.5">
                      {gameGenres.map((g) => (
                        <Pill
                          key={g}
                          variant="secondary"
                          size="xs"
                          className="px-2.5 sm:px-3 shrink-0 whitespace-nowrap"
                        >
                          {g}
                        </Pill>
                      ))}
                    </div>
                    {/* Shadow at the right of content when having > 2 genres */}
                    {gameGenres.length > 2 && (
                      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-deep-blue-950 via-deep-blue-950/70 to-transparent" />
                    )}
                  </div>
                </div>

                {/* Divider 1: Hidden on mobile, visible on desktop */}
                {/* <div className="hidden sm:block h-8 w-px bg-surface-secondary-hover shrink-0" /> */}
                <div className="flex border-x-gradient-secondary justify-center">
                <div className="flex flex-col gap-1.5 shrink-0 ">

                  <span className="text-body-xs text-gray-400">
                    RATING
                  </span>
                  <div className="flex items-center gap-3 sm:gap-2">
                    <span className="text-body-sm font-semibold text-white">4.0</span>
                    <div className="flex items-center gap-1 text-white">
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarRegularIcon className="w-4 h-4 fill-current text-gray-500 shrink-0" />
                    </div>
                  </div>
                </div>
                </div>

                {/* Divider 2: Hidden on mobile, visible on desktop */}
                {/* <div className="hidden sm:block h-8 w-px bg-surface-secondary-hover shrink-0" /> */}

                <div className="flex flex-col gap-1.5 shrink-0">
                  <span className="text-body-xs text-gray-400">
                    LAUNCHER
                  </span>
                  <span className="text-body-sm font-semibold text-gray-50">
                    Steam
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Action, & Account Credentials Card (5 cols) */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-8xl pb-12 border-b-gradient-secondary">
                <div className="grid gap-8">
                  <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                    <SteamIcon className="w-4 h-4 text-white" />
                    <span className="text-white">Steam</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-h3 font-semibold text-white">
                    {gameTitle}
                  </h1>

                  {/* Description */}
                  <p className="text-body-sm text-gray-400">
                    {gameDescription}
                  </p>
                </div>

                {/* Price Row */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2">
                    {displayOriginalPrice && (
                      <span className="text-body-md text-gray-400 line-through">
                        {displayOriginalPrice}
                      </span>
                    )}
                    <span className="text-h4 font-semibold text-white">
                      {displayPrice}
                    </span>
                  </div>
                  {displayDiscount && (
                    <Pill variant="primary" size="sm">
                      {displayDiscount}
                    </Pill>
                  )}
                </div>
              </div>

              {/* Action Button: Lihat di Launcher */}
              <Button
                variant="outline"
                size="sm"
                className="w-full py-3"
                onClick={() => {
                  window.open("https://store.steampowered.com/about/", "_blank");
                }}
              >
                Lihat di Launcher
              </Button>

              {/* ===================================================================
                  INFORMASI AKUN GAME CARD (Modular CredentialRevealer Component)
                  =================================================================== */}
              {isAccessDenied ? (
                <div className="mt-5 w-full rounded-2xl bg-deep-blue-900/90 border border-red-500/30 p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-xl backdrop-blur-md">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-1">
                    <LockIcon className="w-7 h-7 text-[#DF3848]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-h4 font-bold text-white">
                      Akses Kredensial Ditolak
                    </h3>
                    <p className="text-body-sm text-gray-400 leading-relaxed">
                      Anda belum memiliki lisensi game <span className="text-white font-semibold">{gameTitle}</span> di perpustakaan akun Anda. Beli game ini untuk membuka kredensial akun dan panduan bermain.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="w-full sm:flex-1 py-3"
                      onClick={() => router.push(productSlug ? `/store/${productSlug}` : "/store")}
                    >
                      Beli di Store
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full sm:flex-1 py-3"
                      onClick={() => router.push("/library")}
                    >
                      Ke Perpustakaan
                    </Button>
                  </div>
                </div>
              ) : (
                <CredentialRevealer
                  gameTitle={gameTitle}
                  username={accountUsername}
                  password={accountPassword}
                  accessToken={credentialsRes?.data?.access_token}
                  isPreorder={isPreorder}
                  isLoading={(isCredsLoading || isLibraryLoading) && !credentialsRes}
                  onCopySuccess={(field) => {
                    setToastMessage(`${field} berhasil disalin ke clipboard!`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="mt-5"
                />
              )}
              </div>
          </section>

          {/* =========================================================================
              C. DETAIL SPESIFIKASI (MINIMUM & REKOMENDASI)
              ========================================================================= */}
          <section className="w-full flex flex-col gap-6 pt-4">
            <h2 className="text-h3 font-semibold text-gray-100">
              Detail Spesifikasi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: MINIMUM */}
              <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-6 flex flex-col gap-4">
                <span className="text-body-md font-semibold text-gray-50  uppercase">
                  MINIMUM
                </span>

                <div className="flex flex-col gap-6 text-body-sm ">
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">OS</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.os}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">CPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.cpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">RAM</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.ram}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">GPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.gpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">DirectX</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.directx}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Storage</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.storage}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Sound Card</span>
                    <span className="text-body-sm text-gray-100 font-semibold">
                      {minSpecs.soundCard || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: REKOMENDASI */}
              <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-6 flex flex-col gap-4">
                <span className="text-body-md font-semibold text-gray-50  uppercase">
                  REKOMENDASI
                </span>

                <div className="flex flex-col gap-6 text-body-sm">
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">OS</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.os}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">CPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.cpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">RAM</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.ram}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">GPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.gpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">DirectX</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.directx}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Storage</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.storage}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Sound Card</span>
                    <span className="text-body-sm text-gray-100 font-semibold">
                      {recSpecs.soundCard || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              D. PANDUAN MENGUNDUH (DYNAMIC INSTRUCTION TEMPLATE OR DEFAULT 4 STEPS)
              ========================================================================= */}
          <section className="w-full flex flex-col gap-6 pt-4">
            <h2 className="text-h3 font-semibold text-gray-100">
              {apiProduct?.product_instruction?.title || "Panduan Mengunduh"}
            </h2>

            <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-6 sm:p-8 flex flex-col gap-6">
            <div className="grid gap-6 pl-6 border-l-gradient-primary">
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
                      className="grid gap-2 pl-2 border-b-gradient-secondary pb-6"
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
                    <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
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
                    <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
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
                    <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
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
                    <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
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

          {/* =========================================================================
              E. TESTIMONIAL SECTION (MATCHING SCREENSHOT 4 & SLIDER)
              ========================================================================= */}
          <section className="w-full flex flex-col gap-13 pt-4">
            {/* Testimonial Header with Red Accent Bar */}
            <div className="border-l-4 border-l-gradient-primary pl-8 pb-6 flex flex-col gap-8">
              <div className="grid gap-3">
              <span className="text-body-sm text-gray-400 uppercase">
                TESTIMONIAL
              </span>
              <h2 className="text-h3 sm:text-h2 font-semibold text-gradient-heading w-fit">
                Dengarkan Pendapat Gamer <br /> Setelah Beli di Gamezygo!
              </h2>
            </div>

            {/* "Beri Pendapat" Input Bar */}
            <div className="relative w-full sm:max-w-120">
              <div className="w-full flex items-center bg-deep-blue-900 border border-white/10 rounded-xl px-4 py-3 gap-3 focus-within:border-white/30 transition-all">
                <span className="text-gray-400 text-body-sm font-semibold">@</span>
                <input
                  type="text"
                  value={opinionInput}
                  onChange={(e) => setOpinionInput(e.target.value)}
                  placeholder="Beri pendapat"
                  className="w-full bg-transparent text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && opinionInput.trim()) {
                      setToastMessage("Terima kasih atas pendapat Anda!");
                      setOpinionInput("");
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (opinionInput.trim()) {
                      setToastMessage("Terima kasih atas pendapat Anda!");
                      setOpinionInput("");
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            </div>

            {/* Infinite Moving Testimonial Cards Carousel (matching blogs/[id].tsx) */}
            <div className="relative w-full overflow-hidden pt-2 sm:pt-4 pb-6 sm:pb-8">
              {/* Vignette gradient masks on sides */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-deep-blue-950 to-transparent z-10 hidden sm:block" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-l from-deep-blue-950 to-transparent z-10 hidden sm:block" />

              {/* Moving Track */}
              <div className="flex gap-6 w-max animate-infinite-carousel hover:[animation-play-state:paused] items-stretch py-2">
                {infiniteTestimonials.map((t, idx) => (
                  <div
                    key={`${t.id}-${idx}`}
                    className="w-80 sm:w-96 shrink-0 transition-transform duration-300 hover:scale-[1.01]"
                  >
                    <TestimonialCard
                      avatarSrc={t.avatarSrc}
                      userName={t.userName}
                      gameName={t.gameName}
                      rating={t.rating}
                      review={t.review}
                      images={t.images}
                      className="h-full bg-deep-blue-900 border border-white/10 flex flex-col justify-between"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
          </>
          )}
        </div>

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant="success"
              title="Berhasil"
              description={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
