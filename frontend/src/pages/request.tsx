import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  Button,
  Pagination,
  Toast,
  Tabs,
  RequestListItem,
  type RequestCardVariant,
} from "@/components/ui";
import {
  useGameRequests,
  useCreateGameRequest,
  useVoteGameRequest,
  useUnvoteGameRequest,
} from "@/hooks/use-requests";
import productsData from "@/json/products.json";

// Helper to extract Steam App ID from various Steam URL patterns
function extractSteamAppId(url: string): number | null {
  const trimmed = url.trim();
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  const match = trimmed.match(/store\.steampowered\.com\/app\/(\d+)/i);
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

// Initial Data for Tab 1: Request Saya (Data beragam dari products.json)
const INITIAL_MY_REQUESTS: RequestGameData[] = [
  {
    id: "beholder-conductor",
    title: "Beholder: Conductor",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    requestDate: "20/07/2026",
    requestCount: 18,
  },
  {
    id: "targeted-10-days",
    title: "Targeted - 10 Days",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/107410/library_600x900_2x.jpg",
    requestDate: "21/07/2026",
    requestCount: 24,
  },
  {
    id: "tukoni-forest-keepers",
    title: "Tukoni: Forest Keepers",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1387610/library_600x900_2x.jpg",
    requestDate: "22/07/2026",
    requestCount: 15,
  },
  {
    id: "first-light",
    title: "SCP - First Light",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    requestDate: "23/07/2026",
    requestCount: 31,
  },
  {
    id: "subnautica-2",
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    requestDate: "24/07/2026",
    requestCount: 42,
  },
  {
    id: "college-football-27",
    title: "EA SPORTS College Football 27",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    requestDate: "25/07/2026",
    requestCount: 50,
  },
];

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

  // Active Tab State
  const [activeTab, setActiveTab] = React.useState<TabId>("my-requests");

  // Force Empty State Preview Toggle (for testing Screenshot 4)
  const [forceEmptyState, setForceEmptyState] = React.useState<boolean>(false);

  // Store Link Input State & Validation
  const [storeUrl, setStoreUrl] = React.useState<string>("");
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // TanStack Query: Game Requests API
  const scope = activeTab === "my-requests" ? "mine" : "all";
  const { data: requestsApiRes } = useGameRequests({ scope, page: currentPage });
  const createRequestMutation = useCreateGameRequest();
  const voteMutation = useVoteGameRequest();
  const unvoteMutation = useUnvoteGameRequest();

  // Toast Feedback State
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Request Datasets
  const [myRequests, setMyRequests] =
    React.useState<RequestGameData[]>(INITIAL_MY_REQUESTS);
  const [communityRequests, setCommunityRequests] =
    React.useState<RequestGameData[]>(INITIAL_COMMUNITY_REQUESTS);
  const [addedRequests] =
    React.useState<RequestGameData[]>(INITIAL_ADDED_REQUESTS);

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Submit Steam Store URL with validation & Steam API lookup
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
      const res = await fetch(`/api/steam/game/${appId}`);
      if (!res.ok) {
        // Item tidak ditemukan di Steam (404) atau error Steam API
        setInputError("*Link steam salah silahkan masukan kembali");
        setIsSubmitting(false);
        return;
      }

      const gameData = await res.json();
      if (!gameData || !gameData.name) {
        setInputError("*Link steam salah silahkan masukan kembali");
        setIsSubmitting(false);
        return;
      }

      // Add new request to "Request saya"
      const newRequest: RequestGameData = {
        id: `mr-${Date.now()}`,
        title: gameData.name,
        imageSrc:
          gameData.hero_capsule ||
          `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`,
        requestDate: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        requestCount: 1,
      };

      try {
        await createRequestMutation.mutateAsync({
          name: gameData.name,
          steam_url: trimmedUrl,
        });
      } catch {
        // Continue with local update
      }

      setMyRequests((prev) => [newRequest, ...prev]);
      setStoreUrl("");
      setInputError(null);
      setActiveTab("my-requests");
      setForceEmptyState(false);
      handleToast(`Request "${gameData.name}" berhasil dikirim!`);
    } catch {
      setInputError("*Link steam salah silahkan masukan kembali");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Card Action based on active tab
  const handleCardAction = (id: string) => {
    if (activeTab === "my-requests") {
      // Cancel request
      setMyRequests((prev) => prev.filter((item) => item.id !== id));
      handleToast("Request game berhasil dibatalkan.");
    } else if (activeTab === "community") {
      // Toggle Upvote / Unvote
      const targetItem = communityRequests.find((item) => item.id === id);
      const isCurrentlyUpvoted = Boolean(targetItem?.isUpvoted);
      const numericId = parseInt(id.replace(/\D/g, ""), 10);

      if (numericId && !isNaN(numericId)) {
        if (isCurrentlyUpvoted) {
          unvoteMutation.mutate(numericId);
        } else {
          voteMutation.mutate(numericId);
        }
      }

      setCommunityRequests((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const nextUpvoted = !item.isUpvoted;
            return {
              ...item,
              isUpvoted: nextUpvoted,
              requestCount: nextUpvoted
                ? item.requestCount + 1
                : Math.max(0, item.requestCount - 1),
            };
          }
          return item;
        })
      );
      handleToast(
        isCurrentlyUpvoted
          ? "Dukungan vote berhasil dibatalkan."
          : "Dukungan vote berhasil ditambahkan!"
      );
    } else if (activeTab === "added") {
      // View in store detail (navigasi ditangani langsung oleh RequestListItem)
      handleToast("Membuka halaman game di Toko Gamezygo...");
    }
  };

  // Determine current display list based on active tab
  const currentItems = React.useMemo(() => {
    if (forceEmptyState) return [];
    if (requestsApiRes?.data && requestsApiRes.data.length > 0) {
      return requestsApiRes.data.map((r, index) => {
        const fallback = productsData.tawaranKhusus[index % productsData.tawaranKhusus.length];
        const steamAppId = extractSteamAppId(r.steam_url);
        return {
          id: String(r.id),
          title: r.name,
          imageSrc: steamAppId
            ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/library_600x900_2x.jpg`
            : fallback?.imageSrc || "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
          requestDate: new Date(r.created_at || Date.now()).toLocaleDateString("id-ID"),
          requestCount: r.request_count || 1,
          isUpvoted: false,
        };
      });
    }
    if (activeTab === "my-requests") return myRequests;
    if (activeTab === "community") return communityRequests;
    if (activeTab === "added") return addedRequests;
    return [];
  }, [activeTab, forceEmptyState, requestsApiRes, myRequests, communityRequests, addedRequests]);

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
          {/* TOP PREVIEW TOGGLE BAR (Memudahkan pengujian Screenshot 1 - 4) */}
     
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
                    onClick={() => {
                      setActiveTab(tab.id);
                      setForceEmptyState(false);
                    }}
                    className={`relative pb-3 pt-2 sm:text-center text-label-xs sm:text-label-sm font-medium transition-all duration-150 cursor-pointer  sm:px-5 ${
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
          {currentItems.length > 0 ? (
            <div className="flex flex-col gap-16">
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

              {/* PAGINATION */}
              <div className="flex justify-center pt-4 pb-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={25}
                  onPageChange={setCurrentPage}
                />
              </div>
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
                Request Game Impianmu
              </h2>
              <p className="text-body-xs text-gray-400   leading-relaxed">
                Game favoritmu belum ada di katalog? Kirim link <br /> store-nya sekarang. Game dengan vote terbanyak <br />bakal kita hadirkan lebih cepat!
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
                    setMyRequests(INITIAL_MY_REQUESTS);
                  }}
                  className=" px-5 py-3 cursor-pointer "
                >
                  Kembali
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
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
            <Toast variant="success" title="Notifikasi" description={toastMessage} />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
