import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Header,
  Button,
  PricingCard,
  GameListItem,
  Accordion,
  Toast,
} from "@/components/ui";
import { useAuthStore } from "@/stores/use-auth-store";

// ==========================================
// Icons
// ==========================================

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

// ==========================================
// Static Mock Data matching Reference
// ==========================================

const SUBSCRIPTION_PLANS = [
  {
    id: "paket-1",
    type: "secondary" as const,
    title: "Paket 1",
    price: "IDR 150,000",
    period: "/ Month",
    features: [
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
    ],
  },
  {
    id: "paket-2",
    type: "primary" as const,
    title: "Paket 2",
    price: "IDR 150,000",
    period: "/ Month",
    features: [
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
    ],
  },
  {
    id: "paket-3",
    type: "secondary" as const,
    title: "Paket 3",
    price: "IDR 150,000",
    period: "/ Month",
    features: [
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
      "Mainkan Game Lebih Banyak",
    ],
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

export default function SubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Search query & layout nav states
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Toast notification state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubscribe = (planTitle: string) => {
    showToast(`Memproses langganan untuk ${planTitle}...`);
  };

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
        navbarVariant={isAuthenticated ? "login" : "guest"}
        activeNavId="paket"
        hideSidebar={true}
        user={
          user
            ? {
                name: user.name || "Customer Gamezygo",
                avatarUrl: user.avatarUrl,
              }
            : undefined
        }
        searchValue={searchQuery}
        searchPlaceholder="Cari di toko"
        onSearchChange={(val) => setSearchQuery(val)}
        onSearchClear={() => setSearchQuery("")}
        onSearchSubmit={() => {
          if (searchQuery.trim()) {
            router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
          }
        }}
        contentClassName="w-full mx-auto px-4 sm:px-8 lg:px-20 py-10 sm:py-16 lg:py-20 flex flex-col gap-16 sm:gap-24 lg:gap-50"
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
        <section className="w-full  mx-auto">
          <div className="grid grid-cols-1  md:grid-cols-3 gap-5 items-stretch lg:px-10xl">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                type={plan.type}
                title={plan.title}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                actionText="Subscribe"
                onActionClick={() => handleSubscribe(plan.title)}
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
              Total : 50.000 Games
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
                onClick={() => showToast("Menghubungi admin via Telegram...")}
                className="cursor-pointer px-6"
              >
                Hubungi Kami
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full lg:col-span-4">
            <Accordion
              items={FAQ_ITEMS}
              defaultOpenId="faq-1"
              allowMultiple={false}
              isLanding={true}
            />
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
