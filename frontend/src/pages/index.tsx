import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Pill,
  BannerCarousel,
  ProductCard,
  ProductCardRow,
  GameListItem,
  Tabs,
  SectionHeader,
  UserRank,
  TestimonialCard,
  Accordion,
  BlogCard,
  Toast,
} from "@/components/ui";
import { StoreLayout } from "@/components/layout";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { useAnnouncements, useFaqs } from "@/hooks/use-common";
import { useCustomSections, useProducts } from "@/hooks/use-products";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useReviews } from "@/hooks/use-reviews";
import { useBlogs } from "@/hooks/use-blogs";
import { useGameRequests } from "@/hooks/use-requests";
import { formatRupiah } from "@/utils/formatters";
import { mapAnnouncementToSlide, mapSectionProducts } from "@/utils/adapters";
import type { BannerSlide } from "@/components/ui/BannerCarousel/BannerCarousel.types";
import type { ProductCardRowItem } from "@/components/ui/ProductCardRow/ProductCardRow.types";
import productsData from "@/json/products.json";

// Feature Icons (SVG)
const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2L4 5V11C4 16.55 7.41 21.74 12 23C16.59 21.74 20 16.55 20 11V5L12 2ZM10 16.5L6 12.5L7.41 11.09L10 13.67L16.59 7.09L18 8.5L10 16.5Z"
      fill="currentColor"
    />
  </svg>
);

const BoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11 21H13L19 12H14L16 3H8L6 14H11V21Z"
      fill="currentColor"
    />
  </svg>
);

const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21.41 11.58L12.41 2.58C12.03 2.21 11.53 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.53 2.21 12.03 2.59 12.42L11.59 21.42C11.97 21.79 12.47 22 13 22C13.53 22 14.03 21.79 14.41 21.41L21.41 14.41C21.79 14.03 22 13.53 22 13C22 12.47 21.79 11.97 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
      fill="currentColor"
    />
  </svg>
);

const HeadsetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12V20C2 21.1 2.9 22 4 22H7C7.55 22 8 21.55 8 21V15C8 14.45 7.55 14 7 14H4V12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V14H17C16.45 14 16 14.45 16 15V21C16 21.55 16.45 22 17 22H20C21.1 22 22 21.1 22 20V12C22 6.48 17.52 2 12 2Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    {...props}
  >
    <path
      d="M8 3.33334V12.6667M8 3.33334L3.33333 8.00001M8 3.33334L12.6667 8.00001"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Fallback Banner slides
const FALLBACK_BANNERS: BannerSlide[] = [
  {
    id: "summer-promo-1",
    title: "Promo Musim Panas",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas - Gamezygo",
    href: "/store?promo=summer",
  },
  {
    id: "summer-promo-2",
    title: "Diskon Hingga 70%",
    imageSrc: "/assets/png/Container.png",
    alt: "Diskon Besar Gamezygo",
    href: "/store?promo=mega",
  },
  {
    id: "slide-1",
    title: "PROMO MINGGUAN",
    badge: "DISKON HINGGA 80%",
    imageSrc:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    href: "/store",
    alt: "Promo Mingguan Gamezygo",
  },
  {
    id: "slide-2",
    title: "RILISAN TERBARU",
    badge: "UPDATE SETIAP HARI",
    imageSrc:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
    href: "/store",
    alt: "Rilisan Terbaru Gamezygo",
  },
];

// Fallback FAQ Items
const DEFAULT_FAQS = [
  {
    id: "faq-1",
    title: "Bagaimana cara kerja pembelian akun game di Gamezygo?",
    content:
      "Setelah pembayaran berhasil diverifikasi otomatis, kredensial akun (username, password, dan token Steam Guard) akan langsung tersedia di menu Game Library Anda. Anda tinggal login ke launcher resmi (Steam/Epic) dan langsung mengunduh game.",
  },
  {
    id: "faq-2",
    title: "Apakah akun game di Gamezygo aman dan memiliki garansi?",
    content:
      "Ya, 100% aman dan bergaransi resmi anti-revoke. Semua akun game Gamezygo dibeli secara sah langsung dari publisher/store resmi tanpa modifikasi ilegal.",
  },
  {
    id: "faq-3",
    title: "Bagaimana jika akun meminta kode verifikasi Steam Guard saat login?",
    content:
      "Sistem kami dilengkapi dengan auto-authenticator. Anda dapat menyalin kode 2FA Steam Guard langsung dari kartu kredensial game di halaman detail kredensial Anda dalam hitungan detik.",
  },
  {
    id: "faq-4",
    title: "Metode pembayaran apa saja yang didukung?",
    content:
      "Kami mendukung QRIS (BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, LinkAja), Virtual Account bank nasional (BCA, BRI, BNI, Mandiri), dan transfer bank otomatis 24 jam.",
  },
  {
    id: "faq-5",
    title: "Apakah game bisa dimainkan secara offline?",
    content:
      "Tentu saja! Untuk game single-player, setelah proses instalasi selesai Anda dapat mengaktifkan mode offline pada Steam untuk pengalaman bermain yang bebas gangguan.",
  },
];

// Product Card Row Fallback items (7 items to enable scroll and right fade shadow)
const MINI_FEATURED_PRODUCTS: ProductCardRowItem[] = productsData.miniFeatured;
const TAWARAN_KHUSUS_PRODUCTS: ProductCardRowItem[] = productsData.tawaranKhusus;
const RILIS_TERBARU_PRODUCTS: ProductCardRowItem[] = productsData.rilisTerbaru;

export default function LandingPage() {
  const router = useRouter();

  // Global Stores
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addItem);

  // Toast State
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddToCart = (product: {
    id: number | string;
    title: string;
    price?: number;
    imageSrc?: string;
  }) => {
    addToCart(String(product.id));
    showToast(`"${product.title}" berhasil ditambahkan ke keranjang!`);
  };

  // 1. Hero Announcements / Banners
  const { data: announcementsRes } = useAnnouncements();
  const bannerSlides: BannerSlide[] = React.useMemo(() => {
    if (announcementsRes?.data && announcementsRes.data.length > 0) {
      return announcementsRes.data.map(mapAnnouncementToSlide);
    }
    return FALLBACK_BANNERS;
  }, [announcementsRes]);

  // 2. Custom Sections & Products
  const { data: sectionsRes } = useCustomSections();
  const { data: productsRes } = useProducts();

  const customSections = React.useMemo(() => {
    if (sectionsRes?.data && sectionsRes.data.length > 0) {
      return sectionsRes.data;
    }
    return null;
  }, [sectionsRes]);

  const productsList = productsRes?.data || [];

  // Special Flash Sale Section (e.g. from sections or first 3 products)
  const specialOffers = React.useMemo(() => {
    if (productsList.length > 0) {
      return productsList.slice(0, 3).map((p) => ({
        id: p.id,
        title: p.name,
        imageSrc:
          p.thumbnail ||
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
        price: p.discount_price || p.price,
        originalPrice: p.price,
        discount: p.discount ? `${p.discount}%` : "50%",
        platform: "Steam",
      }));
    }
    return [
      {
        id: 1,
        title: "Grand Theft Auto V: Premium Edition",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
        price: 189000,
        originalPrice: 429000,
        discount: "56%",
        platform: "Steam",
      },
      {
        id: 2,
        title: "Red Dead Redemption 2",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
        price: 240000,
        originalPrice: 640000,
        discount: "62%",
        platform: "Steam",
      },
      {
        id: 3,
        title: "Cyberpunk 2077: Ultimate Edition",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
        price: 299000,
        originalPrice: 699000,
        discount: "57%",
        platform: "Steam",
      },
    ];
  }, [productsList]);

  // 3. Deretan Game Terpopuler (Tabs: Trending, Terbaru, Segera)
  const [popularTab, setPopularTab] = React.useState<string>("trending");

  const popularGames = React.useMemo(() => {
    const trendingList = [
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

    const terbaruList = [
      {
        id: "fc-25",
        title: "EA SPORTS FC™ 25",
        discount: "-50%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 389.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
      },
      {
        id: "silent-hill-2",
        title: "Silent Hill 2 Remake",
        discount: "-29%",
        originalPrice: "Rp 650.000,00",
        price: "Rp 460.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2124490/library_600x900_2x.jpg",
      },
      {
        id: "space-marine-2",
        title: "Warhammer 40k: Space Marine 2",
        discount: "-30%",
        originalPrice: "Rp 599.000,00",
        price: "Rp 420.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2183900/library_600x900_2x.jpg",
      },
      {
        id: "black-myth",
        title: "Black Myth: Wukong",
        discount: "-20%",
        originalPrice: "Rp 699.000,00",
        price: "Rp 499.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900_2x.jpg",
      },
      {
        id: "tekken-8",
        title: "Tekken 8",
        discount: "-48%",
        originalPrice: "Rp 699.000,00",
        price: "Rp 360.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/library_600x900_2x.jpg",
      },
      {
        id: "persona-3",
        title: "Persona 3 Reload",
        discount: "-47%",
        originalPrice: "Rp 650.000,00",
        price: "Rp 340.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2161700/library_600x900_2x.jpg",
      },
      {
        id: "helldivers-2",
        title: "Helldivers 2",
        discount: "-48%",
        originalPrice: "Rp 579.000,00",
        price: "Rp 299.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/library_600x900_2x.jpg",
      },
      {
        id: "elden-ring-erdtree",
        title: "Elden Ring: Shadow of the Erdtree",
        discount: "-25%",
        originalPrice: "Rp 560.000,00",
        price: "Rp 420.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
      },
      {
        id: "dragons-dogma-2",
        title: "Dragon's Dogma 2",
        discount: "-48%",
        originalPrice: "Rp 750.000,00",
        price: "Rp 390.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2054970/library_600x900_2x.jpg",
      },
    ];

    const segeraList = [
      {
        id: "gta-6",
        title: "Grand Theft Auto VI",
        discount: "-15%",
        originalPrice: "Rp 999.000,00",
        price: "Rp 849.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
      },
      {
        id: "monster-hunter-wilds",
        title: "Monster Hunter Wilds",
        discount: "-27%",
        originalPrice: "Rp 720.000,00",
        price: "Rp 520.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2246340/library_600x900_2x.jpg",
      },
      {
        id: "ghost-of-yotei",
        title: "Ghost of Yotei",
        discount: "-20%",
        originalPrice: "Rp 850.000,00",
        price: "Rp 680.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
      },
      {
        id: "re-9",
        title: "Resident Evil 9: Apocalypse",
        discount: "-25%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 599.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2124490/library_600x900_2x.jpg",
      },
      {
        id: "fm-26",
        title: "Football Manager 2026",
        discount: "-30%",
        originalPrice: "Rp 650.000,00",
        price: "Rp 455.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
      },
      {
        id: "death-stranding-2",
        title: "Death Stranding 2: On The Beach",
        discount: "-20%",
        originalPrice: "Rp 850.000,00",
        price: "Rp 680.000",
        imageSrc:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "doom-dark-ages",
        title: "DOOM: The Dark Ages",
        discount: "-25%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 599.000",
        imageSrc:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "civilization-vii",
        title: "Sid Meier's Civilization® VII",
        discount: "-20%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 639.000",
        imageSrc:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "mafia-old-country",
        title: "Mafia: The Old Country",
        discount: "-20%",
        originalPrice: "Rp 750.000,00",
        price: "Rp 600.000",
        imageSrc:
          "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
      },
    ];

    if (popularTab === "terbaru") return terbaruList;
    if (popularTab === "segera") return segeraList;
    return trendingList;
  }, [popularTab]);

  // 7. Leaderboard (Weekly & Monthly)
  const { data: weeklyLbRes } = useLeaderboard("weekly");
  const { data: monthlyLbRes } = useLeaderboard("monthly");

  const weeklyRanks = React.useMemo(() => {
    if (weeklyLbRes?.data && weeklyLbRes.data.length > 0) {
      return weeklyLbRes.data.slice(0, 4);
    }
    return [
      { id: 1, rank: 1, name: "SultanGamer99", point: 18450 },
      { id: 2, rank: 2, name: "Dyven_Pro", point: 14200 },
      { id: 3, rank: 3, name: "RezaKolektor", point: 11800 },
      { id: 4, rank: 4, name: "Ardi_Steam", point: 9400 },
    ];
  }, [weeklyLbRes]);

  const monthlyRanks = React.useMemo(() => {
    if (monthlyLbRes?.data && monthlyLbRes.data.length > 0) {
      return monthlyLbRes.data.slice(0, 4);
    }
    return [
      { id: 11, rank: 1, name: "KolektorSejati", point: 54200 },
      { id: 12, rank: 2, name: "SultanGamer99", point: 49800 },
      { id: 13, rank: 3, name: "IndoGamerVault", point: 41200 },
      { id: 14, rank: 4, name: "Budi_Gamezygo", point: 35600 },
    ];
  }, [monthlyLbRes]);

  // 8. Testimonials (3 Customers)
  const { data: reviewsRes } = useReviews();
  const testimonialItems = React.useMemo(() => {
    if (reviewsRes?.data && reviewsRes.data.length >= 3) {
      return reviewsRes.data.slice(0, 3).map((r) => ({
        id: String(r.id),
        userName: r.user?.name || "Pelanggan Gamezygo",
        avatarSrc:
          r.user?.avatar_url ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        rating: `${r.rating || 5} Star`,
        review: r.review,
        gameName: "Black Myth Wukong & Koleksi Toko",
        images: (r.images || []).map((img) => img.url || img.file_url || "").filter(Boolean),
      }));
    }
    return [
      {
        id: "t1",
        userName: "Dyven Siauw",
        avatarSrc:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        rating: "5 Star",
        review:
          '“Gue gatau ada berapa org dibalik bisnis ini, gue mengapresiasi sebesar-besarnya. In this economy harga game mahal bgt, dan buat gue yg butuh test drive game mahal ini jadi solusi terbaik!”',
        gameName: "Black Myth Wukong, GTA V",
        images: [
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
        ],
      },
      {
        id: "t2",
        userName: "Rangga Pratama",
        avatarSrc:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
        rating: "5 Star",
        review:
          '“Proses checkout super cepat pake QRIS, pas bayar kredensial Steam Guard langsung muncul otomatis di library. Ga nyampe 2 menit udah bisa download!”',
        gameName: "Space Marine 2, Tekken 8",
        images: [
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2183900/header.jpg",
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
        ],
      },
      {
        id: "t3",
        userName: "Fikri Maulana",
        avatarSrc:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        rating: "5 Star",
        review:
          '“Awalnya ragu, tapi ternyata akun beneran aman dan lancar di mode offline. Udah beli 4 game disini buat nemenin liburan akhir pekan. Recommended seller!”',
        gameName: "Silent Hill 2, Cyberpunk 2077",
        images: [
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2124490/header.jpg",
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
        ],
      },
    ];
  }, [reviewsRes]);

  // 9. FAQs
  const { data: faqsRes } = useFaqs();
  const faqItems = React.useMemo(() => {
    if (faqsRes?.data && faqsRes.data.length > 0) {
      return faqsRes.data.map((f) => ({
        id: String(f.id),
        title: f.question,
        content: f.answer,
      }));
    }
    return DEFAULT_FAQS;
  }, [faqsRes]);

  // 10. Blogs (4 articles)
  const { data: blogsRes } = useBlogs({ page: 1 });
  const blogList = React.useMemo(() => {
    if (blogsRes?.data && blogsRes.data.length >= 4) {
      return blogsRes.data.slice(0, 4).map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        category: b.category?.name || "Game",
        date: b.published_at
          ? new Date(b.published_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "TERBARU",
        excerpt: b.sort_description,
        cover_image_url: b.banner_file_url,
      }));
    }
    return [
      {
        id: 1,
        slug: "rekomendasi-game-rpg-terbaik-2026",
        title: "10 Game RPG Terbaik yang Wajib Kamu Mainkan di Tahun 2026",
        category: "Rekomendasi",
        date: "1 MINGGU LALU",
        excerpt:
          "Dari dunia fantasi epik hingga aksi sci-fi memukau, berikut daftar game petualangan terbaik dengan cerita mendalam.",
        cover_image_url:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        slug: "tips-aman-bermain-game-original-steam",
        title: "Panduan Lengkap Mengaktifkan Mode Offline di Akun Steam",
        category: "Tips & Trik",
        date: "2 MINGGU LALU",
        excerpt:
          "Pelajari cara mudah mengatur cloud save dan bermain tanpa koneksi internet agar gameplay bebas hambatan.",
        cover_image_url:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        slug: "update-fitur-gamezygo-vault",
        title: "Fitur Auto Steam Guard Gamezygo: Ambil Kode 2FA Tanpa Menunggu",
        category: "Update Fitur",
        date: "3 MINGGU LALU",
        excerpt:
          "Kini seluruh kredensial akun dilengkapi integrasi kode 2FA otomatis di dalam Vault Library akun Anda.",
        cover_image_url:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        slug: "analisis-performa-monster-hunter-wilds",
        title: "Review & Benchmark Performa PC Monster Hunter Wilds",
        category: "Review",
        date: "1 BULAN LALU",
        excerpt:
          "Simak performa frame rate dan konfigurasi setting grafis terbaik untuk kartu grafis kelas menengah.",
        cover_image_url:
          "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
      },
    ];
  }, [blogsRes]);

  // 11. Game Requests (4 items)
  const { data: requestsRes } = useGameRequests({ scope: "all", page: 1 });
  const requestCards = React.useMemo(() => {
    if (requestsRes?.data && requestsRes.data.length >= 4) {
      return requestsRes.data.slice(0, 4).map((r, idx) => ({
        id: r.id,
        name: r.name,
        steam_url: r.steam_url,
        request_count: r.request_count || 100,
        cover_image:
          idx === 0
            ? "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg"
            : idx === 1
            ? "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg"
            : idx === 2
            ? "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2124490/library_600x900_2x.jpg"
            : "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900_2x.jpg",
      }));
    }
    return [
      {
        id: 1,
        name: "Grand Theft Auto VI",
        steam_url: "https://store.steampowered.com/app/271590",
        request_count: 852,
        cover_image:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
      },
      {
        id: 2,
        name: "Football Manager 2026",
        steam_url: "https://store.steampowered.com/app/2195250",
        request_count: 423,
        cover_image:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
      },
      {
        id: 3,
        name: "Resident Evil 9",
        steam_url: "https://store.steampowered.com/app/2124490",
        request_count: 389,
        cover_image:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2124490/library_600x900_2x.jpg",
      },
      {
        id: 4,
        name: "Ghost of Yotei",
        steam_url: "https://store.steampowered.com/app/2322010",
        request_count: 275,
        cover_image:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900_2x.jpg",
      },
    ];
  }, [requestsRes]);

  return (
    <>
      <Head>
        <title>Gamezygo — Platform Koleksi Akun Game Original & Instan Terlengkap</title>
        <meta
          name="description"
          content="Jelajahi ribuan akun game original Steam, Epic Games, dan EA dengan harga terjangkau, pengiriman instan, dan garansi penuh di Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant={isAuthenticated ? "login" : "guest"}
        activeNavId="home"
        hideSidebar={true}
        user={
          authUser
            ? {
                name: authUser.name || "Customer Gamezygo",
                avatarUrl: authUser.avatarUrl,
              }
            : undefined
        }
        onLoginClick={() => router.push("/login")}
        onSignUpClick={() => router.push("/login?tab=signup")}
        onCartClick={() => router.push("/cart")}
        contentClassName="w-full  mx-auto px-4 sm:px-8 lg:px-10 pb-20 flex flex-col gap-11xl"
      >
        {/* ========================================================
            1. HERO CAROUSEL BANNER (PROMO UTAMA / MUSIM PANAS)
           ======================================================== */}
        <section className="w-full">
          <BannerCarousel
            slides={bannerSlides}
            autoPlayInterval={6000}
            className="w-full h-52 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-2xl"
          />
        </section>

        {/* ========================================================
            2. GAME PILIHAN HANYA UNTUK ANDA (HORIZONTAL ROW SWIPEABLE)
           ======================================================== */}
        <section className="w-full flex flex-col gap-6">
          <SectionHeader
            type="outer"
            title="Game Pilihan Hanya Untuk Anda!"
            actionLabel="Lihat Semua"
            onActionClick={() => router.push("/store")}
          />
          <ProductCardRow
            orientation="horizontal"
            products={MINI_FEATURED_PRODUCTS}
            onAddToCart={(title) => {
              const item = MINI_FEATURED_PRODUCTS.find((p) => p.title === title);
              handleAddToCart({
                id: item?.id || 1,
                title: item?.title || title,
                imageSrc: item?.imageSrc,
              });
            }}
          />
        </section>

        {/* ========================================================
            3. DERETAN GAME TERPOPULER (Tabs + 3-Col GameListItem Grid + Fade Shadow)
           ======================================================== */}
        <section className="w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-0">
            <h2 className="text-h3 sm:text-h2 font-extrabold text-white tracking-tight pb-3">
              Deretan Game Terpopuler!
            </h2>
            <div className="shrink-0 -mb-px">
              <Tabs
                items={[
                  { id: "trending", label: "Trending" },
                  { id: "terbaru", label: "Terbaru" },
                  { id: "segera", label: "Segera" },
                ]}
                activeId={popularTab}
                onChange={setPopularTab}
                className="border-b-0"
              />
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {popularGames.map((game) => (
                <GameListItem
                  key={game.id}
                  title={game.title}
                  imageSrc={game.imageSrc}
                  discount={game.discount}
                  originalPrice={game.originalPrice}
                  price={game.price}
                  onClick={() => router.push(`/store`)}
                />
              ))}
            </div>

            {/* Bottom Fade Shadow Overlay (Gambar 1) */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/80 to-transparent z-10"
              aria-hidden="true"
            />
          </div>
        </section>

        {/* ========================================================
            4 & 5. DYNAMIC CUSTOM SECTIONS OR FALLBACK (TAWARAN KHUSUS & RILISAN TERBARU)
           ======================================================== */}
        {customSections && customSections.length > 0 ? (
          customSections.map((sec) => (
            <section key={sec.id} className="w-full flex flex-col gap-6">
              <SectionHeader
                type="outer"
                title={sec.title}
                actionLabel="Lihat Semua"
                onActionClick={() => router.push(`/store?section=${sec.slug}`)}
              />
              <ProductCardRow
                products={mapSectionProducts(sec)}
                onAddToCart={(title) => {
                  const item = mapSectionProducts(sec).find((p) => p.title === title);
                  handleAddToCart({
                    id: item?.id || 1,
                    title: item?.title || title,
                    imageSrc: item?.imageSrc,
                  });
                }}
              />
            </section>
          ))
        ) : (
          <>
            {/* 4. TAWARAN KHUSUS */}
            <section className="w-full flex flex-col gap-6">
              <SectionHeader
                type="outer"
                title="Tawaran Khusus!"
                actionLabel="Lihat Semua"
                onActionClick={() => router.push("/store")}
              />
              <ProductCardRow
                products={TAWARAN_KHUSUS_PRODUCTS}
                onAddToCart={(title) => {
                  const item = TAWARAN_KHUSUS_PRODUCTS.find((p) => p.title === title);
                  handleAddToCart({
                    id: item?.id || 1,
                    title: item?.title || title,
                    imageSrc: item?.imageSrc,
                  });
                }}
              />
            </section>

            {/* 5. RILISAN TERBARU */}
            <section className="w-full flex flex-col gap-6">
              <SectionHeader
                type="outer"
                title="Rilisan Terbaru!"
                actionLabel="Lihat Semua"
                onActionClick={() => router.push("/store")}
              />
              <ProductCardRow
                products={RILIS_TERBARU_PRODUCTS}
                onAddToCart={(title) => {
                  const item = RILIS_TERBARU_PRODUCTS.find((p) => p.title === title);
                  handleAddToCart({
                    id: item?.id || 1,
                    title: item?.title || title,
                    imageSrc: item?.imageSrc,
                  });
                }}
              />
            </section>
          </>
        )}

        {/* ========================================================
            6. SOLUSI & KEUNGGULAN GAMEZYGO: 4 Feature Boxes
           ======================================================== */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          <div className="lg:col-span-5 flex flex-col gap-3 border-l-4 border-rose-500 pl-6">
            <span className="text-label-xs font-bold uppercase tracking-wider text-rose-400">
              MENGAPA MEMILIH KAMI
            </span>
            <h2 className="text-h3 sm:text-h2 font-extrabold text-white leading-tight">
              Solusi Terbaik untuk Koleksi Game Original Anda
            </h2>
            <p className="text-body-sm text-gray-300 leading-relaxed mt-2">
              Gamezygo hadir menghadirkan akses bermain game PC original dengan harga paling hemat,
              keamanan terjamin, dan pengiriman otomatis instan.
            </p>
            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                className="cursor-pointer"
                onClick={() => router.push("/store")}
              >
                Mulai Belanja Sekarang
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-deep-blue-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <ShieldIcon className="w-6 h-6" />
              </div>
              <h3 className="text-body-md font-bold text-gray-50">100% Akun Original & Legal</h3>
              <p className="text-body-xs text-gray-400 leading-relaxed">
                Akun resmi terdaftar langsung di Steam, Epic Games, dan EA tanpa modifikasi ilegal.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-deep-blue-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <BoltIcon className="w-6 h-6" />
              </div>
              <h3 className="text-body-md font-bold text-gray-50">Pengiriman Kredensial Instan</h3>
              <p className="text-body-xs text-gray-400 leading-relaxed">
                Username, password, dan token Steam Guard otomatis masuk ke Vault Library Anda dalam hitungan detik.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-deep-blue-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TagIcon className="w-6 h-6" />
              </div>
              <h3 className="text-body-md font-bold text-gray-50">Hemat Biaya Hingga 80%</h3>
              <p className="text-body-xs text-gray-400 leading-relaxed">
                Solusi ekonomis untuk test drive game AAA impian Anda dengan biaya jauh lebih hemat dibanding store resmi.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-deep-blue-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HeadsetIcon className="w-6 h-6" />
              </div>
              <h3 className="text-body-md font-bold text-gray-50">Garansi Penuh & Support 24/7</h3>
              <p className="text-body-xs text-gray-400 leading-relaxed">
                Tim teknis Gamezygo siap memandu proses login dan mengatasi kendala teknis kapan pun dibutuhkan.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            7. LEADERBOARD PREVIEW: 2 Columns + Fade Shadow
           ======================================================== */}
        <section className="w-full flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2 ">
            <Pill variant="primary" size="md" className="font-bold">
              TOP GAMER COMMUNITY
            </Pill>
            <h2 className="text-h3 sm:text-h2 font-extrabold text-white">
              Tantang Rekan Gamer Kamu & Raih Posisi Teratas
            </h2>
            <p className="text-body-sm text-gray-400">
              Kumpulkan poin dari setiap transaksi dan jadilah nomor satu di leaderboard Gamezygo!
            </p>
          </div>

          <div className="w-full relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
              {/* Kolom Kiri: Mingguan */}
              <div className="flex flex-col gap-3 p-6 rounded-xl bg-deep-blue-900/40 border border-white/5 backdrop-blur-md">
                <h4 className="text-label-md font-bold text-gray-200 border-b border-white/5 pb-3">
                  LEADERBOARD MINGGU INI
                </h4>
                <div className="flex flex-col gap-2.5">
                  {weeklyRanks.map((user) => (
                    <UserRank
                      key={user.id}
                      rank={user.rank}
                      name={user.name}
                      points={user.point}
                    />
                  ))}
                </div>
              </div>

              {/* Kolom Kanan: Bulanan */}
              <div className="flex flex-col gap-3 p-6 rounded-xl bg-deep-blue-900/40 border border-white/5 backdrop-blur-md">
                <h4 className="text-label-md font-bold text-gray-200 border-b border-white/5 pb-3">
                  LEADERBOARD BULAN INI
                </h4>
                <div className="flex flex-col gap-2.5">
                  {monthlyRanks.map((user) => (
                    <UserRank
                      key={user.id}
                      rank={user.rank}
                      name={user.name}
                      points={user.point}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Fade Shadow */}
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-deep-blue-950 via-deep-blue-950/85 to-transparent rounded-b-xl" />
          </div>

          <div className="relative z-10 -mt-4">
            <Button
              variant="secondary"
              size="md"
              className="cursor-pointer font-bold px-8 shadow-xl"
              onClick={() => router.push("/leaderboard")}
            >
              Lihat Semua Leaderboard
            </Button>
          </div>
        </section>

        {/* ========================================================
            8. TESTIMONIAL PELANGGAN: 3 Testimonial Cards
           ======================================================== */}
        <section className="w-full flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2 ">
            <span className="text-label-xs font-bold uppercase tracking-wider text-rose-400">
              TESTIMONIAL PELANGGAN
            </span>
            <h2 className="text-h3 sm:text-h2 font-extrabold text-white">
              Dengarkan Pendapat Gamer Setelah Beli di Gamezygo
            </h2>
            <p className="text-body-sm text-gray-400">
              Pengalaman nyata dari ribuan gamer yang sudah bergabung dan menikmati layanan kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {testimonialItems.map((item) => (
              <TestimonialCard
                key={item.id}
                userName={item.userName}
                avatarSrc={item.avatarSrc}
                rating={item.rating}
                review={item.review}
                gameName={item.gameName}
                images={item.images}
                className="h-full bg-deep-blue-900/60 border border-white/5 backdrop-blur-md"
              />
            ))}
          </div>

          <div>
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={() => router.push("/review")}
            >
              Lihat Semua Ulasan
            </Button>
          </div>
        </section>

        {/* ========================================================
            9. FAQ (PERTANYAAN UMUM): Left Title + Right Accordion
           ======================================================== */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-6">
          <div className="lg:col-span-5 flex flex-col gap-3 border-l-4 border-rose-500 pl-6">
            <span className="text-label-xs font-bold uppercase tracking-wider text-rose-400">
              BANTUAN & PERTANYAAN
            </span>
            <h2 className="text-h3 sm:text-h2 font-extrabold text-white leading-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-body-sm text-gray-300 leading-relaxed mt-2">
              Punya pertanyaan seputar akun game, garansi, atau cara login? Temukan jawabannya di sini
              atau hubungi tim support kami.
            </p>
            <div className="pt-4">
              <Button
                variant="secondary"
                size="md"
                className="cursor-pointer"
                onClick={() => router.push("/review")}
              >
                Hubungi Customer Support
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Accordion items={faqItems} defaultOpenId="faq-1" allowMultiple={false} />
          </div>
        </section>

        {/* ========================================================
            10. BERITA GAMEZYGO: 2x2 Blog Cards Grid
           ======================================================== */}
        <section className="w-full flex flex-col gap-6">
          <SectionHeader
            type="outer"
            title="Berita Gamezygo"
            actionLabel="Lihat Semua Artikel"
            onActionClick={() => router.push("/blogs")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {blogList.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                category={blog.category}
                date={blog.date}
                description={blog.excerpt}
                imageSrc={blog.cover_image_url}
                href={`/blogs/${blog.slug}`}
              />
            ))}
          </div>
        </section>

        {/* ========================================================
            11. REQUEST GAME FAVORITMU: CTA + 2x2 Grid
           ======================================================== */}
        <section className="w-full flex flex-col items-center gap-8 text-center p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-deep-blue-900/60 to-deep-blue-950 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col items-center gap-2 ">
            <span className="text-label-xs font-bold uppercase tracking-wider text-rose-400">
              REQUEST GAME IMPIAN
            </span>
            <h2 className="text-h3 sm:text-h2 font-extrabold text-white">
              Game yang Kamu Cari Belum Tersedia di Store?
            </h2>
            <p className="text-body-sm text-gray-300">
              Kirimkan link Steam game impianmu, ajak komunitas voting bersama, dan tim kami akan
              segera menghadirkannya ke katalog store!
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="cursor-pointer font-bold px-8 shadow-xl"
                onClick={() => router.push("/request")}
              >
                Ajukan Request Game Sekarang
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left ">
            {requestCards.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-deep-blue-950 shrink-0">
                  <img
                    src={req.cover_image}
                    alt={req.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <span className="text-body-sm font-bold text-gray-100 truncate">
                    {req.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Pill variant="secondary" size="sm" className="font-semibold text-gray-300">
                      {req.request_count} Request
                    </Pill>
                    <span className="text-label-xs text-rose-400 font-medium">Dalam Voting</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0 cursor-pointer"
                  onClick={() => router.push("/request")}
                >
                  <ArrowUpIcon className="mr-1 text-rose-400" />
                  Vote
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm">
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