import * as React from "react";
import Head from "next/head";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  ProductCard,
  FilterModal,
  EmptyState,
  Accordion,
  PricingCard,
  GameListItem,
  Toast,
} from "@/components/ui";

// Crown Icon
const CrownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 shrink-0"
    {...props}
  >
    <path
      d="M3 18.75C3 18.3358 3.33579 18 3.75 18H20.25C20.6642 18 21 18.3358 21 18.75C21 19.1642 20.6642 19.5 20.25 19.5H3.75C3.33579 19.5 3 19.1642 3 18.75ZM4.331 6.582C4.161 6.072 3.513 5.922 3.14 6.295C2.767 6.668 2.917 7.316 3.427 7.486L5.342 8.125L7.265 15H16.735L18.658 8.125L20.573 7.486C21.083 7.316 21.233 6.668 20.86 6.295C20.487 5.922 19.839 6.072 19.669 6.582L17.5 13.089L13.784 7.515C13.565 7.186 13.081 7.159 12.825 7.46L12 8.43L11.175 7.46C10.919 7.159 10.435 7.186 10.216 7.515L6.5 13.089L4.331 6.582Z"
      fill="currentColor"
    />
  </svg>
);

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

// Filter Funnel Icon
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

// Phone Icon
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M15.5995 14.522C13.2045 17.042 7.09554 10.988 9.49954 8.45799C10.9675 6.91299 9.30954 5.14799 8.39154 3.84899C6.66854 1.41399 2.88754 4.77599 3.00154 6.91499C3.36454 13.661 10.6615 21.655 17.7275 20.957C19.9375 20.739 22.4775 16.747 19.9425 15.288C18.6745 14.558 16.9335 13.118 15.5995 14.521"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chevron Left Icon
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chevron Right Icon
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FAQ_ITEMS = [
  {
    id: "faq-1",
    title: "Bagaimana cara kerja Gamezygo?",
    content:
      "Gamezygo menyediakan akses ke perpustakaan game terbaik melalui akun Steam Sharing terverifikasi dan bergaransi resmi seumur hidup. Setelah berlangganan paket, Anda langsung dapat mengunduh dan memainkan semua game di katalog paket tanpa antrean.",
  },
  {
    id: "faq-2",
    title: "Ini langganan atau beli putus?",
    content:
      "Untuk Paket Hemat adalah sistem langganan bulanan di mana Anda bebas memainkan seluruh judul game selama masa aktif paket. Kami juga menyediakan opsi pembelian game satuan jika Anda ingin memiliki game secara permanen.",
  },
  {
    id: "faq-3",
    title: "Apa itu kode Steam Guard dan kenapa dibutuhkan?",
    content:
      "Steam Guard adalah sistem keamanan akun dari Steam. Saat Anda login ke akun game, sistem bot otomatis Gamezygo akan langsung memberikan kode keamanan secara instan dalam hitungan detik tanpa harus chat admin.",
  },
  {
    id: "faq-4",
    title: "Bisa main game online multiplayer?",
    content:
      "Paket langganan Steam Sharing difokuskan untuk pengalaman mode single-player, career, dan story campaign dengan performa stabil. Game tertentu mendukung remote play atau co-op lokal.",
  },
  {
    id: "faq-5",
    title: "Gimana kalau akses saya bermasalah?",
    content:
      "Tim customer service Gamezygo siaga 24/7. Anda cukup mengklik tombol 'Hubungi Admin' dan kami akan segera membantu memperbarui akses akun atau mereset sesi permainan Anda.",
  },
];

const MINI_CATALOG_GAMES = [
  {
    id: "mc-1",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-2",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-3",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-4",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-5",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-6",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-7",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-8",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
  {
    id: "mc-9",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
  },
];

const BUNDLE_GAMES = [
  {
    id: "b-1",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-2",
    title: "007 - First Light",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-3",
    title: "EA SPORTS CF™ 27 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "EA",
  },
  {
    id: "b-4",
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-5",
    title: "EA SPORTS FC™ 26 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "EA",
  },
  {
    id: "b-6",
    title: "Dead by Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Horror"],
    launcher: "Steam",
  },
  {
    id: "b-7",
    title: "Phantom Blade",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "RPG"],
    launcher: "Steam",
  },
  {
    id: "b-8",
    title: "Grand Thief Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-9",
    title: "Read Dead Redemption II",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-10",
    title: "Vanakan",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4197610/caad28198a0aa74f908b0efead31904113c32e3f/hero_capsule_2x.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    launcher: "Steam",
  },
  {
    id: "b-11",
    title: "Pharmacy Simulator: Big Pharma",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/344850/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Casual"],
    launcher: "Steam",
  },
  {
    id: "b-12",
    title: "Learning on Demand Racing",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "Steam",
  },
  {
    id: "b-13",
    title: "Hell Let Loose: Vietnam",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/686810/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Multiplayer"],
    launcher: "Steam",
  },
  {
    id: "b-14",
    title: "The Lord of the Rings: War in the North™ - Legacy Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/203350/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "RPG"],
    launcher: "Steam",
  },
  {
    id: "b-15",
    title: "EA SPORTS™ Madden NFL 27",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "EA",
  },
  {
    id: "b-16",
    title: "Earthworm Jim",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Casual"],
    launcher: "Steam",
  },
];

export default function BundlePage() {
  // Mode switcher: "subscribed" (Image 3 & 4) vs "unsubscribed" (Image 2)
  const [viewMode, setViewMode] = React.useState<"subscribed" | "unsubscribed">("subscribed");

  // Subscription Modal State (Image 1)
  const [isSubsModalOpen, setIsSubsModalOpen] = React.useState<boolean>(false);
  const [activeSubPlan, setActiveSubPlan] = React.useState<string>("Paket 2");

  // Tablet & Mobile Swiper State for Paket Hemat
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const swiperRef = React.useRef<HTMLDivElement | null>(null);
  const isDragging = React.useRef<boolean>(false);
  const startX = React.useRef<number>(0);
  const scrollLeftStart = React.useRef<number>(0);

  const scrollToSlide = (index: number) => {
    if (!swiperRef.current) return;
    const clampedIndex = Math.max(0, Math.min(2, index));
    const container = swiperRef.current;
    const children = container.children;
    if (children[clampedIndex]) {
      const targetElement = children[clampedIndex] as HTMLElement;
      const containerLeft = container.getBoundingClientRect().left;
      const elementLeft = targetElement.getBoundingClientRect().left;
      const offset =
        elementLeft -
        containerLeft -
        (container.clientWidth - targetElement.clientWidth) / 2;
      container.scrollBy({ left: offset, behavior: "smooth" });
      setActiveSlide(clampedIndex);
    }
  };

  const handleSwiperScroll = () => {
    if (!swiperRef.current) return;
    const container = swiperRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children) as HTMLElement[];

    let closestIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(childCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setActiveSlide(closestIdx);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!swiperRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - swiperRef.current.offsetLeft;
    scrollLeftStart.current = swiperRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !swiperRef.current) return;
    e.preventDefault();
    const x = e.pageX - swiperRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    swiperRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  // Search & Filter State in Subscribed View
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);

  const [modalCategories, setModalCategories] = React.useState<string[]>([]);
  const [modalGenres, setModalGenres] = React.useState<string[]>([]);
  const [modalLaunchers, setModalLaunchers] = React.useState<string[]>([]);
  const [modalPriceRange, setModalPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [modalSort, setModalSort] = React.useState<string>("Terbaru");

  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  const [appliedGenres, setAppliedGenres] = React.useState<string[]>([]);
  const [appliedLaunchers, setAppliedLaunchers] = React.useState<string[]>([]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const currentUser = {
    name: "Dyven Siauw",
    email: "dyven@gamezygo.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
  };

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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
  };

  const isSearchActive = searchQuery.trim().length > 0;
  const isFilterActive =
    appliedGenres.length > 0 ||
    appliedCategories.length > 0 ||
    appliedLaunchers.length > 0;

  const filteredGames = React.useMemo(() => {
    let list = [...BUNDLE_GAMES];

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

    if (appliedGenres.length > 0) {
      list = list.filter((game) =>
        appliedGenres.some((genre) => game.genres.includes(genre))
      );
    }

    if (appliedLaunchers.length > 0) {
      list = list.filter((game) =>
        appliedLaunchers.includes(game.launcher || "Steam")
      );
    }

    if (appliedSort === "Nama (A - Z)") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [isSearchActive, searchQuery, appliedGenres, appliedLaunchers, appliedSort]);

  return (
    <>
      <Head>
        <title>Paket Hemat & Langganan Game - Gamezygo</title>
        <meta
          name="description"
          content="Akses tak terbatas ke ratusan game terbaik dengan Paket Hemat Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant="private"
        activeSidebarId="paket"
        user={currentUser}
        onCartClick={() => handleToast("Membuka keranjang belanja")}
      >
        <div className="flex flex-col w-full">
          {/* TOP VIEW-MODE SWITCHER */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-deep-blue-900/60 border border-white/5 backdrop-blur-sm">
            <span className="text-body-xs text-gray-400 font-medium pl-2 hidden sm:inline">
              Mode Pratinjau Halaman Paket:
            </span>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Button
                type="button"
                variant={viewMode === "subscribed" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setViewMode("subscribed")}
                className="flex-1 sm:flex-initial text-label-xs cursor-pointer"
              >
                Sudah Berlangganan (Screenshot 3)
              </Button>
              <Button
                type="button"
                variant={viewMode === "unsubscribed" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setViewMode("unsubscribed")}
                className="flex-1 sm:flex-initial text-label-xs cursor-pointer"
              >
                Pilihan Paket (Screenshot 2)
              </Button>
            </div>
          </div>

          {viewMode === "unsubscribed" ? (
            /* MODE A: BELUM BERLANGGANAN / PLAN SELECTION (Screenshot 2) */
            <div className="flex flex-col gap-32  ">
              {/* SECTION 1: PAKET HEMAT */}
              <section className="flex flex-col gap-12">
                <div className="flex flex-col gap-2 border-l-gradient-primary pl-8">
                  <h2 className="text-h2 font-semibold leading-[120%] text-gradient-heading  w-fit">
                    Paket Hemat
                  </h2>
                  <p className="text-body-xs text-gray-400">
                    Buka akses tanpa batas ke perpustakaan game terbaik di Gamezygo Premium. <br /> Hemat jutaan rupiah, main jadi lebih puas.
                  </p>
                </div>

                {/* 3 PRICING CARDS ROW (SWIPER ON TABLET & MOBILE, 3-COL GRID ON XL) */}
                <div className="flex flex-col gap-4">
                  <div
                    ref={swiperRef}
                    onScroll={handleSwiperScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex xl:grid xl:grid-cols-3 gap-6 pt-2 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-1 cursor-grab active:cursor-grabbing xl:cursor-default"
                    role="region"
                    aria-label="Pilihan Paket Hemat Swiper"
                  >
                    <div className="w-[85vw] max-w-85 sm:w-85 md:w-87.5 shrink-0 snap-center xl:w-auto xl:max-w-none flex flex-col">
                      <PricingCard
                        type="secondary"
                        title="Paket 1"
                        price="IDR 150,000"
                        period="/ Month"
                        features={[
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                        ]}
                        actionText="Subscribe"
                        onActionClick={() => {
                          setActiveSubPlan("Paket 1");
                          setIsSubsModalOpen(true);
                        }}
                        className="h-full"
                      />
                    </div>

                    <div className="w-[85vw] max-w-85 sm:w-85 md:w-87.5 shrink-0 snap-center xl:w-auto xl:max-w-none flex flex-col">
                      <PricingCard
                        type="primary"
                        title="Paket 2"
                        price="IDR 150,000"
                        period="/ Month"
                        features={[
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                        ]}
                        actionText="Subscribe"
                        onActionClick={() => {
                          setActiveSubPlan("Paket 2");
                          setIsSubsModalOpen(true);
                        }}
                        className="h-full"
                      />
                    </div>

                    <div className="w-[85vw] max-w-85 sm:w-85 md:w-87.5 shrink-0 snap-center xl:w-auto xl:max-w-none flex flex-col">
                      <PricingCard
                        type="secondary"
                        title="Paket 3"
                        price="IDR 150,000"
                        period="/ Month"
                        features={[
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                          "Mainkan Game Lebih Banyak",
                        ]}
                        actionText="Subscribe"
                        onActionClick={() => {
                          setActiveSubPlan("Paket 3");
                          setIsSubsModalOpen(true);
                        }}
                        className="h-full"
                      />
                    </div>
                  </div>

                  {/* SWIPER CONTROLS & INDICATOR (TABLET & MOBILE ONLY: < xl) */}
                  <div className="flex xl:hidden items-center justify-between pt-1 px-2">
                    <span className="text-body-xs text-gray-400 font-medium">
                      Geser untuk pilihan paket ({activeSlide + 1}/3)
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => scrollToSlide(activeSlide - 1)}
                        disabled={activeSlide === 0}
                        aria-label="Paket sebelumnya"
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-deep-blue-900 border border-gradient-secondary text-gray-50 hover:bg-deep-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>

                      {/* Dots */}
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => scrollToSlide(idx)}
                            aria-label={`Lihat Paket ${idx + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              activeSlide === idx
                                ? "w-6 bg-rose-500"
                                : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => scrollToSlide(activeSlide + 1)}
                        disabled={activeSlide === 2}
                        aria-label="Paket berikutnya"
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-deep-blue-900 border border-gradient-secondary text-gray-50 hover:bg-deep-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </section>

              {/* SECTION 2: PERPUSTAKAAN KATALOG MINI */}
              <section className="flex flex-col gap-8xl pt-4">
                <div className="flex flex-col gap-2 border-l-gradient-primary pl-8 pb-3">
                  <h2 className="text-h2 font-semibold leading-[120%] text-gradient-heading w-fit">
                    Perpustakaan
                  </h2>
                  <p className="text-body-xs text-gray-400">
                    Akses 100+ game di katalog, dan request game baru langsung dari kita.
                  </p>
                </div>

                {/* 3x3 GRID OF GAME LIST ITEMS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {MINI_CATALOG_GAMES.map((game, idx) => (
                    <GameListItem
                      key={idx}
                      title={game.title}
                      imageSrc={game.imageSrc}
                      discount={game.tier}
                      originalPrice={game.originalPrice}
                      price={game.price}
                    />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* MODE B: SUDAH BERLANGGANAN / ACTIVE BUNDLE (Screenshot 3 & 4) */
            <div  className="flex flex-col gap-20">
              {/* TOP: ACTIVE SUBSCRIPTION STATUS CARD */}
              <PricingCard
                type="paid"
                title="Paket 2"
                price="IDR 200,000"
                period="/ Month"
                expiryInfo="Berakhir dalam 30 hari"
                dateRangeInfo="22/07/2026 - 22/08/2026"
                actionText="Perbarui Sekarang"
                onActionClick={() => setIsSubsModalOpen(true)}
                secondaryActionText="Hubungi Admin"
                onSecondaryActionClick={() =>
                  handleToast("Membuka chat admin Telegram...")
                }
                
              />
             <div className=" grid gap-10">
  
              {/* SECTION HEADER DENGAN SEARCH & FLOATING FILTER DROPDOWN */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none border-b-2 border-b-gradient-secondary pb-6">
                <div className="min-w-0 flex items-center">
                  {isSearchActive ? (
                    <h3 className="text-h3 font-semibold text-gray-50 tracking-normal truncate">
                      Cari &quot;{searchQuery}&quot;
                    </h3>
                  ) : isFilterActive ? (
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
                          onClick={() =>
                            setAppliedGenres((prev) =>
                              prev.filter((g) => g !== genre)
                            )
                          }
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
                          onClick={() =>
                            setAppliedLaunchers((prev) =>
                              prev.filter((l) => l !== launcher)
                            )
                          }
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

                {/* SEARCH INPUT + FLOATING FILTER DROPDOWN */}
                <div className="relative flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="relative flex items-center bg-deep-blue-950 border border-gradient-secondary rounded-lg px-3.5 py-2.5 h-10 w-60 sm:w-64 md:w-80 gap-2.5 focus-within:border-deep-blue-100/40 transition-colors">
                    <SearchIcon className="w-4 h-4 text-deep-blue-100 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari di toko"
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
                      setIsFilterModalOpen(false);
                    }}
                  />
                </div>
              </div>

              {/* GRID GAME ATAU EMPTY STATE (Screenshot 4: Paid-Searched / Paid-Empty) */}
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {filteredGames.map((game) => (
                    <ProductCard
                      key={game.id}
                      orientation="vertical"
                      title={game.title}
                      imageSrc={game.imageSrc}
                      genres={game.genres}
                      platform={game.launcher}
                      showPrice={false}
                      showActionButton={false}
                      className="hover:-translate-y-0.5 transition-transform duration-200 pb-8xl"
                      
                    />
                  ))}
                </div>
              ) : (
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
            </div>
          )}

          {/* ========================================================
              SECTION: FREQUENTLY ASKED QUESTION (Ada di kedua mode!)
             ======================================================== */}
          <section className="grid lg:flex-row gap-10 lg:gap-16 pt-12 pb-8 border-t border-white/5">
            <div className="flex flex-col gap-4 lg:w-1/3 shrink-0 border-l-gradient-primary h-fit pl-8 pb-6 w-fit border-roun">
            
              <span className="text-body-sm  text-gray-400">
                FREQUENTLY ASKED QUESTION
              </span>
              <h2 className="text-h2 font-semibold leading-[120%] text-gradient-heading w-fit ">
                Pertanyaan yang <br /> Sering Ditanyakan!
              </h2>
              <div className="flex gap-3 w-full justify-between mt-8 ">
                <span className="text-body-xs text-gray-400">
                  Masih memiliki <br />pertanyaan?
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  rightIcon={<PhoneIcon className="w-4 h-4" />}
                  onClick={() => handleToast("Menghubungi admin via Telegram...")}
                  className="cursor-pointer px-6"
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <Accordion items={FAQ_ITEMS} defaultOpenId="faq-1" />
            </div>
          </section>
        </div>

        {/* ========================================================
            SUBSCRIPTION MODAL DIALOG (Screenshot 1 & 2: Modal)
           ======================================================== */}
        {isSubsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div
              className="fixed inset-0"
              onClick={() => setIsSubsModalOpen(false)}
            />
            <div className="relative z-10 w-fit  mx-auto bg-deep-blue-950 border border-gradient-secondary rounded-lg p-6 sm:p-8 flex flex-col gap-6  max-h-[90vh] overflow-y-auto">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-b-gradient-secondary pb-4">
                <h3 className="text-h4 font-bold text-gray-50">Subscription</h3>
                <button
                  type="button"
                  onClick={() => setIsSubsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-50 cursor-pointer p-1 rounded-lg"
                  aria-label="Tutup modal"
                >
                  <CrossIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Status Subscription Aktif */}
              <div className="flex flex-col gap-2">
                <span className="text-body-xs font-semibold uppercase tracking-wider text-gray-400">
                  SUBSCRIPTION
                </span>
                <div className="flex items-center justify-between p-4 rounded-lg bg-deep-blue-900 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <CrownIcon className="text-amber-400 w-5 h-5" />
                    <span className="font-semibold text-gray-50 text-body-md">
                      {activeSubPlan}
                    </span>
                  </div>
                  <span className="text-body-sm font-semibold text-rose-400">
                    30 hari
                  </span>
                </div>
              </div>

              {/* Pilihan Paket Modal (Horizontal PricingCards) */}
              <div className="flex flex-col gap-4">
                <PricingCard
                  direction="horizontal"
                  type={activeSubPlan === "Paket 1" ? "primary" : "secondary"}
                  title="Paket 1"
                  price="IDR 50,000"
                  period="/ Month"
                  features={[
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                  ]}
                  actionText="Subscribe"
                  onActionClick={() => {
                    setActiveSubPlan("Paket 1");
                    handleToast("Paket 1 dipilih");
                    setIsSubsModalOpen(false);
                    setViewMode("subscribed");
                  }}
                  className="w-full"
                />

                <PricingCard
                  direction="horizontal"
                  type={activeSubPlan === "Paket 2" ? "primary" : "secondary"}
                  title="Paket 2"
                  price="IDR 150,000"
                  period="/ Month"
                  features={[
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                  ]}
                  actionText="Subscribe"
                  onActionClick={() => {
                    setActiveSubPlan("Paket 2");
                    handleToast("Paket 2 berhasil diperbarui!");
                    setIsSubsModalOpen(false);
                    setViewMode("subscribed");
                  }}
                  className="w-full"
                />

                <PricingCard
                  direction="horizontal"
                  type={activeSubPlan === "Paket 3" ? "primary" : "secondary"}
                  title="Paket 3"
                  price="IDR 200,000"
                  period="/ Month"
                  features={[
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                    "Mainkan Game Lebih Banyak",
                  ]}
                  actionText="Subscribe"
                  onActionClick={() => {
                    setActiveSubPlan("Paket 3");
                    handleToast("Paket 3 dipilih");
                    setIsSubsModalOpen(false);
                    setViewMode("subscribed");
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}


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
