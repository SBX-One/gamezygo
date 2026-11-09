import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
  Button,
  Pill,
  BannerCarousel,
  ProductCard,
  ProductCardRow,
  GameListItem,
  Tabs,
  SectionHeader,
  Header,
  UserRank,
  TestimonialCard,
  Accordion,
  BlogCard,
  Toast,
  CinematicLoader,
} from "@/components/ui";
import { useLandingAnimations } from "@/hooks/use-landing-animations";
import { StoreLayout } from "@/components/layout";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { useAddToCart } from "@/hooks/use-cart";
import { useOwnedGames } from "@/hooks/use-library";
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

// Fallback Banner slides
const FALLBACK_BANNERS: BannerSlide[] = [
  {
    id: "summer-promo-1",
    title: "Promo Musim Panas",
    imageSrc: "/assets/png/Banner.png",
    alt: "Promo Musim Panas - Gamezygo",
    href: "/store?promo=summer",
  },
  {
    id: "summer-promo-2",
    title: "Diskon Hingga 70%",
    imageSrc: "/assets/png/Banner.png",
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

// Fallback FAQ Items (from bundle.tsx)
const DEFAULT_FAQS = [
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

// Product Card Row Fallback items (7 items to enable scroll and right fade shadow)
const MINI_FEATURED_PRODUCTS: ProductCardRowItem[] = productsData.miniFeatured;
const TAWARAN_KHUSUS_PRODUCTS: ProductCardRowItem[] = productsData.tawaranKhusus;
const RILIS_TERBARU_PRODUCTS: ProductCardRowItem[] = productsData.rilisTerbaru;

// 4-Step Guide (Mulai Main Dengan 4 Langkah)
const HOW_TO_PLAY_STEPS = [
  {
    step: "Langkah 1",
    title: "Cari Game",
    description: "Cari game yang kamu mau dari katalog kami.",
    icon: "/assets/svg/fluent_people-search-24-filled.svg",
  },
  {
    step: "Langkah 2",
    title: "Daftar & Bayar",
    description: "Buat akun dan selesaikan pembayaran",
    icon: "/assets/svg/fluent_person-add-24-filled.svg",
  },
  {
    step: "Langkah 3",
    title: "Dapat Akses Login",
    description: "Terima username, password & kode guard Steam secara instan.",
    icon: "/assets/svg/fluent_key-multiple-24-filled.svg",
  },
  {
    step: "Langkah 4",
    title: "Main Offline",
    description: "Login, download, masuk offline mode, dan nikmati.",
    icon: "/assets/svg/fluent_games-24-filled.svg",
  },
];

// Community Groups (Bergabung dengan komunitas Gamezygo!)
const COMMUNITY_GROUPS = [
  {
    id: "cg-1",
    title: "Komunitas GTA | Gamezygo",
    platform: "Whatsapp",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    link: "https://chat.whatsapp.com",
  },
  {
    id: "cg-2",
    title: "Komunitas EAFC | Gamezygo",
    platform: "Whatsapp",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    link: "https://chat.whatsapp.com",
  },
  {
    id: "cg-3",
    title: "Komunitas RDR II | Gamezygo",
    platform: "Whatsapp",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    link: "https://chat.whatsapp.com",
  },
  {
    id: "cg-4",
    title: "Komunitas DBD | Gamezygo",
    platform: "Whatsapp",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    link: "https://chat.whatsapp.com",
  },
];

export default function LandingPage() {
  const router = useRouter();

  // Global Stores
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart);
  const addToCartMutation = useAddToCart();
  const { isGameOwned } = useOwnedGames();

  const enrichRowItems = React.useCallback(
    (items: ProductCardRowItem[]) =>
      items.map((item) => {
        const owned = isGameOwned(item.id, item.title);
        const inCart = isInCart(item.id, item.title);
        return {
          ...item,
          buttonText: owned ? "Sudah Dimiliki" : inCart ? "Di Keranjang" : "Tambah Keranjang",
          isActionDisabled: owned || inCart,
        };
      }),
    [isGameOwned, isInCart]
  );

  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isUserLoggedIn = isMounted && isAuthenticated;

  // Opening sequence completion state and section-by-section scroll animations
  const [isOpeningComplete, setIsOpeningComplete] = React.useState(false);
  useLandingAnimations({ enabled: isOpeningComplete });

  const handleOpeningComplete = React.useCallback(() => {
    setIsOpeningComplete(true);
  }, []);

  // Toast State
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [opinionInput, setOpinionInput] = React.useState("");

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
    originalPrice?: number;
    discount?: string;
    imageSrc?: string;
  }) => {
    if (isGameOwned(product.id, product.title)) {
      showToast(`Anda sudah memiliki "${product.title}" di Library Anda!`);
      return;
    }

    if (isInCart(product.id, product.title)) {
      showToast(`"${product.title}" sudah ada di keranjang belanja Anda!`);
      return;
    }
    addToCart(String(product.id), 1, {
      title: product.title,
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      discount: product.discount || "",
      imageSrc: product.imageSrc || "",
    });
    const numId = Number(product.id);
    if (isAuthenticated && !isNaN(numId) && numId > 0) {
      addToCartMutation.mutate(numId);
    }
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
  const popularScrollRef = React.useRef<HTMLDivElement>(null);
  const [canPopularScrollUp, setCanPopularScrollUp] = React.useState<boolean>(false);
  const [canPopularScrollDown, setCanPopularScrollDown] = React.useState<boolean>(true);
  const [popularScrollProgress, setPopularScrollProgress] = React.useState<number>(0);

  const checkPopularScroll = React.useCallback(() => {
    const el = popularScrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    setCanPopularScrollUp(scrollTop > 12);
    setCanPopularScrollDown(maxScroll > 10 && scrollTop < maxScroll - 16);
    setPopularScrollProgress(maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0);
  }, []);

  React.useEffect(() => {
    const el = popularScrollRef.current;
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
    const timer = setTimeout(checkPopularScroll, 120);
    return () => clearTimeout(timer);
  }, [popularTab, checkPopularScroll]);

  React.useEffect(() => {
    const el = popularScrollRef.current;
    if (!el) return;
    checkPopularScroll();
    const ro = new ResizeObserver(() => {
      checkPopularScroll();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkPopularScroll]);

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
      {
        id: "elden-ring",
        title: "Elden Ring: Shadow of the Erdtree",
        discount: "-25%",
        originalPrice: "Rp 560.000,00",
        price: "Rp 420.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
      },
      {
        id: "cyberpunk-2077",
        title: "Cyberpunk 2077: Ultimate Edition",
        discount: "-50%",
        originalPrice: "Rp 699.000,00",
        price: "Rp 349.500",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
      },
      {
        id: "black-myth-wukong",
        title: "Black Myth: Wukong",
        discount: "-20%",
        originalPrice: "Rp 699.000,00",
        price: "Rp 499.000",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900_2x.jpg",
      },
      {
        id: "ghost-tsushima",
        title: "Ghost of Tsushima DIRECTOR'S CUT",
        discount: "-50%",
        originalPrice: "Rp 879.000,00",
        price: "Rp 439.500",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
      },
      {
        id: "god-of-war-ragnarok",
        title: "God of War Ragnarök",
        discount: "-20%",
        originalPrice: "Rp 879.000,00",
        price: "Rp 703.200",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900_2x.jpg",
      },
      {
        id: "hogwarts-legacy",
        title: "Hogwarts Legacy Digital Deluxe",
        discount: "-70%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 239.700",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
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
      {
        id: "ff-xvi",
        title: "Final Fantasy XVI Complete",
        discount: "-20%",
        originalPrice: "Rp 729.000,00",
        price: "Rp 583.200",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2515020/library_600x900_2x.jpg",
      },
      {
        id: "frostpunk-2",
        title: "Frostpunk 2 Deluxe Edition",
        discount: "-15%",
        originalPrice: "Rp 649.000,00",
        price: "Rp 551.650",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1601580/library_600x900_2x.jpg",
      },
      {
        id: "metaphor-refantazio",
        title: "Metaphor: ReFantazio",
        discount: "-15%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 679.150",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2627720/library_600x900_2x.jpg",
      },
      {
        id: "stalker-2",
        title: "S.T.A.L.K.E.R. 2: Heart of Chornobyl",
        discount: "-10%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 719.100",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1643320/library_600x900_2x.jpg",
      },
      {
        id: "star-wars-outlaws",
        title: "Star Wars Outlaws Gold Edition",
        discount: "-25%",
        originalPrice: "Rp 999.000,00",
        price: "Rp 749.250",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2842040/library_600x900_2x.jpg",
      },
      {
        id: "kingdom-come-2",
        title: "Kingdom Come: Deliverance II",
        discount: "-15%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 679.150",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1771300/library_600x900_2x.jpg",
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
      {
        id: "witcher-4",
        title: "The Witcher 4: Polaris",
        discount: "-10%",
        originalPrice: "Rp 899.000,00",
        price: "Rp 809.100",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900_2x.jpg",
      },
      {
        id: "borderlands-4",
        title: "Borderlands 4",
        discount: "-15%",
        originalPrice: "Rp 850.000,00",
        price: "Rp 722.500",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1285190/library_600x900_2x.jpg",
      },
      {
        id: "silksong",
        title: "Hollow Knight: Silksong",
        discount: "-20%",
        originalPrice: "Rp 249.000,00",
        price: "Rp 199.200",
        imageSrc:
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1030300/library_600x900_2x.jpg",
      },
      {
        id: "fable-4",
        title: "Fable",
        discount: "-15%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 679.150",
        imageSrc:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "judas",
        title: "Judas",
        discount: "-20%",
        originalPrice: "Rp 799.000,00",
        price: "Rp 639.200",
        imageSrc:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      },
    ];

    if (popularTab === "terbaru") return terbaruList;
    if (popularTab === "segera") return segeraList;
    return trendingList;
  }, [popularTab]);

  // 7. Leaderboard (Monthly & Weekly)
  const { data: weeklyLbRes } = useLeaderboard("weekly");
  const { data: monthlyLbRes } = useLeaderboard("monthly");

  const getUserRankClass = (idx: number) =>
    idx === 0
      ? "bg-surface-secondary-default border border-[#2F2F37] rounded-lg px-6 py-3.5 shadow-none hover:border-[#2F2F37] [&_.text-h6]:text-body-md [&_.text-h6]:font-semibold"
      : "bg-transparent border border-transparent rounded-lg px-6 py-3.5 shadow-none hover:bg-white/[0.02] hover:border-transparent [&_.text-h6]:text-body-md [&_.text-h6]:font-semibold";

  const monthlyRanks = React.useMemo(() => {
    if (monthlyLbRes?.data && monthlyLbRes.data.length > 0) {
      return monthlyLbRes.data.slice(0, 4).map((u) => ({
        id: u.rank,
        rank: u.rank,
        name: u.name,
        point: u.point,
      }));
    }
    return [
      { id: 1, rank: 1, name: "NgurahffTzy_00", point: 999 },
      { id: 2, rank: 2, name: "RendyGaming_67", point: 999 },
      { id: 3, rank: 3, name: "Operguabolanya009", point: 999 },
      { id: 4, rank: 4, name: "Rendy Mahardika", point: 999 },
    ];
  }, [monthlyLbRes]);

  const weeklyRanks = React.useMemo(() => {
    if (weeklyLbRes?.data && weeklyLbRes.data.length > 0) {
      return weeklyLbRes.data.slice(0, 4).map((u) => ({
        id: u.rank,
        rank: u.rank,
        name: u.name,
        point: u.point,
      }));
    }
    return [
      { id: 1, rank: 1, name: "Mighty_god_killer505", point: 999 },
      { id: 2, rank: 2, name: "Dewa Kipas", point: 999 },
      { id: 3, rank: 3, name: "Herisiapa66", point: 999 },
      { id: 4, rank: 4, name: "Rendy Mahardika", point: 999 },
    ];
  }, [weeklyLbRes]);

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
        id: "t-1",
        userName: "Cihuyy6767",
        gameName: "Black Myth Wukong, 2+",
        avatarSrc:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        rating: "5 Star",
        review:
          '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...”',
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
        avatarSrc:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
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
        avatarSrc:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&h=120&q=80",
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
        avatarSrc:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        rating: "5 Star",
        review:
          "“Gamezygo penyelamat dompet mahasiswa! Spek game detail banget ditampilin jadi sebelum beli tau kuat apa ngga PC gue. Sukses terus Gamezygo!”",
        images: [
          "https://images.unsplash.com/photo-1612287233216-52c6f1f8b65c?auto=format&fit=crop&w=320&h=180&q=80",
          "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=320&h=180&q=80",
        ],
      },
    ];
  }, [reviewsRes]);

  // Quadrupled items for seamless infinite moving carousel (matching credentials/[id].tsx)
  const infiniteTestimonials = React.useMemo(() => {
    return [
      ...testimonialItems,
      ...testimonialItems,
      ...testimonialItems,
      ...testimonialItems,
    ];
  }, [testimonialItems]);

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
      {/* Cinematic Opening Sequence */}
      <CinematicLoader onComplete={handleOpeningComplete} />

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
        contentClassName="w-full mx-auto max-w-360 px-4 sm:px-8 lg:px-20 py-10 sm:py-10 flex flex-col gap-16 sm:gap-24 lg:gap-50"
      >
        {/* ========================================================
            1. HERO CAROUSEL BANNER (PROMO UTAMA / MUSIM PANAS)
           ======================================================== */}
        <section data-animate-section="hero" className="w-full flex flex-col gap-12">
          <div data-animate="hero-banner">
            <BannerCarousel
              slides={bannerSlides}
              autoPlayInterval={6000}
              className="w-full h-55 sm:h-75 lg:h-105 min-h-55 sm:min-h-75 lg:min-h-105 rounded-lg overflow-hidden shadow-2xl"
            />
          </div>

        {/* ========================================================
            2. GAME PILIHAN HANYA UNTUK ANDA (HORIZONTAL ROW SWIPEABLE)
           ======================================================== */}
        <section data-animate-section="game-pilihan" className="w-full flex flex-col gap-6">
          <div data-animate="header">
            <SectionHeader
              type="outer"
              title="Game Pilihan Hanya Untuk Anda!"
              actionLabel="Lihat Semua"
              onActionClick={() => router.push("/store")}
            />
          </div>
          <div data-animate="cards-track">
            <ProductCardRow
              orientation="horizontal"
              products={enrichRowItems(MINI_FEATURED_PRODUCTS)}
              onAddToCart={(title) => {
                const item = MINI_FEATURED_PRODUCTS.find((p) => p.title === title);
                const price = item?.numericPrice || (item?.price ? parseInt(item.price.replace(/\D/g, '')) || 0 : 0);
                const origPrice = item?.originalPrice ? parseInt(item.originalPrice.replace(/\D/g, '')) || price : price;
                handleAddToCart({
                  id: item?.id || 1,
                  title: item?.title || title,
                  imageSrc: item?.imageSrc,
                  price,
                  originalPrice: origPrice,
                  discount: item?.discount,
                });
              }}
            />
          </div>
        </section>
      </section>

        {/* ========================================================
            3. DERETAN GAME TERPOPULER (Tabs + 3-Col GameListItem Grid + Fade Shadow)
           ======================================================== */}
        <section data-animate-section="popular-games" className="w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-0">
            <p data-animate="title" className="text-h3 font-semibold text-gradient-heading  pb-8">
              Deretan Game Terpopuler!
            </p>
            <div data-animate="tabs" className="shrink-0 -mb-px">
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

          <div className="relative w-full group/popular-grid">
            {/* Top Fade Shadow Overlay (Muncul saat user scroll ke bawah) */}
            <div
              className={cn(
                "pointer-events-none absolute top-0 left-0 right-0 h-14 bg-linear-to-b from-deep-blue-950 via-deep-blue-950/80 to-transparent z-10 transition-opacity duration-300",
                canPopularScrollUp ? "opacity-100" : "opacity-0"
              )}
              aria-hidden="true"
            />

            {/* Scrollable Container (User dapat scroll ke bawah menggunakan wheel, gesture swipe, atau tombol) */}
            <div
              ref={popularScrollRef}
              onScroll={checkPopularScroll}
              className="max-h-87.5 sm:max-h-95 overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain pb-14 pt-1 px-1 -mx-1"
            >
              <div data-animate="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
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
            </div>

            {/* Bottom Fade Shadow Overlay (Indikator affordance bahwa masih ada item di bawah) */}
            <div
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/90 to-transparent z-10 transition-opacity duration-300",
                canPopularScrollDown ? "opacity-100" : "opacity-0"
              )}
              aria-hidden="true"
            />

            {/* Floating Quick Action / Scroll Down Pill Button */}
            {canPopularScrollDown && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300">
                <button
                  type="button"
                  onClick={() => {
                    popularScrollRef.current?.scrollBy({ top: 220, behavior: "smooth" });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-deep-blue-950/90 hover:bg-deep-blue-900 border border-white/15 hover:border-white/30 backdrop-blur-md text-label-xs font-medium text-gray-300 hover:text-white shadow-xl cursor-pointer transition-all hover:scale-105 active:scale-95"
                  aria-label="Scroll kebawah untuk melihat game lainnya"
                >
                  <span>Scroll kebawah</span>
                  <svg
                    className="w-3.5 h-3.5 text-rose-400 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            4 & 5. DYNAMIC CUSTOM SECTIONS OR FALLBACK (TAWARAN KHUSUS & RILISAN TERBARU)
           ======================================================== */}
        {customSections && customSections.length > 0 ? (
          customSections.map((sec, idx) => {
            const secProducts = enrichRowItems(mapSectionProducts(sec));
            if (secProducts.length === 0) return null;
            return (
              <section
                key={sec.id}
                data-animate-section={
                  idx === 0 ? "tawaran-khusus" : idx === 1 ? "rilis-terbaru" : `custom-sec-${idx}`
                }
                className="w-full flex flex-col gap-6"
              >
                <div data-animate="header">
                  <SectionHeader
                    type="outer"
                    title={sec.title}
                    actionLabel="Lihat Semua"
                    onActionClick={() => router.push(`/store?section=${sec.slug}`)}
                  />
                </div>
                <div data-animate="cards-track">
                  <ProductCardRow
                    products={secProducts}
                    visibleCount={
                      isUserLoggedIn
                        ? 4
                        : sec.slug === "rilis-terbaru" || sec.title?.toLowerCase().includes("terbaru")
                        ? 5
                        : 4
                    }
                    onAddToCart={(title) => {
                      const item = mapSectionProducts(sec).find((p) => p.title === title);
                      const price = item?.numericPrice || (item?.price ? parseInt(item.price.replace(/\D/g, '')) || 0 : 0);
                      const origPrice = item?.originalPrice ? parseInt(item.originalPrice.replace(/\D/g, '')) || price : price;
                      handleAddToCart({
                        id: item?.id || 1,
                        title: item?.title || title,
                        imageSrc: item?.imageSrc,
                        price,
                        originalPrice: origPrice,
                        discount: item?.discount,
                      });
                    }}
                  />
                </div>
              </section>
            );
          })
        ) : (
          <>
            {/* 4. TAWARAN KHUSUS */}
            <section data-animate-section="tawaran-khusus" className="w-full flex flex-col gap-6">
              <div data-animate="header">
                <SectionHeader
                  type="outer"
                  title="Tawaran Khusus!"
                  actionLabel="Lihat Semua"
                  onActionClick={() => router.push("/store")}
                />
              </div>
              <div data-animate="cards-track">
                <ProductCardRow
                  products={enrichRowItems(TAWARAN_KHUSUS_PRODUCTS)}
                  onAddToCart={(title) => {
                    const item = TAWARAN_KHUSUS_PRODUCTS.find((p) => p.title === title);
                    const price = item?.numericPrice || (item?.price ? parseInt(item.price.replace(/\D/g, '')) || 0 : 0);
                    const origPrice = item?.originalPrice ? parseInt(item.originalPrice.replace(/\D/g, '')) || price : price;
                    handleAddToCart({
                      id: item?.id || 1,
                      title: item?.title || title,
                      imageSrc: item?.imageSrc,
                      price,
                      originalPrice: origPrice,
                      discount: item?.discount,
                    });
                  }}
                />
              </div>
            </section>

            {/* 5. RILISAN TERBARU */}
            <section data-animate-section="rilis-terbaru" className="w-full flex flex-col gap-6">
              <div data-animate="header">
                <SectionHeader
                  type="outer"
                  title="Rilisan Terbaru!"
                  actionLabel="Lihat Semua"
                  onActionClick={() => router.push("/store")}
                />
              </div>
              <div data-animate="cards-track">
                <ProductCardRow
                  products={enrichRowItems(RILIS_TERBARU_PRODUCTS)}
                  visibleCount={isUserLoggedIn ? 4 : 5}
                  onAddToCart={(title) => {
                    const item = RILIS_TERBARU_PRODUCTS.find((p) => p.title === title);
                    const price = item?.numericPrice || (item?.price ? parseInt(item.price.replace(/\D/g, '')) || 0 : 0);
                    const origPrice = item?.originalPrice ? parseInt(item.originalPrice.replace(/\D/g, '')) || price : price;
                    handleAddToCart({
                      id: item?.id || 1,
                      title: item?.title || title,
                      imageSrc: item?.imageSrc,
                      price,
                      originalPrice: origPrice,
                      discount: item?.discount,
                    });
                  }}
                />
              </div>
            </section>
          </>
        )}

        {/* ========================================================
            6. PANDUAN BERMAIN: 4 LANGKAH (Mulai Main Dengan 4 Langkah)
           ======================================================== */}
        <section data-animate-section="how-to-play" className="w-full flex flex-col gap-8 py-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full">
            <div data-animate="title-area" className="border-l-gradient-primary pl-8 pb-2 flex flex-col gap-1.5">
              <span className="text-gray-400 text-label-xs sm:text-body-sm  uppercase font-medium">
                MULAI MAIN DENGAN 4 LANGKAH
              </span>
              <h2 className="text-h3 sm:text-h2 font-semibold text-gradient-heading leading-[120%]">
                Bingung Gimana <br /> Cara Mainnya?
              </h2>
            </div>

            <div data-animate="button-area" className="flex items-center gap-4 shrink-0 sm:self-end">
              <span className="text-right text-gray-400 text-body-xs font-normal hidden sm:inline">
                Masih bingung? <br /> Lihat di youtube!
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      d="M5 5.27403C5 3.56703 6.826 2.48203 8.325 3.29703L20.687 10.024C22.253 10.876 22.253 13.124 20.687 13.976L8.325 20.702C6.826 21.518 5 20.432 5 18.726V5.27403Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                onClick={() => window.open("https://youtube.com", "_blank")}
                className="cursor-pointer font-semibold px-5"
              >
                Tonton Video
              </Button>
            </div>
          </div>

          {/* Outer Container Card Wrapping 4 Steps */}
          <div data-animate="outer-card" className="w-full rounded-lg border border-white/10 bg-deep-blue-950/40 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            {/* Background connecting track */}
            <svg data-animate="svg-track"
              className="pointer-events-none absolute inset-0 w-full h-full hidden md:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="stepConnectorGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#2F2F37" />
                  <stop offset="100%" stopColor="#272744" />
                </linearGradient>
              </defs>

              {/* Step 1 to Step 2 connector (Garis dari A ke B) */}
              <path
                d="M 45 29.5 H 55"
                stroke="url(#stepConnectorGradient)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
              {/* Step 2 to Step 3 Stepped Connector with Rounded Corners */}
              <path
                d="M 75 44 L 75 47 Q 75 50 72.5 50 L 27.5 50 Q 25 50 25 53 L 25 56"
                stroke="url(#stepConnectorGradient)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
            </svg>

            {/* 2x2 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 relative z-10 w-full overflow-hidden">
              {HOW_TO_PLAY_STEPS.map((step) => (
                <div
                  key={step.step}
                  data-animate="step-item"
                  className="rounded-xl h-auto min-h-52 bg-deep-blue-900 border border-white/10 p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 relative transition-all duration-200 hover:border-white/20"
                >
                  {/* Top: Icon + Langkah N */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-secondary-default border border-white/10 flex items-center justify-center text-gray-300 shrink-0">
                      <img
                        src={step.icon}
                        alt={step.step}
                        className="w-5 h-5 filter-[brightness(0)_invert(0.85)]"
                      />
                    </div>
                    <span className="text-body-sm font-semibold text-gray-400">
                      {step.step}
                    </span>
                  </div>

                  {/* Middle: Title */}
                  <h3 className="text-h5 font-bold text-gray-50">
                    {step.title}
                  </h3>

                  {/* Bottom: Description */}
                  <p className="text-body-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="pointer-events-none absolute z-10 -bottom-2 inset-x-0 h-36 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/85 to-transparent rounded-b-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            7. LEADERBOARD PREVIEW: Header + 2 Columns Table + Fade Shadow
           ======================================================== */}
        <section data-animate-section="leaderboard" className="w-full flex flex-col items-center gap-12 text-center">
          <div data-animate="header" className="flex justify-center w-full">
            <Header
              pillText="LEADERBOARD"
              pillVariant="plain"
              title="Lihat Siapa Pemilik Koleksi Game Terbesar Saat Ini!"
              subtitle="Ingin Langsung Buka Semua? Beli Premium!"
              actionLabel="Lihat Premium"
              actionVariant="secondary"
              onActionClick={() => router.push("/bundle")}
              className="sm:max-w-5/8"
            />
          </div>
          <div data-animate="divider" className="w-full border-t-gradient-secondary my-2" />

          <div className="w-full relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full text-left">
              {/* MONTHLY (LEADERBOARD BULAN JULI :) */}
              <section data-animate="monthly-column" className="rounded-lg bg-deep-blue-900 border border-gradient-secondary p-6 sm:p-7 flex flex-col">
                <h3 className="text-h6 sm:text-h6 font-semibold text-gray-50 uppercase mb-8">
                  LEADERBOARD BULAN JULI :
                </h3>
                <div className="flex flex-col gap-2">
                  {monthlyRanks.map((user, idx) => (
                    <div key={`monthly-${user.id || idx}-${user.name}`} data-animate="rank-item">
                      <UserRank
                        rank={user.rank}
                        name={user.name}
                        points={user.point}
                        className={getUserRankClass(idx)}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* WEEKLY (LEADERBOARD MINGGU INI:) */}
              <section data-animate="weekly-column" className="rounded-lg bg-deep-blue-900 border border-gradient-secondary p-6 sm:p-7 flex flex-col">
                <h3 className="text-h6 sm:text-h6 font-semibold text-gray-50 uppercase mb-8">
                  LEADERBOARD MINGGU INI:
                </h3>
                <div className="flex flex-col gap-2">
                  {weeklyRanks.map((user, idx) => (
                    <div key={`weekly-${user.id || idx}-${user.name}`} data-animate="rank-item">
                      <UserRank
                        rank={user.rank}
                        name={user.name}
                        points={user.point}
                        className={getUserRankClass(idx)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Bottom Fade Shadow */}
            <div className="pointer-events-none absolute z-20 -bottom-1 sad inset-x-0 h-36 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/85 to-transparent rounded-b-xl" />
          </div>
        </section>

        {/* ========================================================
            8. TESTIMONIAL PELANGGAN: Header + Infinite Moving Carousel
           ======================================================== */}
        <section data-animate-section="testimonials" className="w-full flex flex-col items-center gap-6">
          <div data-animate="header" className="w-full flex flex-col items-center">
            <Header
              pillText="TESTIMONIAL"
              pillVariant="plain"
              title={
                <>
                  Dengarkan Pendapat Gamer Setelah Beli di Gamezygo!
                </>
              }
              className="sm:max-w-5/8"
            >
              {/* "Beri Pendapat" Input Bar */}
              <div data-animate="opinion-bar" className="relative w-full  lg:max-w-1/2 mx-auto">
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
                        const isGuest = !isAuthenticated || useAuthStore.getState().role === "guest";
                        setOpinionInput("");
                        if (isGuest) {
                          router.push("/login");
                        } else {
                          showToast("Terima kasih atas pendapat Anda!");
                          router.push("/review");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (opinionInput.trim()) {
                        const isGuest = !isAuthenticated || useAuthStore.getState().role === "guest";
                        setOpinionInput("");
                        if (isGuest) {
                          router.push("/login");
                        } else {
                          showToast("Terima kasih atas pendapat Anda!");
                          router.push("/review");
                        }
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </Header>
          </div>

          {/* Divider Line */}
          <div data-animate="divider" className="w-full border-t-gradient-secondary my-2" />

          {/* Infinite Moving Testimonial Cards Carousel (matching credentials/[id].tsx) */}
          <div data-animate="carousel" className="relative w-full overflow-hidden pt-2 sm:pt-4 pb-6 sm:pb-8">
            {/* Vignette gradient masks on sides */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-deep-blue-950 to-transparent z-10 hidden sm:block" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-l from-deep-blue-950 to-transparent z-10 hidden sm:block" />

            {/* Moving Track */}
            <div
              data-animate="testimonial-track"
              className="flex gap-6 w-max animate-infinite-carousel [animation-play-state:paused] hover:[animation-play-state:paused]! items-stretch py-2"
            >
              {infiniteTestimonials.map((t, idx) => (
                <div
                  key={`${t.id}-${idx}`}
                  data-animate="testimonial-card"
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

        {/* ========================================================
            9. FAQ (PERTANYAAN UMUM): Left Title + Right Accordion
           ======================================================== */}
        <section data-animate-section="faq" className="w-full flex flex-col lg:grid lg:grid-cols-7 gap-10 lg:gap-16 items-start py-6">
          <div data-animate="left-column" className="flex flex-col w-fit  lg:col-span-3 gap-4 shrink-0 border-l-gradient-primary h-fit pl-6 sm:pl-8 pb-6">
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
                onClick={() => showToast("Menghubungi admin via Telegram...")}
                className="cursor-pointer px-6"
              >
                Hubungi Kami
              </Button>
            </div>
          </div>

          <div data-animate="right-column" className="flex-1 min-w-0 w-full lg:col-span-4">
            <Accordion items={faqItems} defaultOpenId="faq-1" allowMultiple={false} isLanding={true} />
          </div>
        </section>

        {/* ========================================================
            10. BERITA GAMEZYGO: 2x2 Blog Cards Grid
           ======================================================== */}
        <section data-animate-section="blogs" className="w-full flex flex-col gap-6">
          <div data-animate="header">
            <SectionHeader
              type="outer"
              title="Berita Gamezygo"
              actionLabel="Lihat Semua Artikel"
              onActionClick={() => router.push("/blogs")}
            />
          </div>
          <div data-animate="blog-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
            11. KOMUNITAS GAMEZYGO: Header + Community Cards Container
           ======================================================== */}
        <section data-animate-section="community" className="w-full flex flex-col items-center gap-8 text-center">
          {/* Header */}
          <div data-animate="header" className="w-full flex flex-col items-center">
            <Header
              pillText="LEADERBOARD"
              pillVariant="plain"
              title={
                <>
                  Bergabung dengan  komunitas Gamezygo!
                </>
              }
              subtitle="Ingin Mencari Teman Satu Hobi? Gabung Komunitas!"
              actionLabel="Gabung Sekarang"
              actionVariant="secondary"
              onActionClick={() => showToast("Membuka grup komunitas...")}
            />
          </div>

          {/* Divider Line */}
          <div data-animate="divider" className="w-full border-t-gradient-secondary my-2" />

          {/* Outer Card Wrapper */}
          <div data-animate="outer-card" className="w-full rounded-lg  border border-white/10 bg-deep-blue-900 p-6 sm:p-8 flex flex-col gap-6 text-left">
            {/* Wrapper Header Bar */}
            <div data-animate="inner-header" className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary-default border border-white/10 flex items-center justify-center text-gray-200 shrink-0">
                  <svg
                    width="20"
                    height="12"
                    viewBox="0 0 45 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-2.5"
                  >
                    <path
                      d="M0 24L17.7974 0H45L40.8762 4.18018H21.1978L8.46463 20.9009H16.3505L24.8875 12.6126L16.3505 14.7027L20.1849 9.22523H35.0161L22.4277 24H0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M27.492 19.6757L24.0916 24H29.5177L33.4244 19.6757H27.492Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 text-body-md">
                  <span className="font-bold text-gray-100">Gamezygo</span>
                  <span className="text-gray-400 font-normal">/ Komunitas</span>
                </div>
              </div>

              <span className="text-body-sm text-gray-400 font-medium">
                50 Grup
              </span>
            </div>

            {/* 2x2 Grid of Community Cards */}
            <div data-animate="cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {COMMUNITY_GROUPS.map((group) => (
                <ProductCard
                  key={group.id}
                  orientation="horizontal"
                  title={group.title}
                  imageSrc={group.coverImage}
                  genres={[group.platform]}
                  platform=""
                  isBestSeller={false}
                  showPrice={false}
                  buttonText="Bergabung Sekarang"
                  onActionClick={() => {
                    showToast(`Bergabung dengan ${group.title}...`);
                    window.open(group.link, "_blank");
                  }}
                  className="w-full sm:min-w-0"
                />
              ))}
            </div>

            {/* Bottom: Muat Lebih Banyak */}
            <div data-animate="load-more" className="flex justify-center w-full pt-4">
              <button
                type="button"
                className="flex items-center gap-2 text-body-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
                onClick={() => showToast("Memuat grup komunitas lainnya...")}
              >
                <span>Muat Lebih Banyak</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-gray-400 animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </button>
            </div>
          </div>
        </section>


        {/* Notification Toast */}
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