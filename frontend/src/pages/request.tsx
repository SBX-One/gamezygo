import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  Button,
  ListRowSkeleton,
  Toast,
  RequestListItem,
  type RequestCardVariant,
} from "@/components/ui";
import {
  useInfiniteGameRequests,
  useCreateGameRequest,
  useDeleteGameRequest,
  useVoteGameRequest,
  useUnvoteGameRequest,
} from "@/hooks/use-requests";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useProducts } from "@/hooks/use-products";
import { useAuthStore } from "@/stores/use-auth-store";
import productsData from "@/json/products.json";

// Storage Keys for Local Persistence
const LOCAL_STORAGE_KEY_MY_REQUESTS = "gamezygo_my_requests";
const LOCAL_STORAGE_KEY_COMMUNITY_REQUESTS = "gamezygo_community_requests";
const LOCAL_STORAGE_KEY_UPVOTED = "gamezygo_upvoted_requests";

// Helper to extract Steam App ID from various Steam URL patterns
function extractSteamAppId(url: string): number | null {
  const trimmed = url.trim();
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  const match =
    trimmed.match(/\/app\/(\d+)/i) ||
    trimmed.match(/store\.steampowered\.com\/app\/(\d+)/i) ||
    trimmed.match(/appids?=(\d+)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

// Cross Icon for clearing input
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

// Book / Notebook Icon for Empty State (Screenshot 4)
const BookEmptyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-gray-300"
    {...props}
  >
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="8"
      y1="7"
      x2="16"
      y2="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="11"
      x2="13"
      y2="11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Arrow Left Icon
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

interface RequestGameData {
  id: string;
  title: string;
  imageSrc: string;
  requestDate: string;
  requestCount: number;
  isUpvoted?: boolean;
}

// Initial Data for Tab 2: Request Komunitas
const INITIAL_COMMUNITY_REQUESTS: RequestGameData[] = [
  {
    id: "tk-ghost-tsushima",
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    requestDate: "18/07/2026",
    requestCount: 88,
    isUpvoted: false,
  },
  {
    id: "tk-rdr-2",
    title: "Red Dead Redemption 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    requestDate: "19/07/2026",
    requestCount: 76,
    isUpvoted: true,
  },
  {
    id: "tk-fc-26",
    title: "EA SPORTS FC 26",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    requestDate: "20/07/2026",
    requestCount: 64,
    isUpvoted: false,
  },
  {
    id: "subnautica-2",
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    requestDate: "21/07/2026",
    requestCount: 52,
    isUpvoted: false,
  },
  {
    id: "rt-dead-by-daylight",
    title: "Dead by Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    requestDate: "22/07/2026",
    requestCount: 45,
    isUpvoted: false,
  },
  {
    id: "beholder-conductor",
    title: "Beholder: Conductor",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    requestDate: "23/07/2026",
    requestCount: 39,
    isUpvoted: false,
  },
];

// Initial Data for Tab 3: Telah Ditambahkan (Game yang sudah tersedia di toko katalog)
const INITIAL_ADDED_REQUESTS: RequestGameData[] = [
  {
    id: "tk-gta-v",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    requestDate: "15/07/2026",
    requestCount: 142,
  },
  {
    id: "ac-black-flag",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    requestDate: "16/07/2026",
    requestCount: 110,
  },
  {
    id: "tk-ghost-tsushima",
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    requestDate: "17/07/2026",
    requestCount: 95,
  },
  {
    id: "tk-rdr-2",
    title: "Red Dead Redemption 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    requestDate: "18/07/2026",
    requestCount: 88,
  },
  {
    id: "tk-fc-26",
    title: "EA SPORTS FC 26",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    requestDate: "19/07/2026",
    requestCount: 79,
  },
  {
    id: "rt-dead-by-daylight",
    title: "Dead by Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    requestDate: "20/07/2026",
    requestCount: 63,
  },
];

type TabId = "my-requests" | "community" | "added";

const TAB_OPTIONS: { id: TabId; label: string }[] = [
  { id: "my-requests", label: "Request saya" },
  { id: "community", label: "Request Komunitas" },
  { id: "added", label: "Telah Ditambahkan" },
];

export default function RequestGamePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Active Tab State
  const [activeTab, setActiveTab] = React.useState<TabId>("my-requests");

  // Force Empty State Preview Toggle (for testing Screenshot 4)
  const [forceEmptyState, setForceEmptyState] = React.useState<boolean>(false);

  // Store Link Input State & Validation
  const [storeUrl, setStoreUrl] = React.useState<string>("");
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // TanStack Query: Game Requests API (Infinite Scroll)
  const scope =
    activeTab === "my-requests"
      ? "mine"
      : activeTab === "added"
      ? "added"
      : "all";
  const {
    data: requestsPages,
    isLoading: isRequestsLoading,
    fetchNextPage: fetchNextRequestsPage,
    hasNextPage: hasNextRequestsPage,
    isFetchingNextPage: isFetchingNextRequestsPage,
  } = useInfiniteGameRequests({
    scope,
  });

  const { sentinelRef: requestsSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextRequestsPage,
    isFetchingNextPage: isFetchingNextRequestsPage,
    fetchNextPage: fetchNextRequestsPage,
  });

  const requestsApiItems = React.useMemo(() => {
    return requestsPages?.pages?.flatMap((page) => page.data ?? []) ?? [];
  }, [requestsPages]);

  // Fetch catalog products when viewing "added" tab to resolve exact product slugs (BUG-023)
  const { data: catalogRes } = useProducts();
  const catalogProducts = React.useMemo(
    () => (Array.isArray(catalogRes?.data) ? catalogRes.data : []),
    [catalogRes]
  );

  const createRequestMutation = useCreateGameRequest();
  const deleteRequestMutation = useDeleteGameRequest();
  const voteMutation = useVoteGameRequest();
  const unvoteMutation = useUnvoteGameRequest();

  // Request Datasets with initial defaults
  const [myRequests, setMyRequests] =
    React.useState<RequestGameData[]>([]);
  const [communityRequests, setCommunityRequests] =
    React.useState<RequestGameData[]>(INITIAL_COMMUNITY_REQUESTS);
  const [addedRequests] =
    React.useState<RequestGameData[]>(INITIAL_ADDED_REQUESTS);

  // Hydrate from localStorage on client mount (only for unauthenticated guest sessions)
  React.useEffect(() => {
    try {
      if (!isAuthenticated) {
        // 1. My Requests for guest
        const savedMy = localStorage.getItem(LOCAL_STORAGE_KEY_MY_REQUESTS);
        if (savedMy) {
          const parsed = JSON.parse(savedMy);
          if (Array.isArray(parsed)) {
            const timer = setTimeout(() => {
              setMyRequests(parsed);
            }, 0);
            return () => clearTimeout(timer);
          }
        }
      } else {
        const timer = setTimeout(() => {
          setMyRequests([]);
        }, 0);
        return () => clearTimeout(timer);
      }

      // 2. Upvoted Request IDs
      const savedUpvotes = localStorage.getItem(LOCAL_STORAGE_KEY_UPVOTED);
      const upvotedIds: string[] = savedUpvotes ? JSON.parse(savedUpvotes) : [];

      // 3. Community Requests
      const savedCommunity = localStorage.getItem(LOCAL_STORAGE_KEY_COMMUNITY_REQUESTS);
      if (savedCommunity) {
        const parsedComm = JSON.parse(savedCommunity);
        if (Array.isArray(parsedComm)) {
          const timer = setTimeout(() => {
            setCommunityRequests(
              parsedComm.map((item: RequestGameData) => ({
                ...item,
                isUpvoted: upvotedIds.includes(item.id),
              }))
            );
          }, 0);
          return () => clearTimeout(timer);
        }
      } else {
        const initialWithUpvotes = INITIAL_COMMUNITY_REQUESTS.map((item) => ({
          ...item,
          isUpvoted: upvotedIds.includes(item.id) || Boolean(item.isUpvoted),
        }));
        const timer = setTimeout(() => {
          setCommunityRequests(initialWithUpvotes);
        }, 0);
        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEY_COMMUNITY_REQUESTS,
            JSON.stringify(initialWithUpvotes)
          );
        } catch {}
        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Gagal membaca request dari localStorage:", err);
    }
  }, [isAuthenticated]);

  const [toast, setToast] = React.useState<{
    title: string;
    description: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  const handleToast = (
    msg: string,
    variant: "success" | "error" | "warning" = "success",
    title = variant === "error" ? "Dibatalkan" : "Berhasil"
  ) => {
    setToast({ title, description: msg, variant });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setForceEmptyState(false);
  };

  // Submit Steam Store URL with validation, Steam API lookup, & LocalStorage persistence
  const handleStoreUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const trimmedUrl = storeUrl.trim();
    if (!trimmedUrl) {
      setInputError("*Link steam salah silahkan masukan kembali");
      return;
    }

    const appId = extractSteamAppId(trimmedUrl);
    if (!appId) {
      setInputError("*Link steam salah silahkan masukan kembali");
      return;
    }

    setIsSubmitting(true);

    try {
      let gameTitle = "";
      let gameImage = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;

      // 1. Try fetching live Steam game details from our internal proxy route
      try {
        const res = await fetch(`/api/steam/game/${appId}`);
        if (res.ok) {
          const gameData = await res.json();
          if (gameData && gameData.name) {
            gameTitle = gameData.name;
            if (gameData.hero_capsule) {
              gameImage = gameData.hero_capsule;
            }
          }
        }
      } catch (err) {
        console.warn("Gagal mengambil data dari Steam API:", err);
      }

      // 2. If Steam API didn't return a name, try slug extraction from URL
      if (!gameTitle) {
        const slugMatch = trimmedUrl.match(/\/app\/\d+\/([^/?#]+)/i);
        if (slugMatch && slugMatch[1]) {
          gameTitle = decodeURIComponent(slugMatch[1]).replace(/_/g, " ");
        }
      }

      // 3. Fallback to existing products database if known
      if (!gameTitle) {
        const allKnown = [...productsData.tawaranKhusus, ...productsData.semuaProduk];
        const existing = allKnown.find((p) => p.imageSrc?.includes(String(appId)));
        if (existing) {
          gameTitle = existing.title;
          gameImage = existing.imageSrc;
        }
      }

      // If still unable to find game name
      if (!gameTitle) {
        setInputError("*Link steam salah atau game tidak ditemukan di Steam.");
        setIsSubmitting(false);
        return;
      }

      // Check if already requested in My Requests
      const isAlreadyRequested = myRequests.some(
        (item) => item.title.toLowerCase() === gameTitle.toLowerCase()
      );
      if (isAlreadyRequested) {
        setActiveTab("my-requests");
        setStoreUrl("");
        setInputError(null);
        handleToast(
          `Kamu sudah mengajukan request untuk "${gameTitle}".`,
          "warning",
          "Sudah Diajukan"
        );
        setIsSubmitting(false);
        return;
      }

      // Create new request item
      const newRequest: RequestGameData = {
        id: `mr-${appId}-${Date.now()}`,
        title: gameTitle,
        imageSrc: gameImage,
        requestDate: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        requestCount: 1,
      };

      // 1. Save to "Request Saya" and persist to localStorage
      setMyRequests((prev) => {
        const updated = [newRequest, ...prev];
        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEY_MY_REQUESTS,
            JSON.stringify(updated)
          );
        } catch (storageErr) {
          console.error("Gagal menyimpan ke localStorage:", storageErr);
        }
        return updated;
      });

      // 2. Also add to "Request Komunitas" so other users can see and vote
      setCommunityRequests((prev) => {
        const exists = prev.some(
          (item) => item.title.toLowerCase() === gameTitle.toLowerCase()
        );
        if (!exists) {
          const newCommunityItem: RequestGameData = {
            id: `cr-${appId}-${Date.now()}`,
            title: gameTitle,
            imageSrc: gameImage,
            requestDate: new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            requestCount: 1,
            isUpvoted: true,
          };
          const updatedCommunity = [newCommunityItem, ...prev];
          try {
            localStorage.setItem(
              LOCAL_STORAGE_KEY_COMMUNITY_REQUESTS,
              JSON.stringify(updatedCommunity)
            );
            const savedUpvotes = localStorage.getItem(LOCAL_STORAGE_KEY_UPVOTED);
            const currentUpvotes: string[] = savedUpvotes
              ? JSON.parse(savedUpvotes)
              : [];
            const nextUpvotes = Array.from(
              new Set([...currentUpvotes, newCommunityItem.id])
            );
            localStorage.setItem(
              LOCAL_STORAGE_KEY_UPVOTED,
              JSON.stringify(nextUpvotes)
            );
          } catch {}
          return updatedCommunity;
        }
        return prev;
      });

      // 3. Sync to backend API database
      const validSteamUrl = trimmedUrl.startsWith("http")
        ? trimmedUrl
        : `https://store.steampowered.com/app/${appId}`;

      try {
        await createRequestMutation.mutateAsync({
          name: gameTitle,
          steam_url: validSteamUrl,
        });
      } catch (apiErr) {
        console.warn("Backend request submission error:", apiErr);
      }

      setStoreUrl("");
      setInputError(null);
      setActiveTab("my-requests");
      setForceEmptyState(false);
      handleToast(`Request "${gameTitle}" berhasil dikirim!`);
    } catch {
      setInputError("*Link steam salah silahkan masukan kembali");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Card Action based on active tab
  const handleCardAction = (id: string) => {
    if (activeTab === "my-requests") {
      const numericId = parseInt(id.replace(/\D/g, ""), 10);
      if (numericId && !isNaN(numericId)) {
        deleteRequestMutation.mutate(numericId);
      }
      // Cancel request from My Requests and localStorage
      setMyRequests((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEY_MY_REQUESTS,
            JSON.stringify(updated)
          );
        } catch (e) {
          console.error("Gagal mengupdate localStorage:", e);
        }
        return updated;
      });
      handleToast("Request game berhasil dibatalkan.", "error");
    } else if (activeTab === "community") {
      // Toggle Upvote / Unvote and update localStorage
      const targetItem = communityRequests.find((item) => item.id === id);
      const wasUpvoted = Boolean(targetItem?.isUpvoted);
      const numericId = parseInt(id.replace(/\D/g, ""), 10);

      if (numericId && !isNaN(numericId)) {
        if (wasUpvoted) {
          unvoteMutation.mutate(numericId);
        } else {
          voteMutation.mutate(numericId);
        }
      }

      setCommunityRequests((prev) => {
        let isNowUpvoted = false;
        const updated = prev.map((item) => {
          if (item.id === id) {
            const nextUpvoted = !item.isUpvoted;
            isNowUpvoted = nextUpvoted;
            return {
              ...item,
              isUpvoted: nextUpvoted,
              requestCount: nextUpvoted
                ? item.requestCount + 1
                : Math.max(0, item.requestCount - 1),
            };
          }
          return item;
        });

        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEY_COMMUNITY_REQUESTS,
            JSON.stringify(updated)
          );
          const savedUpvotes = localStorage.getItem(LOCAL_STORAGE_KEY_UPVOTED);
          const currentUpvotes: string[] = savedUpvotes
            ? JSON.parse(savedUpvotes)
            : [];
          let nextUpvotes: string[];
          if (isNowUpvoted) {
            nextUpvotes = Array.from(new Set([...currentUpvotes, id]));
          } else {
            nextUpvotes = currentUpvotes.filter((x: string) => x !== id);
          }
          localStorage.setItem(
            LOCAL_STORAGE_KEY_UPVOTED,
            JSON.stringify(nextUpvotes)
          );
        } catch (e) {
          console.error("Gagal menyimpan vote ke localStorage:", e);
        }

        return updated;
      });

      handleToast(
        wasUpvoted
          ? "Dukungan vote berhasil dibatalkan."
          : "Dukungan vote berhasil ditambahkan!"
      );
    } else if (activeTab === "added") {
      // View in store detail (navigasi ditangani langsung oleh RequestListItem)
      handleToast("Membuka halaman game di Toko Gamezygo...");
    }
  };

  // Determine current display list based on active tab with API fallback
  const currentItems = React.useMemo(() => {
    if (forceEmptyState) return [];

    if (activeTab === "my-requests") {
      if (
        requestsApiItems.length > 0 &&
        scope === "mine"
      ) {
        const apiItems: RequestGameData[] = requestsApiItems.map(
          (r, index) => {
            const fallback =
              productsData.tawaranKhusus[
                index % productsData.tawaranKhusus.length
              ];
            const steamAppId = extractSteamAppId(r.steam_url);
            return {
              id: String(r.id),
              title: r.name,
              imageSrc: steamAppId
                ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/library_600x900_2x.jpg`
                : fallback?.imageSrc ||
                  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
              requestDate: r.created_at
                ? new Date(r.created_at).toLocaleDateString("id-ID")
                : "-",
              requestCount: r.request_count || 1,
              isUpvoted: false,
            };
          }
        );
        const localOnly = isAuthenticated
          ? []
          : myRequests.filter(
              (m) =>
                !apiItems.some(
                  (a) => a.title.toLowerCase() === m.title.toLowerCase()
                )
            );
        return [...apiItems, ...localOnly];
      }
      if (isAuthenticated) {
        return [];
      }
      return myRequests;
    }

    if (activeTab === "community") {
      if (requestsApiItems.length > 0 && scope === "all") {
        const apiItems: RequestGameData[] = requestsApiItems.map((r, index) => {
          const fallback = productsData.tawaranKhusus[index % productsData.tawaranKhusus.length];
          const steamAppId = extractSteamAppId(r.steam_url);
          return {
            id: String(r.id),
            title: r.name,
            imageSrc: steamAppId
              ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/library_600x900_2x.jpg`
              : fallback?.imageSrc ||
                "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
            requestDate: r.created_at
              ? new Date(r.created_at).toLocaleDateString("id-ID")
              : "-",
            requestCount: r.request_count || 1,
            isUpvoted: false,
          };
        });
        return apiItems;
      }
      return communityRequests;
    }

    if (activeTab === "added") {
      if (requestsApiItems.length > 0 && scope === "added") {
        const apiAdded: RequestGameData[] = requestsApiItems.map((r, index) => {
          const fallback = productsData.tawaranKhusus[index % productsData.tawaranKhusus.length];
          const steamAppId = extractSteamAppId(r.steam_url);
          const rawReq = r as unknown as {
            product_slug?: string;
            slug?: string;
            product?: { slug?: string };
          };
          const normalizedName = (r.name || "").trim().toLowerCase();
          const matchedCatalogProduct = catalogProducts.find((p) => {
            const pName = (p.name || "").trim().toLowerCase();
            if (normalizedName && pName === normalizedName) return true;
            const pSteamUrl = (p as { steam_url?: string }).steam_url;
            if (steamAppId && pSteamUrl && pSteamUrl.includes(`/app/${steamAppId}`)) {
              return true;
            }
            return false;
          });
          const resolvedSlug =
            rawReq.product?.slug ||
            rawReq.product_slug ||
            rawReq.slug ||
            matchedCatalogProduct?.slug ||
            (r.name || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

          return {
            id: String(r.id),
            title: r.name,
            imageSrc: steamAppId
              ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/library_600x900_2x.jpg`
              : fallback?.imageSrc ||
                "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
            requestDate: r.created_at
              ? new Date(r.created_at).toLocaleDateString("id-ID")
              : "-",
            addedDate: r.updated_at
              ? new Date(r.updated_at).toLocaleDateString("id-ID")
              : "-",
            requestCount: r.request_count || 1,
            storeHref: resolvedSlug ? `/store/${resolvedSlug}` : "/store",
          };
        });
        return apiAdded;
      }
      return addedRequests;
    }

    return [];
  }, [
    activeTab,
    forceEmptyState,
    requestsApiItems,
    scope,
    myRequests,
    communityRequests,
    addedRequests,
    isAuthenticated,
    catalogProducts,
  ]);

  const currentVariant: RequestCardVariant = React.useMemo(() => {
    if (activeTab === "my-requests") return "my-request";
    if (activeTab === "community") return "community";
    return "added";
  }, [activeTab]);

  return (
    <>
      <Head>
        <title>Request Game - Gamezygo</title>
        <meta
          name="description"
          content="Mau game yang belum ada? Kirim link store-nya. Game dengan vote terbanyak akan segera kita tambahkan ke katalog Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant="private"
        activeSidebarId="request"
      >
        <div className="flex flex-col gap-8 sm:gap-16 w-full select-none">
          {/* SECTION HEADER (Mirip Bundle Header dengan red accent bar) */}
          <section className="flex flex-col gap-2 py-3 border-l-gradient-primary pl-6 sm:pl-8">
            <h1 className="text-h2 font-semibold leading-[120%] text-gradient-heading w-fit">
              Request Game
            </h1>
            <p className="text-body-xs text-gray-400  leading-relaxed">
              Mau game yang belum ada? Kirim link Store-nya. Game yang paling banyak di-request <br /> bakal kita prioritaskan untuk ditambahkan.
            </p>
          </section>

          {/* STORE LINK INPUT CARD */}
          <section className="w-full rounded-lg bg-deep-blue-950/70 border border-gray-700 p-5 sm:p-6 flex flex-col gap-3">
            <label
              htmlFor="steam-store-url"
              className="text-body-xs text-gray-400 font-medium"
            >
              Buka game yang kamu mau di Steam Store, copy URL-nya, lalu paste di sini.
            </label>

            <form
              onSubmit={handleStoreUrlSubmit}
              className="flex flex-col gap-2 w-full"
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "relative flex-1 flex items-center bg-deep-blue-900/80 rounded-lg px-4 py-2.5 h-11 transition-colors border",
                    inputError
                      ? "border-rose-500/60 focus-within:border-rose-500"
                      : "border-transparent focus-within:border-deep-blue-100/40"
                  )}
                >
                  <input
                    id="steam-store-url"
                    type="text"
                    value={storeUrl}
                    onChange={(e) => {
                      setStoreUrl(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Link store"
                    className="w-full bg-transparent text-label-sm text-gray-50 placeholder:text-gray-500 outline-none"
                  />
                  {storeUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setStoreUrl("");
                        if (inputError) setInputError(null);
                      }}
                      className="text-gray-400 hover:text-gray-50 shrink-0 cursor-pointer p-1"
                      aria-label="Hapus teks URL"
                    >
                      <CrossIcon />
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  className="h-11 px-6 rounded-lg font-semibold cursor-pointer shrink-0"
                >
                  Kirim
                </Button>
              </div>

              {inputError && (
                <p className="text-body-xs text-rose-500 font-normal leading-tight">
                  {inputError}
                </p>
              )}
            </form>
          </section>
           

          {/* TABS BAR (Grid 3-kolom dengan garis abu jika tidak aktif & merah jika aktif) */}
          <div className="flex items-center justify-end w-full select-none pt-2  border-b border-b-gradient-secondary pb-6">
            <div className="grid grid-cols-3 w-full sm:w-auto min-w-full sm:min-w-112.5">
              {TAB_OPTIONS.map((tab) => {
                const isActive = activeTab === tab.id && !forceEmptyState;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative pb-3 pt-2 sm:text-center text-label-xs sm:text-label-sm font-medium transition-all duration-150 cursor-pointer sm:px-5 ${
                      isActive
                        ? "text-gray-50 font-semibold"
                        : "text-gray-400 hover:text-gray-50"
                    }`}
                  >
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {/* Bottom indicator: merah saat aktif, abu-abu saat tidak aktif */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors duration-150 ${
                        isActive ? "bg-rose-500 z-10" : "bg-gray-700"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENT: 2-COLUMN GRID OR EMPTY STATE */}
          {isRequestsLoading && requestsApiItems.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ListRowSkeleton key={idx} />
              ))}
            </div>
          ) : currentItems.length > 0 ? (
            <div className="flex flex-col gap-10">
              {/* 2-Column Grid matching Screenshot 1, 2, 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.map((game) => (
                  <RequestListItem
                    key={game.id}
                    id={game.id}
                    title={game.title}
                    imageSrc={game.imageSrc}
                    requestDate={game.requestDate}
                    requestCount={game.requestCount}
                    variant={currentVariant}
                    isUpvoted={game.isUpvoted}
                    onActionClick={handleCardAction}
                  />
                ))}
              </div>
              {isFetchingNextRequestsPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <ListRowSkeleton key={idx} />
                  ))}
                </div>
              )}
              <div ref={requestsSentinelRef} className="h-4 w-full" aria-hidden="true" />
            </div>
          ) : (
            /* EMPTY STATE (Screenshot 4) */
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-lg bg-deep-blue-900 border border-gray-700 flex items-center justify-center text-gray-300 shadow-xl">
                <BookEmptyIcon />
              </div>

              {/* Empty Title & Description */}
              <div className="flex flex-col gap-4 my-8">
                <h2 className="text-h4 font-semibold leading-1.2 text-gray-50 ">
                  {activeTab === "my-requests"
                    ? "Belum Ada Request Game"
                    : activeTab === "added"
                    ? "Belum Ada Game Ditambahkan"
                    : "Belum Ada Request Komunitas"}
                </h2>
                <p className="text-body-xs text-gray-400 leading-relaxed">
                  {activeTab === "my-requests"
                    ? "Anda belum pernah mengajukan request game. Masukkan link game Steam di atas untuk mengajukan game favoritmu!"
                    : activeTab === "added"
                    ? "Belum ada game dari request komunitas yang telah ditambahkan ke katalog toko."
                    : "Belum ada request game dari komunitas saat ini. Jadilah yang pertama mengajukan!"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<ArrowLeftIcon />}
                  onClick={() => {
                    setForceEmptyState(false);
                    const el = document.getElementById("steam-store-url");
                    el?.focus();
                  }}
                  className=" px-5 py-3 cursor-pointer "
                >
                  Ajukan Game
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push("/store")}
                  className=" px-5 py-3 cursor-pointer "
                >
                  Lihat Toko
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* TOAST FEEDBACK */}
        {toast && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant={toast.variant}
              title={toast.title}
              description={toast.description}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
