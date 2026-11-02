import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Header,
  Button,
  ProductCard,
  FilterModal,
  EmptyState,
  Accordion,
  PricingCard,
  GameListItem,
  Toast,
} from "@/components/ui";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import {
  useSubscriptionPlans,
  useUserSubscription,
  useSubscriptionProducts,
} from "@/hooks/use-subscriptions";
import { formatRupiah } from "@/utils/formatters";
import { useFaqs } from "@/hooks/use-common";
import { useCreateOrder } from "@/hooks/use-orders";

// Crown Icon (Existing standard system icon)
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
      d="M12.0002 17C12.5306 17 13.0393 16.7893 13.4144 16.4142C13.7895 16.0391 14.0002 15.5304 14.0002 15C14.0002 14.4695 13.7895 13.9608 13.4144 13.5858C13.0393 13.2107 12.5306 13 12.0002 13C11.4698 13 10.9611 13.2107 10.586 13.5858C10.2109 13.9608 10.0002 14.4695 10.0002 15C10.0002 15.5304 10.2109 16.0391 10.586 16.4142C10.9611 16.7893 11.4698 17 12.0002 17ZM14.0002 4.99997C14.0002 5.52997 13.7942 6.01197 13.4572 6.36997L16.0812 9.64997C16.1169 9.69473 16.1668 9.7259 16.2227 9.73828C16.2785 9.75066 16.337 9.74349 16.3882 9.71797L19.0382 8.39197C18.9809 8.10185 18.9886 7.80264 19.0606 7.51583C19.1327 7.22902 19.2673 6.9617 19.4548 6.73305C19.6424 6.50441 19.8782 6.3201 20.1454 6.19336C20.4126 6.06661 20.7045 6.00057 21.0002 5.99997C21.4919 6.00007 21.9663 6.18128 22.3328 6.509C22.6994 6.83671 22.9324 7.28796 22.9873 7.77657C23.0422 8.26517 22.9152 8.75688 22.6306 9.15779C22.3459 9.5587 21.9236 9.84072 21.4442 9.94997L19.6402 19.573C19.5649 19.9741 19.3517 20.3362 19.0377 20.5968C18.7236 20.8574 18.3283 21 17.9202 21H6.0802C5.6721 21 5.27682 20.8574 4.96274 20.5968C4.64866 20.3362 4.43553 19.9741 4.3602 19.573L2.5562 9.94997C2.17279 9.86251 1.82367 9.66396 1.5525 9.37915C1.28132 9.09433 1.10014 8.73589 1.03159 8.34865C0.963047 7.96141 1.01019 7.56255 1.16712 7.20196C1.32405 6.84137 1.5838 6.53504 1.9139 6.32129C2.24399 6.10753 2.62978 5.99584 3.02302 6.00017C3.41626 6.00451 3.79949 6.12468 4.12479 6.34565C4.4501 6.56663 4.70304 6.87861 4.85198 7.24257C5.00093 7.60654 5.03926 8.00633 4.9622 8.39197L7.6122 9.71797C7.66343 9.74349 7.72186 9.75066 7.77773 9.73828C7.83361 9.7259 7.88354 9.69473 7.9192 9.64997L10.5432 6.36997C10.3197 6.13226 10.1577 5.84346 10.0714 5.52877C9.98511 5.21408 9.97713 4.88305 10.0482 4.56457C10.1192 4.24609 10.267 3.94982 10.4789 3.70161C10.6907 3.45339 10.96 3.26078 11.2634 3.14056C11.5667 3.02034 11.8949 2.97617 12.2192 3.01191C12.5436 3.04764 12.8542 3.16219 13.1241 3.34556C13.394 3.52894 13.615 3.77557 13.7677 4.06394C13.9204 4.35231 14.0002 4.67366 14.0002 4.99997ZM12.0002 6.99997H11.9602L9.0902 10.587C8.8401 10.8994 8.49048 11.1167 8.09961 11.2025C7.70874 11.2884 7.30024 11.2378 6.9422 11.059L4.1272 9.65197L4.0372 9.71097L5.8342 19.296C5.84494 19.3533 5.87542 19.4051 5.92035 19.4424C5.96528 19.4797 6.02183 19.5 6.0802 19.5H17.9202C17.9786 19.5 18.0351 19.4797 18.0801 19.4424C18.125 19.4051 18.1555 19.3533 18.1662 19.296L19.9632 9.71097L19.8732 9.65197L17.0582 11.059C16.7001 11.238 16.2913 11.2888 15.9002 11.2029C15.5092 11.117 15.1594 10.8996 14.9092 10.587L12.0402 6.99997H12.0002Z"
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
    id: "tk-gta-v",
    slug: "tk-gta-v",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 449.500",
    price: "Rp 219.500",
  },
  {
    id: "tk-rdr-2",
    slug: "tk-rdr-2",
    title: "Red Dead Redemption 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 640.000",
    price: "Rp 219.000",
  },
  {
    id: "tk-ghost-tsushima",
    slug: "tk-ghost-tsushima",
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    tier: "Tier 1",
    originalPrice: "Rp 879.000",
    price: "Rp 439.500",
  },
  {
    id: "ac-black-flag",
    slug: "ac-black-flag",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    tier: "Tier 2",
    originalPrice: "Rp 313.500",
    price: "Rp 219.500",
  },
  {
    id: "first-light",
    slug: "first-light",
    title: "SCP - First Light",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    tier: "Tier 2",
    originalPrice: "Rp 313.500",
    price: "Rp 219.500",
  },
  {
    id: "college-football-27",
    slug: "college-football-27",
    title: "EA SPORTS College Football 27",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    tier: "Tier 2",
    originalPrice: "Rp 313.500",
    price: "Rp 219.500",
  },
  {
    id: "subnautica-2",
    slug: "subnautica-2",
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    tier: "Tier 2",
    originalPrice: "Rp 313.500",
    price: "Rp 219.500",
  },
  {
    id: "tk-fc-26",
    slug: "tk-fc-26",
    title: "EA SPORTS FC 26",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    tier: "Tier 2",
    originalPrice: "Rp 799.000",
    price: "Rp 349.500",
  },
  {
    id: "rt-dead-by-daylight",
    slug: "rt-dead-by-daylight",
    title: "Dead by Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    tier: "Tier 3",
    originalPrice: "Rp 249.000",
    price: "Rp 99.600",
  },
  {
    id: "beholder-conductor",
    slug: "beholder-conductor",
    title: "Beholder: Conductor",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    tier: "Tier 3",
    originalPrice: "Rp 439.000,00",
    price: "Rp 122.999",
  },
  {
    id: "targeted-10-days",
    slug: "targeted-10-days",
    title: "Targeted - 10 Days",
    imageSrc:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/107410/hero_capsule.jpg",
    tier: "Tier 3",
    originalPrice: "Rp 439.000,00",
    price: "Rp 122.999",
  },
  {
    id: "tukoni-forest-keepers",
    slug: "tukoni-forest-keepers",
    title: "Tukoni: Forest Keepers",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1387610/library_600x900_2x.jpg",
    tier: "Tier 3",
    originalPrice: "Rp 439.000,00",
    price: "Rp 122.999",
  },
];

export interface BundleGame {
  id: string;
  slug?: string;
  steamAppId?: number;
  title: string;
  imageSrc: string;
  genres: string[];
  launcher?: string;
}

export const BUNDLE_GAMES: BundleGame[] = [
  {
    id: "b-1",
    slug: "ac-black-flag",
    steamAppId: 242050,
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-2",
    slug: "first-light",
    steamAppId: 1091500,
    title: "007 - First Light",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-3",
    slug: "college-football-27",
    steamAppId: 2582560,
    title: "EA SPORTS CF™ 27 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "EA",
  },
  {
    id: "b-4",
    slug: "subnautica-2",
    steamAppId: 1962700,
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-5",
    slug: "tk-fc-26",
    steamAppId: 2195250,
    title: "EA SPORTS FC™ 26 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "EA",
  },
  {
    id: "b-6",
    slug: "rt-dead-by-daylight",
    steamAppId: 381210,
    title: "Dead by Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Horror"],
    launcher: "Steam",
  },
  {
    id: "b-7",
    slug: "tk-ghost-tsushima",
    steamAppId: 2215430,
    title: "Phantom Blade",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "RPG"],
    launcher: "Steam",
  },
  {
    id: "b-8",
    slug: "tk-gta-v",
    steamAppId: 271590,
    title: "Grand Thief Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-9",
    slug: "tk-rdr-2",
    steamAppId: 1174180,
    title: "Read Dead Redemption II",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    genres: ["Action", "Adventure"],
    launcher: "Steam",
  },
  {
    id: "b-10",
    slug: "4197610",
    steamAppId: 4197610,
    title: "Vanakan",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4197610/caad28198a0aa74f908b0efead31904113c32e3f/hero_capsule_2x.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    launcher: "Steam",
  },
  {
    id: "b-11",
    slug: "344850",
    steamAppId: 344850,
    title: "Pharmacy Simulator: Big Pharma",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/344850/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Casual"],
    launcher: "Steam",
  },
  {
    id: "b-12",
    slug: "1245620",
    steamAppId: 1245620,
    title: "Learning on Demand Racing",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "Steam",
  },
  {
    id: "b-13",
    slug: "686810",
    steamAppId: 686810,
    title: "Hell Let Loose: Vietnam",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/686810/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Multiplayer"],
    launcher: "Steam",
  },
  {
    id: "b-14",
    slug: "203350",
    steamAppId: 203350,
    title: "The Lord of the Rings: War in the North™ - Legacy Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/203350/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "RPG"],
    launcher: "Steam",
  },
  {
    id: "b-15",
    slug: "2582560",
    steamAppId: 2582560,
    title: "EA SPORTS™ Madden NFL 27",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Sport-Racing"],
    launcher: "EA",
  },
  {
    id: "b-16",
    slug: "990080",
    steamAppId: 990080,
    title: "Earthworm Jim",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
    genres: ["Action", "Adventure", "Casual"],
    launcher: "Steam",
  },
];

const SUBSCRIPTION_GAMES = [
  {
    id: "dead-by-daylight",
    title: "Dead By Daylight",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
  },
  {
    id: "fc-26",
    title: "EA SPORTS FC™ 26 Standard Edition",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
  },
  {
    id: "rdr2",
    title: "Read Dead Redemption II",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
  },
  {
    id: "phantom-blade",
    title: "Phantom Blade Zero",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900_2x.jpg",
  },
  {
    id: "gta-v",
    title: "Grand Theft Auto V",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
  },
  {
    id: "cf-27",
    title: "EA SPORTS CF™ 27 Standard Edition",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
  },
  {
    id: "ac-black-flag",
    title: "Assassin's Creed Black Flag Resynced",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
  },
  {
    id: "007-first-light",
    title: "007 - First Light",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
  },
  {
    id: "subnautica-2",
    title: "Subnautica 2",
    discount: "-30%",
    originalPrice: "Rp 439.000,00",
    price: "Rp 219.500",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
  },
];

export default function BundlePage() {
  const router = useRouter();

  // Auth state
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart);
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isLoggedIn = isMounted && Boolean(isAuthenticated && authUser);

  // TanStack Query: Subscriptions API
  const { data: subscriptionPlansRes } = useSubscriptionPlans();
  const { data: userSubRes } = useUserSubscription();
  const { data: subsProductsRes } = useSubscriptionProducts();
  const { data: faqsApiRes } = useFaqs();
  const createOrderMutation = useCreateOrder();
  const resolvedFaqs = React.useMemo(() => {
    if (faqsApiRes?.data && faqsApiRes.data.length > 0) {
      return faqsApiRes.data
        .filter((f) => f.is_active)
        .map((f) => ({
          id: `faq-${f.id}`,
          title: f.question,
          content: f.answer,
        }));
    }
    return FAQ_ITEMS;
  }, [faqsApiRes]);

  // Mode switcher: "subscribed" (Image 3 & 4) vs "unsubscribed" (Image 2)
  const [viewMode, setViewMode] = React.useState<"subscribed" | "unsubscribed">("unsubscribed");

  // Sync active subscription from API if available
  React.useEffect(() => {
    if (userSubRes?.data) {
      if (userSubRes.data.status === "active") {
        setViewMode("subscribed");
      } else if (userSubRes.data.status === "expired") {
        setViewMode("unsubscribed");
      }
    }
  }, [userSubRes]);

  // Dynamic Pricing Plans from API or fallback
  const pricingPlans = React.useMemo(() => {
    if (subscriptionPlansRes?.data && subscriptionPlansRes.data.length > 0) {
      return subscriptionPlansRes.data.map((plan, idx) => ({
        id: String(plan.id),
        numericId: plan.id,
        rawPrice: plan.price,
        type: (idx === 1 ? "primary" : "secondary") as "primary" | "secondary",
        title: plan.name,
        price: formatRupiah(plan.price),
        period: `/${plan.duration ? `${plan.duration} Hari` : "Bulan"}`,
        features:
          plan.subscription_plan_features && plan.subscription_plan_features.length > 0
            ? plan.subscription_plan_features.map((f) => f.feature)
            : [
                "Mainkan Game Lebih Banyak",
                "Akses Seluruh Koleksi Paket",
                "Update Game Otomatis",
                "Dukungan CS 24/7",
              ],
      }));
    }
    return [
      {
        id: "plan-1",
        numericId: 1,
        rawPrice: 50000,
        type: "secondary" as const,
        title: "Paket 1",
        price: "IDR 50,000",
        period: "/ Month",
        features: [
          "Mainkan Game Lebih Banyak",
          "Akses Koleksi Game Paket",
          "Akses Instan Tanpa Antrean",
          "Dukungan CS 24/7",
        ],
      },
      {
        id: "plan-2",
        numericId: 2,
        rawPrice: 150000,
        type: "primary" as const,
        title: "Paket 2",
        price: "IDR 150,000",
        period: "/ Month",
        features: [
          "Mainkan Game Lebih Banyak",
          "Akses Seluruh Koleksi Paket",
          "Update Game Otomatis",
          "Dukungan CS 24/7",
        ],
      },
      {
        id: "plan-3",
        numericId: 3,
        rawPrice: 200000,
        type: "secondary" as const,
        title: "Paket 3",
        price: "IDR 200,000",
        period: "/ Month",
        features: [
          "Mainkan Game Lebih Banyak",
          "Semua Fitur VIP & Akses Prioritas",
          "Update Game Otomatis",
          "Dukungan CS 24/7",
        ],
      },
    ];
  }, [subscriptionPlansRes]);

  // Subscription Modal State (Image 1)
  const [isSubsModalOpen, setIsSubsModalOpen] = React.useState<boolean>(false);
  const [activeSubPlan, setActiveSubPlan] = React.useState<string>("Paket 2");
  const subsModalRef = React.useRef<HTMLDivElement | null>(null);

  const handleSubscribeToPlan = (plan: {
    id: string;
    numericId?: number;
    title: string;
    price: string;
    rawPrice?: number;
  }) => {
    const numericPrice =
      plan.rawPrice ||
      parseInt(plan.price.replace(/\D/g, "")) ||
      150000;
    const planItemId = `sub-${plan.numericId || plan.id}`;
    const planTitle = `Paket Langganan ${plan.title}`;
    const coverImage =
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg";

    // 1. Masukkan ke useCartStore
    addItem(planItemId, 1, {
      id: planItemId,
      title: planTitle,
      price: numericPrice,
      originalPrice: numericPrice,
      discount: "",
      imageSrc: coverImage,
      cover_image_url: coverImage,
    });

    // 2. Simpan ke sessionStorage untuk checkout
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "gamezygo_checkout_items",
          JSON.stringify([
            {
              id: planItemId,
              productId: plan.numericId || 1,
              title: planTitle,
              imageSrc: coverImage,
              price: numericPrice,
            },
          ])
        );
      }
    } catch {
      // ignore storage error
    }

    // 3. Tutup modal jika terbuka
    setIsSubsModalOpen(false);

    // 4. Feedback toast & navigasi ke keranjang
    handleToast(`"${planTitle}" berhasil dimasukkan ke keranjang! Mengalihkan ke keranjang...`);
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  };

  const handleSubscribeAction = (planTitle: string) => {
    const matched = pricingPlans.find((p) => p.title === planTitle);
    if (matched) {
      handleSubscribeToPlan(matched);
    } else {
      setActiveSubPlan(planTitle);
      setIsSubsModalOpen(true);
    }
  };

  // Prevent background scroll without breaking sticky navbar (no body overflow: hidden)
  React.useEffect(() => {
    if (!isSubsModalOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const container = subsModalRef.current;
      if (!container) {
        e.preventDefault();
        return;
      }

      // Check if the scroll target is inside the modal container
      if (!container.contains(e.target as Node)) {
        e.preventDefault();
        return;
      }

      // If the modal container is scrollable, allow scrolling within boundaries but prevent chaining
      const isScrollable = container.scrollHeight > container.clientHeight;
      if (!isScrollable) {
        e.preventDefault();
        return;
      }

      const atTop = container.scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 1 &&
        e.deltaY > 0;

      if (atTop || atBottom) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const container = subsModalRef.current;
      if (!container) {
        e.preventDefault();
        return;
      }

      // If touch is on backdrop or outside modal content, prevent background scrolling
      if (!container.contains(e.target as Node) || e.target === container) {
        e.preventDefault();
        return;
      }

      // If container cannot scroll, prevent touch drag
      if (container.scrollHeight <= container.clientHeight) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSubsModalOpen(false);
        return;
      }

      // Prevent background scrolling keys like Space, ArrowUp, ArrowDown, PageUp, PageDown
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space"].includes(e.key)) {
        const container = subsModalRef.current;
        if (!container || !container.contains(document.activeElement)) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubsModalOpen]);

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
  const [modalSort, setModalSort] = React.useState<string>("Terbaru");

  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  const [appliedGenres, setAppliedGenres] = React.useState<string[]>([]);
  const [appliedLaunchers, setAppliedLaunchers] = React.useState<string[]>([]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

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
  };

  const isSearchActive = searchQuery.trim().length > 0;
  const isFilterActive =
    appliedCategories.length > 0 ||
    appliedGenres.length > 0 ||
    appliedLaunchers.length > 0 ||
    appliedSort !== "Terbaru";

  const bundleGames: BundleGame[] = React.useMemo(() => {
    if (subsProductsRes?.data && subsProductsRes.data.length > 0) {
      return subsProductsRes.data.map((item) => ({
        id: String(item.id),
        slug: item.slug || String(item.id),
        steamAppId: (item as unknown as { steam_app_id?: number }).steam_app_id,
        title: item.name,
        imageSrc: item.thumbnail || "",
        genres: item.product_genre_categories?.map((g) => g.name) || ["Action", "Adventure"],
        launcher: item.product_launcher_category?.name || "Steam",
      }));
    }
    return BUNDLE_GAMES;
  }, [subsProductsRes]);

  const filteredGames: BundleGame[] = React.useMemo(() => {
    let list = [...bundleGames];

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

  // GUEST LANDING VIEW (matching previous subscription view)
  if (!isLoggedIn) {
    return (
      <>
        <Head>
          <title>Langganan Paket Gamezygo — Beli Sekali, Main Semua</title>
          <meta
            name="description"
            content="Berlangganan paket game Gamezygo. Akses tak terbatas ke ratusan game terbaik, nikmati katalog terlengkap, dan main sepuasnya."
          />
        </Head>

        <StoreLayout
          navbarVariant="guest"
          activeNavId="paket"
          hideSidebar={true}
          onLoginClick={() =>
            router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
          }
          onSignUpClick={() =>
            router.push(
              `/login?tab=signup&redirect=${encodeURIComponent(router.asPath)}`
            )
          }
          onCartClick={() => router.push("/cart")}
          contentClassName="w-full mx-auto px-4 sm:px-8 lg:px-20 py-10 sm:py-10 flex flex-col gap-16 sm:gap-24 lg:gap-50"
        >
          {/* ========================================================
              1. HERO SECTION: Header Component (matching Store)
             ======================================================== */}
          <div className="grid gap-10xl">
            <Header
              pillText="Promo Musim Panas Telah Datang!"
              title="Beli Sekali, Main Semua di Gamezygo!"
              subtitle="Mau lihat-lihat Game Dulu?"
              actionLabel="Lihat Toko"
              actionVariant="primary"
              onActionClick={() => router.push("/store")}
            />

            {/* ========================================================
                2. PRICING PLANS SECTION (Paket 1, Paket 2, Paket 3)
               ======================================================== */}
            <section className="w-full mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch lg:px-10xl">
                {pricingPlans.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    type={plan.type}
                    title={plan.title}
                    price={plan.price}
                    period={plan.period}
                    features={plan.features}
                    actionText="Subscribe"
                    onActionClick={() => handleSubscribeAction(plan.title)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* ========================================================
              3. GAME LIBRARY SECTION: Header, Subheader, 3x3 Grid
             ======================================================== */}
          <section className="w-full flex flex-col gap-6 sm:gap-8">
            {/* Centered Heading */}
            <Header
              as="h2"
              pillText="GAME LIBRARY"
              pillVariant="plain"
              title="Game yang Akan Anda Dapatkan!"
              subtitle={null}
              actionLabel={null}
            />

            {/* Subheader Bar (Left title + Right Pill Badge) */}
            <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4 mt-2 sm:mt-4">
              <h3 className="text-body-md sm:text-h5 font-semibold text-gray-50">
                Dapatkan Game Pilihan!
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                Total : {subsProductsRes?.meta?.total || "50.000"} Games
              </Button>
            </div>

            {/* 3x3 Grid with Bottom Fade-Out Shadow */}
            <div className="relative w-full overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-8">
                {SUBSCRIPTION_GAMES.map((game) => (
                  <GameListItem
                    key={game.id}
                    title={game.title}
                    imageSrc={game.imageSrc}
                    discount={game.discount}
                    originalPrice={game.originalPrice}
                    price={game.price}
                    onClick={() => router.push("/store")}
                  />
                ))}
              </div>

              {/* Bottom Fade Shadow Overlay */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/80 to-transparent z-10"
                aria-hidden="true"
              />
            </div>
          </section>

          {/* ========================================================
              4. FAQ SECTION: Left Title + Right Accordion
             ======================================================== */}
          <section className="w-full flex flex-col lg:grid lg:grid-cols-7 gap-10 lg:gap-16 items-start py-6">
            <div className="flex flex-col w-fit lg:col-span-3 gap-4 shrink-0 border-l-gradient-primary h-fit pl-6 sm:pl-8 pb-6">
              <span className="text-body-sm text-gray-400">
                FREQUENTLY ASKED QUESTION
              </span>
              <h2 className="text-h3 sm:text-h2 font-semibold leading-[120%] text-gradient-heading w-fit">
                Pertanyaan yang <br /> Sering Ditanyakan!
              </h2>
              <div className="flex gap-3 w-full justify-between items-center mt-8">
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

            <div className="flex-1 min-w-0 w-full lg:col-span-4">
              <Accordion
                items={resolvedFaqs}
                defaultOpenId="faq-1"
                allowMultiple={false}
                isLanding={true}
              />
            </div>
          </section>

          {/* Global Toast Feedback */}
          {toastMessage && (
            <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
              <Toast
                variant="success"
                title="Notifikasi"
                description={toastMessage}
                onClose={() => setToastMessage(null)}
              />
            </div>
          )}
        </StoreLayout>
      </>
    );
  }

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
                <div className="flex flex-col gap-5">
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
                    {pricingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="w-[85vw] max-w-85 sm:w-85 md:w-87.5 shrink-0 snap-center xl:w-auto xl:max-w-none flex flex-col"
                      >
                        <PricingCard
                          type={plan.type}
                          title={plan.title}
                          price={plan.price}
                          period={plan.period}
                          features={plan.features}
                          actionText="Subscribe"
                          onActionClick={() => handleSubscribeToPlan(plan)}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* SWIPER CONTROLS & INDICATOR (TABLET & MOBILE ONLY: < xl) */}
                  <div className="flex xl:hidden items-center justify-center pt-1 px-2">
               

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

                {/* 3-COL SCROLLABLE GRID OF GAME LIST ITEMS WITH BOTTOM FADE SHADOW */}
                <div className="relative">
                  <div className="max-h-92.5 overflow-y-auto pr-1 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {MINI_CATALOG_GAMES.map((game, idx) => (
                        <GameListItem
                          key={game.id || idx}
                          title={game.title}
                          imageSrc={game.imageSrc}
                          discount={game.tier}
                          originalPrice={game.originalPrice}
                          price={game.price}
                          onClick={() => router.push(`/store/${game.slug || game.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Bottom fade shadow indicator to show more scrollable items */}
                  <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/80 to-transparent" />
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
                      {appliedCategories.map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() =>
                            setAppliedCategories((prev) =>
                              prev.filter((c) => c !== cat)
                            )
                          }
                          className="cursor-pointer"
                        >
                          {cat}
                        </Button>
                      ))}
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
                      {appliedSort !== "Terbaru" && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() => setAppliedSort("Terbaru")}
                          className="cursor-pointer"
                        >
                          Sort: {appliedSort}
                        </Button>
                      )}
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
                      placeholder="Cari game"
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
                    showPriceRange={false}
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
                  {filteredGames.map((game) => {
                    const targetSlug =
                      game.slug ||
                      (game.steamAppId ? String(game.steamAppId) : undefined) ||
                      game.id;
                    return (
                      <ProductCard
                        key={game.id}
                        orientation="vertical"
                        title={game.title}
                        imageSrc={game.imageSrc}
                        genres={game.genres}
                        platform={game.launcher}
                        showPrice={false}
                        showActionButton={false}
                        href={`/credentials/${targetSlug}`}
                        className="hover:-translate-y-0.5 transition-transform duration-200 pb-8xl cursor-pointer"
                      />
                    );
                  })}
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
          <section className="grid lg:flex-row gap-10 lg:gap-16 pt-10xl mt-10xl pb-8 border-t border-white/5">
            <div className="flex flex-col gap-4  shrink-0 border-l-gradient-primary h-fit pl-8 pb-6 w-fit border-roun">
            
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
          <div
            ref={subsModalRef}
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-xs animate-fade-in flex min-h-full items-center justify-center p-4 sm:p-6"
          >
            <div
              className="fixed inset-0 -z-10"
              onClick={() => setIsSubsModalOpen(false)}
            />
            <div className="relative z-10 w-3/7 mx-auto bg-deep-blue-950 border-gradient-secondary rounded-lg p-6 sm:p-8 flex flex-col gap-6 my-auto">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-b-gradient-secondary pb-4">
                <h3 className="text-h6 font-bold text-gray-50">Subscription</h3>
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
                <span className="text-body-sm uppercase text-gray-400">
                  SUBSCRIPTION
                </span>
                <div className="flex items-center justify-between p-3 rounded-lg bg-deep-blue-900 border border-gradient-secondary">
                  <div className="flex items-center gap-3">
                    <CrownIcon className="text-gray-400 w-5 h-5 shrink-0" />
                    <span className="font-semibold text-gray-50 text-body-md">
                      {activeSubPlan}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-50 text-body-md">
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
                    "Akses Koleksi Game Paket",
                    "Akses Instan Tanpa Antrean",
                    "Dukungan CS 24/7",
                  ]}
                  actionText="Subscribe"
                  onActionClick={() => {
                    handleSubscribeToPlan({
                      id: "plan-1",
                      numericId: 1,
                      title: "Paket 1",
                      price: "IDR 50,000",
                      rawPrice: 50000,
                    });
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
                    "Akses Seluruh Koleksi Paket",
                    "Update Game Otomatis",
                    "Dukungan CS 24/7",
                  ]}
                  actionText="Subscribe"
                  onActionClick={() => {
                    handleSubscribeToPlan({
                      id: "plan-2",
                      numericId: 2,
                      title: "Paket 2",
                      price: "IDR 150,000",
                      rawPrice: 150000,
                    });
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
                    "Semua Fitur VIP & Akses Prioritas",
                    "Update Game Otomatis",
                    "Dukungan CS 24/7",
                  ]}
                  actionText="Subscribe"
                  onActionClick={() => {
                    handleSubscribeToPlan({
                      id: "plan-3",
                      numericId: 3,
                      title: "Paket 3",
                      price: "IDR 200,000",
                      rawPrice: 200000,
                    });
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}


        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant="success"
              title="Notifikasi"
              description={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
