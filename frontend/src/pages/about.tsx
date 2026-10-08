import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Header,
  Button,
  ProductCardRow,
  type ProductCardRowItem,
  SectionHeader,
  TestimonialCard,
  Toast,
} from "@/components/ui";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { PROMO_GAMES } from "@/features/catalog/blogs.data";
import productsData from "@/json/products.json";
import { useReviews } from "@/hooks/use-reviews";

// ==========================================
// SVG Icons
// ==========================================

const FluentPlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="shrink-0"
    {...props}
  >
    <path d="M5 5.27403C5 3.56703 6.826 2.48203 8.325 3.29703L20.687 10.024C22.253 10.876 22.253 13.124 20.687 13.976L8.325 20.702C6.826 21.518 5 20.432 5 18.726V5.27403Z" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
      fill="currentColor"
    />
  </svg>
);

// Feature Icons (Section 2: Why Choose Us)
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7H7.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ==========================================
// Static Data
// ==========================================

const WHY_CHOOSE_US_STATS = [
  { value: "10.000+", label: "Koleksi Game" },
  { value: "4.8", label: "Rating rata-rata" },
  { value: "24/7", label: "Admin Aktif" },
];

const WHY_CHOOSE_US_FEATURES = [
  {
    id: "f-1",
    title: "Transaksi Aman",
    description: "Menggunakan sistem proteksi terbaik untuk kenyamanan Anda.",
    icon: <ShieldCheckIcon />,
  },
  {
    id: "f-2",
    title: "Proses Instan Otomatis",
    description: "Produk dikirim secara otomatis detik itu juga setelah pembayaran.",
    icon: <BoltIcon />,
  },
  {
    id: "f-3",
    title: "Harga Kompetitif",
    description: "Penawaran harga terbaik dengan kualitas premium.",
    icon: <TagIcon />,
  },
  {
    id: "f-4",
    title: "Layanan Bergaransi",
    description: "Dukungan garansi penuh untuk menjamin kepuasan Anda.",
    icon: <AwardIcon />,
  },
];

// Exact copy from index.tsx:L236-L261
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

// Exact copy from index.tsx:L232
const TAWARAN_KHUSUS_PRODUCTS: ProductCardRowItem[] = productsData.tawaranKhusus;

export default function AboutPage() {
  const router = useRouter();

  // Global Stores
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addItem);

  const [opinionInput, setOpinionInput] = React.useState("");
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

  // Quadrupled items for seamless infinite carousel loop (matching blogs/[id].tsx:L168-L170)
  const carouselGames = React.useMemo(() => {
    return [...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES];
  }, []);

  // TanStack Query or fallback for Testimonials (matching index.tsx:L710-L760)
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
          "“Pelayanan admin responsif 24/7 dan selalu bantu kalau ada kendala akun Steam. Game-nya lengkap dan bisa request judul baru juga. Mantap jiwa Gamezygo!”",
        images: [
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=320&h=180&q=80",
        ],
      },
    ];
  }, [reviewsRes]);

  const infiniteTestimonials = React.useMemo(() => {
    return [
      ...testimonialItems,
      ...testimonialItems,
      ...testimonialItems,
      ...testimonialItems,
    ];
  }, [testimonialItems]);

  return (
    <>
      <Head>
        <title>Tentang Gamezygo — Store Game Sharing Terbaik</title>
        <meta
          name="description"
          content="Kenali Gamezygo, platform penyedia game sharing original bergaransi resmi seumur hidup dengan proses instan otomatis dan harga paling kompetitif."
        />
      </Head>

      <StoreLayout
        navbarVariant={isAuthenticated ? "login" : "guest"}
        activeNavId="about"
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
        contentClassName="w-full max-w-360 mx-auto px-4 sm:px-8 lg:px-20 py-10 sm:py-10 flex flex-col gap-16 sm:gap-24 lg:gap-50"
      >
        {/* ========================================================
            1. HERO SECTION: Header + Infinite Game Cards Carousel
           ======================================================== */}
        <section className="w-full flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Header Component matching Store (store/index.tsx:L519-L526) */}
          <Header
            pillText="Promo Musim Panas Telah Datang!"
            title="Store Game Sharing Terbaik Gamezygo!"
            subtitle="Ingin Langsung Buka Semua? Beli Premium!"
            actionLabel="Lihat Premium"
            actionVariant="primary"
            onActionClick={() => router.push("/subscription")}
            className="w-full sm:max-w-4/8"
          />

          {/* Infinite Game Cards Carousel (blogs/[id].tsx:L400-L433) */}
          <div className="relative w-full overflow-hidden pt-8 pb-14 mt-12">
            {/* Left subtle vignette mask */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-deep-blue-950 to-transparent z-10" />

            {/* Bottom Shadow Gradient Overlay */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 sm:h-44 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/80 to-transparent z-10" />

            {/* Infinite Scrolling Track */}
            <div className="flex gap-6 w-max animate-infinite-carousel hover:[animation-play-state:paused] items-center">
              {carouselGames.map((game, idx) => (
                <div
                  key={`${game.id}-${idx}`}
                  onClick={() => router.push("/store")}
                  className="relative w-48 sm:w-56 md:w-60 shrink-0 aspect-2/3 rounded-lg overflow-hidden border border-gradient-secondary transition-all duration-300 group cursor-pointer bg-deep-blue-900 hover:border-white/30 hover:scale-105 hover:z-20 hover:brightness-105"
                >
                  <img
                    src={game.imageSrc}
                    alt={game.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src =
                        game.fallbackSrc ||
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=900&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Shadow overlay inside each card */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            2. SECTION 2: WHY CHOOSE US ("Kenapa Gamezygo?")
           ======================================================== */}
        <section className="w-full flex flex-col gap-12 lg:gap-10">
          {/* Top Row: Header (Left) + Dark Media Card (Right) aligned horizontally */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch w-full">
            {/* Left: Heading, Subtitle & Button */}
            <div className="flex flex-col  gap-10 w-full">
            <div className="border-l-gradient-primary pl-8 pb-6 flex flex-col gap-1.5">
              <span className="text-gray-400 text-label-xs sm:text-body-sm uppercase">
               WHY CHOOSE US
              </span>
              <h2 className="text-h3 sm:text-h2 font-semibold text-gradient-heading leading-[120%]">
                Kenapa Gamezygo?
              </h2>
            </div>

            <div className="flex items-center gap-4 shrink-0 ">
              
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

            {/* Right: Media Card matching exact height of Header */}
            <div className="flex justify-end w-full h-full">
              <div className="w-full h-full min-h-44 sm:min-h-52 lg:min-h-0 max-w-1/2 rounded-2xl bg-deep-blue-900/60 border border-white/5 overflow-hidden relative shadow-2xl flex items-end justify-end group">
                <div className="absolute inset-0 bg-linear-to-tr from-deep-blue-950 via-deep-blue-900/40 to-transparent right-0" />
              </div>
            </div>
          </div>

          {/* Bottom Row: Stats (Left) + 2x2 Feature Items (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-10xl items-start w-full">
            {/* Left: Statistics List */}
            <div className="flex flex-col w-full justify-end h-full">
              {WHY_CHOOSE_US_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-4.5 border-b border-white/10"
                >
                  <span className="text-body-lg font-semibold text-gradient-heading">
                    {stat.value}
                  </span>
                  <span className="text-body-lg text-gray-400 ">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: 2x2 Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
              {WHY_CHOOSE_US_FEATURES.map((feature, idx) => (
                <React.Fragment key={feature.id}>
                  {idx === 2 && (
                    <div className="sm:col-span-2 border-t border-white/10 my-1" />
                  )}
                  <div className="flex flex-col gap-8">
                    <div className="w-11 h-11 rounded-lg bg-deep-blue-800 border border-deep-blue-700 flex items-center justify-center text-deep-blue-200 shrink-0">
                      {feature.icon}
                    </div>
                    <div className="grid gap-4">
                      <h4 className="text-body-md sm:text-h5 font-semibold text-gradient-heading">
                        {feature.title}
                      </h4>
                      <p className="text-body-sm text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. PANDUAN BERMAIN: 4 LANGKAH (Exact copy index.tsx:L1122-L1244)
           ======================================================== */}
        <section className="w-full flex flex-col gap-8 py-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full">
            <div className="border-l-gradient-primary pl-8 pb-2 flex flex-col gap-1.5">
              <span className="text-gray-400 text-label-xs sm:text-body-sm  uppercase font-medium">
                MULAI MAIN DENGAN 4 LANGKAH
              </span>
              <h2 className="text-h3 sm:text-h2 font-semibold text-gradient-heading leading-[120%]">
                Bingung Gimana <br /> Cara Mainnya?
              </h2>
            </div>

            <div className="flex items-center gap-4 shrink-0 sm:self-end">
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
          <div className="w-full rounded-lg border border-white/10 bg-deep-blue-950/40 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            {/* Background connecting track */}
            <svg
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
            4. TAWARAN KHUSUS (Exact copy index.tsx:L1075-L1093)
           ======================================================== */}
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

        {/* ========================================================
            5. TESTIMONIAL (Exact copy index.tsx:L1310-L1380)
           ======================================================== */}
        <section className="w-full flex flex-col items-center gap-6">
          <Header
            as="h2"
            pillText="TESTIMONIAL"
            pillVariant="plain"
            title="Dengarkan Pendapat Gamer Setelah Beli di Gamezygo!"
            className="max-w-5/8"
          >
            {/* "Beri Pendapat" Input Bar */}
            <div className="relative w-full lg:max-w-1/2 mx-auto">
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
                      showToast("Terima kasih atas pendapat Anda!");
                      setOpinionInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (opinionInput.trim()) {
                      showToast("Terima kasih atas pendapat Anda!");
                      setOpinionInput("");
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </Header>

          {/* Divider Line */}
          <div className="w-full border-t-gradient-secondary my-2" />

          {/* Infinite Moving Testimonial Cards Carousel */}
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
      </StoreLayout>

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Toast
            variant="success"
            title="Notifikasi"
            description={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </>
  );
}
