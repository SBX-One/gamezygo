import * as React from "react";
import Head from "next/head";
import {
  Navbar,
  Footer,
  Header,
  Button,
  ProductCard,
  SectionHeader,
  FilterModal,
  EmptyState,
  Toast,
  BannerCarousel,
  type BannerSlide,
} from "@/components/ui";

// Icon for 500 Server Error
const WifiOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    {...props}
  >
    <path
      d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z"
      fill="currentColor"
    />
    <path
      d="M8.464 13.464C9.402 12.526 10.674 12 12 12C13.326 12 14.598 12.526 15.536 13.464M4.929 9.929C6.804 8.054 9.348 7 12 7C14.652 7 17.196 8.054 19.071 9.929M1.393 6.393C4.207 3.58 8.022 2 12 2C15.978 2 19.793 3.58 22.607 6.393M2 2L22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Close 'x' icon for filter tags
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


import productsData from "@/json/products.json";

interface ProductItem {
  id: string;
  steamAppId?: number;
  title: string;
  imageSrc: string;
  bannerSrc?: string;
  genres: string[];
  originalPrice: string;
  price: string;
  numericPrice: number;
  discount: string;
  platform?: string;
  isBestSeller?: boolean;
}

const MINI_FEATURED_GAMES: ProductItem[] = productsData.miniFeatured;
const TAWARAN_KHUSUS_PRODUCTS: ProductItem[] = productsData.tawaranKhusus;
const RILIS_TERBARU_PRODUCTS: ProductItem[] = productsData.rilisTerbaru;
const ALL_STORE_PRODUCTS: ProductItem[] = productsData.semuaProduk;

const PROMO_BANNERS: BannerSlide[] = [
  {
    id: "summer-promo-1",
    title: "Promo Musim Panas",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas - Gamezygo",
    href: "/store?promo=summer",
  },
  {
    id: "summer-promo-2",
    title: "Promo Musim Panas Spesial",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas Spesial - Gamezygo",
    href: "/store?promo=summer-special",
  },
  {
    id: "summer-promo-3",
    title: "Promo Musim Panas Flash Deals",
    imageSrc: "/assets/png/Container.png",
    alt: "Promo Musim Panas Flash Deals - Gamezygo",
    href: "/store?promo=summer-flash",
  },
];

export default function HomePage() {
  // Navigation & Search State
  const [activeNavId, setActiveNavId] = React.useState<string>("home");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);

  // Interaction Filter State (in the dropdown)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedLaunchers, setSelectedLaunchers] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [selectedSort, setSelectedSort] = React.useState<string>("Terbaru");

  // Applied Filter State (actively affecting the store catalog)
  const [appliedGenres, setAppliedGenres] = React.useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  const [appliedLaunchers, setAppliedLaunchers] = React.useState<string[]>([]);
  const [appliedPriceRange, setAppliedPriceRange] = React.useState<[number, number]>([0, 200000]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  // Interaction State Simulator for Screenshots 2 & 3
  const [previewState, setPreviewState] = React.useState<
    "default" | "error-500" | "searched" | "searched-empty" | "filter-applied" | "filter-empty"
  >("default");

  // Cart notification toast
  const [cartToast, setCartToast] = React.useState<string | null>(null);

  // Logged-in Customer User Profile
  const currentUser = {
    name: "Dyven Siauw",
    email: "dyven@gamezygo.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
  };

  const handleAddToCart = (gameTitle: string) => {
    setCartToast(gameTitle);
    setTimeout(() => {
      setCartToast(null);
    }, 3500);
  };

  // Switch to specific preview state
  const setExactState = (
    state: "default" | "error-500" | "searched" | "searched-empty" | "filter-applied" | "filter-empty"
  ) => {
    setPreviewState(state);
    if (state === "searched") {
      setSearchQuery("Grand Thief Auto V");
      setSelectedGenres([]);
      setAppliedGenres([]);
    } else if (state === "searched-empty") {
      setSearchQuery("GameXYZ123YangTidakAda");
      setSelectedGenres([]);
      setAppliedGenres([]);
    } else if (state === "filter-applied") {
      setSearchQuery("");
      const initial = ["Action", "Adventure", "NSFW"];
      setSelectedGenres(initial);
      setAppliedGenres(initial);
    } else if (state === "filter-empty") {
      setSearchQuery("");
      const initial = ["Action", "Adventure", "NSFW"];
      setSelectedGenres(initial);
      setAppliedGenres(initial);
    } else {
      setSearchQuery("");
      setSelectedGenres([]);
      setAppliedGenres([]);
      setAppliedLaunchers([]);
      setAppliedPriceRange([0, 200000]);
      setAppliedSort("Terbaru");
    }
  };

  // Determine active genres based on interactive state or user applied filters
  const activeGenres = React.useMemo(() => {
    if (appliedGenres.length > 0) return appliedGenres;
    if (previewState === "filter-applied" || previewState === "filter-empty") {
      return ["Action", "Adventure", "NSFW"];
    }
    return selectedGenres;
  }, [appliedGenres, previewState, selectedGenres]);

  const handleRemoveGenre = (genreToRemove: string) => {
    const next = activeGenres.filter((g) => g !== genreToRemove);
    setAppliedGenres(next);
    setSelectedGenres(next);
    if (
      next.length === 0 &&
      appliedLaunchers.length === 0 &&
      appliedPriceRange[0] === 0 &&
      appliedPriceRange[1] === 200000
    ) {
      setPreviewState("default");
    }
  };

  const handleClearAllFilters = () => {
    setSelectedGenres([]);
    setAppliedGenres([]);
    setSelectedCategories([]);
    setSelectedLaunchers([]);
    setAppliedLaunchers([]);
    setPriceRange([0, 200000]);
    setAppliedPriceRange([0, 200000]);
    setSelectedSort("Terbaru");
    setAppliedSort("Terbaru");
    setPreviewState("default");
  };

  // Filtered Products Logic
  const searchResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return ALL_STORE_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (query.includes("gta") && p.title.toLowerCase().includes("grand theft auto")) ||
        (query.includes("grand") && p.title.toLowerCase().includes("grand theft auto"))
    );
  }, [searchQuery]);

  const filteredCatalog = React.useMemo(() => {
    if (previewState === "filter-empty") {
      return [];
    }

    let list = [...ALL_STORE_PRODUCTS];

    // 1. Filter by genres
    if (activeGenres.length > 0) {
      list = list.filter((product) =>
        activeGenres.some((g) => product.genres.includes(g))
      );
    }

    // 2. Filter by launcher / platform
    if (appliedLaunchers.length > 0) {
      list = list.filter((product) =>
        appliedLaunchers.includes(product.platform || "Steam")
      );
    }

    // 3. Filter by price range
    if (appliedPriceRange[0] > 0 || appliedPriceRange[1] < 200000) {
      list = list.filter((product) => {
        const price = product.numericPrice ?? 0;
        return price >= appliedPriceRange[0] && price <= appliedPriceRange[1];
      });
    }

    // 4. Sort
    if (appliedSort === "Nama (A - Z)") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [activeGenres, appliedLaunchers, appliedPriceRange, appliedSort, previewState]);

  // Is Search Active?
  const isSearchActive =
    previewState === "searched" ||
    previewState === "searched-empty" ||
    searchQuery.trim().length > 0;

  // Is Filter Active?
  const isFilterActive =
    previewState === "filter-applied" ||
    previewState === "filter-empty" ||
    activeGenres.length > 0 ||
    appliedLaunchers.length > 0 ||
    appliedPriceRange[0] > 0 ||
    appliedPriceRange[1] < 200000;

  return (
    <div className="min-h-screen bg-deep-blue-950 text-gray-50 flex flex-col antialiased selection:bg-rose-600/30 selection:text-gray-50">
      <Head>
        <title>Gamezygo â€” Toko Koleksi Akun Game Original Murah & Instan</title>
        <meta
          name="description"
          content="Beli game PC Steam, Epic Games, dan EA original dengan harga terjangkau, pengiriman instan langsung ke Game Library Anda."
        />
      </Head>

      {/* ========================================================
          1. STICKY NAVBAR (Logged-in Customer View)
         ======================================================== */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-deep-blue-950/90 border-b border-b-gradient-secondary">
        <Navbar
          variant="login"
          activeNavId={activeNavId}
          onNavItemClick={(item) => setActiveNavId(item.id)}
          searchValue={searchQuery}
          searchPlaceholder="Cari di toko"
          onSearchChange={(val) => {
            setSearchQuery(val);
            if (val.trim()) {
              setPreviewState("default");
            }
          }}
          onSearchClear={() => {
            setSearchQuery("");
            setPreviewState("default");
          }}
          onFilterClick={() => setIsFilterModalOpen((prev) => !prev)}
          onCartClick={() => handleAddToCart("Item Cart")}
          user={currentUser}
          className="w-full"
        />
      </header>


      {/* ========================================================
          MAIN CONTENT CONTAINER
          Rule: padding dalam content nya adalah 80 (px-20)
          Rule: untuk hero ada tambahan pt 30 (pt-[30px])
         ======================================================== */}
      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-8 lg:px-20 pb-20   flex flex-col gap-11xl">
        {/* ======================================================
            CASE A: STATE 500 SERVER ERROR (Screenshot 2: Empty)
           ====================================================== */}
        {previewState === "error-500" ? (
          <div className="py-24 flex items-center justify-center">
            <EmptyState
              icon={<WifiOffIcon className="w-8 h-8 text-gray-50" />}
              title="500: Internal Server Error"
              description="The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage."
              backLabel="Kembali"
              searchLabel="Muat"
              onBack={() => setExactState("default")}
              onSearch={() => setExactState("default")}
            />
          </div>
        ) : isSearchActive ? (
          /* ======================================================
              CASE B: SEARCHED STATES (Screenshot 2: Searched / Searched Empty)
             ====================================================== */
          <div className="flex flex-col gap-8 pt-8 mt-30 min-h-screen pb-16">
            <SectionHeader
              type="outer"
              title={`Cari "${searchQuery || 'Grand Thief Auto V'}"`}
              showAction={false}
            />

            {searchResults.length > 0 && previewState !== "searched-empty" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    imageSrc={product.imageSrc}
                    genres={product.genres}
                    originalPrice={product.originalPrice}
                    price={product.price}
                    discount={product.discount}
                    platform={product.platform}
                    onActionClick={() => handleAddToCart(product.title)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16">
                <EmptyState
                  title="Ups!... Hasil tidak ditemukan"
                  description="Coba cari hal lain!"
                  backLabel="Kembali"
                  searchLabel="Search"
                  onBack={() => {
                    setSearchQuery("");
                    setExactState("default");
                  }}
                  onSearch={() => {
                    setSearchQuery("");
                    setExactState("default");
                  }}
                />
              </div>
            )}
          </div>
        ) : isFilterActive ? (
          /* ======================================================
              CASE C: FILTER APPLIED / FILTER EMPTY (Screenshot 3)
             ====================================================== */
          <div className="flex flex-col gap-8 pt-8 min-h-screen pb-16">
            {/* Header with Active Filter Badges */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between pb-6.5 border-b border-b-gradient-secondary gap-4">
              <h3 className="text-h3 font-semibold text-gray-50 tracking-normal">
                Semua Produk
              </h3>

              <div className="flex flex-wrap items-center gap-2.5">
                {activeGenres.map((genre) => (
                  <Button
                    key={genre}
                    type="button"
                    variant="secondary"
                    size="sm"
                    rightIcon={<CrossIcon />}
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant="inactive"
                  size="sm"
                  onClick={handleClearAllFilters}
                >
                  Hapus semua
                </Button>
              </div>
            </div>

            {/* Filtered Grid or Filter Empty State */}
            {filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredCatalog.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    imageSrc={product.imageSrc}
                    genres={product.genres}
                    originalPrice={product.originalPrice}
                    price={product.price}
                    discount={product.discount}
                    platform={product.platform}
                    onActionClick={() => handleAddToCart(product.title)}
                    className="pb-8xl"

                  />
                ))}
              </div>
            ) : (
              <div className="py-16">
                <EmptyState
                  title="Ups!... Hasil tidak ditemukan"
                  description="Coba cari hal lain!"
                  backLabel="Kembali"
                  searchLabel="Search"
                  onBack={() => {
                    setSelectedGenres([]);
                    setExactState("default");
                  }}
                  onSearch={() => {
                    setSelectedGenres([]);
                    setExactState("default");
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          /* ======================================================
              CASE D: DEFAULT HOME PAGE (Screenshot 1)
             ====================================================== */
          <>
            {/* 1. HERO HEADER (Rule: ada tambahan pt 30 -> pt-[30px]) */}
            <Header
              pillText="Promo Musim Panas Telah Datang!"
              title="Rasakan Pengalaman Bermain Dengan Bebas!"
              subtitle="Ingin Langsung Buka Semua? Beli Premium!"
              actionLabel="Lihat Premium"
              actionVariant="primary"
              className="pt-11xl"
            />

            {/* 2. PROMO BANNER & MINI FEATURED CARDS SECTION */}
            <section className="flex flex-col lg:flex-row gap-6 items-stretch">
              {/* Kolom Kiri: 2 Horizontal Product Cards */}
              <div className="flex flex-col  gap-6 shrink-0 w-full lg:w-auto justify-between">
                {MINI_FEATURED_GAMES.map((game) => (
                  <ProductCard
                    key={game.id}
                    orientation="horizontal"
                    title={game.title}
                    imageSrc={game.imageSrc}
                    genres={game.genres}
                    originalPrice={game.originalPrice}
                    price={game.price}
                    discount={game.discount}
                    platform={game.platform}
                    isBestSeller={false}
                    buttonText="Tambah Keranjang"
                    onActionClick={() => handleAddToCart(game.title)}
                    className="w-full "
                  />
                ))}
              </div>

              {/* Kolom Kanan: Large Summer Promo Banner Carousel */}
              <BannerCarousel
                slides={PROMO_BANNERS}
                className="flex-1 min-w-0"
              />
            </section>

            {/* 3. SECTION: TAWARAN KHUSUS! */}
            <section className="flex flex-col gap-10">
              <SectionHeader
                type="outer"
                title="Tawaran Khusus!"
                actionLabel="Lihat Semua"
                onActionClick={() => setExactState("filter-applied")}
              />

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {TAWARAN_KHUSUS_PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    imageSrc={product.imageSrc}
                    genres={product.genres}
                    originalPrice={product.originalPrice}
                    price={product.price}
                    discount={product.discount}
                    platform={product.platform}
                    onActionClick={() => handleAddToCart(product.title)}
                     className="max-lg:pb-8xl"

                  />
                ))}
              </div>
            </section>

            {/* 4. SECTION: RILIS TERBARU! */}
            <section className="flex flex-col gap-10">
              <SectionHeader
                type="outer"
                title="Rilis Terbaru!"
                actionLabel="Lihat Semua"
                onActionClick={() => setExactState("filter-applied")}
              />

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {RILIS_TERBARU_PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    imageSrc={product.imageSrc}
                    genres={product.genres}
                    originalPrice={product.originalPrice}
                    price={product.price}
                    discount={product.discount}
                    platform={product.platform}
                    onActionClick={() => handleAddToCart(product.title)}
                     className="max-lg:pb-8xl"
                  />
                ))}
              </div>
            </section>

            {/* 5. SECTION: SEMUA PRODUK */}
            <section className="flex flex-col gap-10">
              <SectionHeader
                type="outer"
                title="Semua Produk"
                showAction={false}
              />

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {ALL_STORE_PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    imageSrc={product.imageSrc}
                    genres={product.genres}
                    originalPrice={product.originalPrice}
                    price={product.price}
                    discount={product.discount}
                    platform={product.platform}
                    onActionClick={() => handleAddToCart(product.title)}
                    className="pb-8xl"
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ========================================================
          FILTER & SORT DROPDOWN (Screenshot 3: Filter Dropdown)
         ======================================================== */}
      <FilterModal
        isOpen={isFilterModalOpen}
        variant="dropdown"
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategories={selectedCategories}
        onToggleCategory={(category) => {
          setSelectedCategories((prev) =>
            prev.includes(category)
              ? prev.filter((c) => c !== category)
              : [...prev, category]
          );
        }}
        selectedGenres={selectedGenres}
        onToggleGenre={(genre) => {
          setSelectedGenres((prev) =>
            prev.includes(genre)
              ? prev.filter((g) => g !== genre)
              : [...prev, genre]
          );
        }}
        selectedLaunchers={selectedLaunchers}
        onToggleLauncher={(launcher) => {
          setSelectedLaunchers((prev) =>
            prev.includes(launcher)
              ? prev.filter((l) => l !== launcher)
              : [...prev, launcher]
          );
        }}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
        onReset={() => {
          handleClearAllFilters();
          setIsFilterModalOpen(false);
        }}
        onApply={() => {
          setAppliedGenres(selectedGenres);
          setAppliedCategories(selectedCategories);
          setAppliedLaunchers(selectedLaunchers);
          setAppliedPriceRange(priceRange);
          setAppliedSort(selectedSort);
          setIsFilterModalOpen(false);
          const hasFilters =
            selectedGenres.length > 0 ||
            selectedLaunchers.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 200000 ||
            selectedSort !== "Terbaru";
          setPreviewState(hasFilters ? "filter-applied" : "default");
        }}
      />

      {/* ========================================================
          CART ACTION TOAST FEEDBACK
         ======================================================== */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <Toast
            variant="success"
            title="Berhasil Ditambahkan!"
            description={`${cartToast} telah masuk ke keranjang belanja Anda.`}
          />
        </div>
      )}

      {/* ========================================================
          FOOTER (Standard Full Width)
         ======================================================== */}
      <Footer className="mt-auto border-t border-t-gradient-secondary" />
    </div>
  );
}