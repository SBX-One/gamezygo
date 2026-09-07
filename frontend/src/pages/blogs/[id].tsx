import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  BlogCard,
  Breadcrumbs,
  Button,
  Footer,
  Pill,
  SectionHeader,
} from "@/components/ui";
import {
  BLOGS_DATA,
  PROMO_GAMES,
  getBlogById,
} from "@/features/catalog/blogs.data";

// Fluent Back Arrow Icon
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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

// Fluent Search Icon
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M16.102 17.162C14.5177 18.4737 12.4892 19.1248 10.4375 18.9802C8.3858 18.8356 6.46864 17.9063 5.08408 16.3853C3.69952 14.8644 2.95396 12.8686 3.0022 10.8124C3.05045 8.75615 3.88879 6.79751 5.34315 5.34315C6.79751 3.88879 8.75615 3.05045 10.8124 3.0022C12.8686 2.95396 14.8644 3.69952 16.3853 5.08408C17.9063 6.46864 18.8356 8.3858 18.9802 10.4375C19.1248 12.4892 18.4737 14.5177 17.162 16.102L21.78 20.72C21.8537 20.7886 21.9128 20.8714 21.9538 20.9634C21.9947 21.0554 22.0168 21.1547 22.0186 21.2555C22.0203 21.3562 22.0018 21.4562 21.9641 21.5496C21.9264 21.643 21.8702 21.7278 21.799 21.799C21.7278 21.8702 21.643 21.9264 21.5496 21.9641C21.4562 22.0018 21.3562 22.0203 21.2555 22.0186C21.1547 22.0168 21.0554 21.9947 20.9634 21.9538C20.8714 21.9128 20.7886 21.8537 20.72 21.78L16.102 17.162ZM17.5 11C17.5 9.27607 16.8152 7.62277 15.5962 6.40378C14.3772 5.18479 12.7239 4.49997 11 4.49997C9.27607 4.49997 7.62277 5.18479 6.40378 6.40378C5.18479 7.62277 4.49997 9.27607 4.49997 11C4.49997 12.7239 5.18479 14.3772 6.40378 15.5962C7.62277 16.8152 9.27607 17.5 11 17.5C12.7239 17.5 14.3772 16.8152 15.5962 15.5962C16.8152 14.3772 17.5 12.7239 17.5 11Z"
      fill="currentColor"
    />
  </svg>
);

// Fluent Cart Icon
const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M7.5 20.25C8.32843 20.25 9 19.5784 9 18.75C9 17.9216 8.32843 17.25 7.5 17.25C6.67157 17.25 6 17.9216 6 18.75C6 19.5784 6.67157 20.25 7.5 20.25Z"
      fill="currentColor"
    />
    <path
      d="M17.25 20.25C18.0784 20.25 18.75 19.5784 18.75 18.75C18.75 17.9216 18.0784 17.25 17.25 17.25C16.4216 17.25 15.75 17.9216 15.75 18.75C15.75 19.5784 16.4216 20.25 17.25 20.25Z"
      fill="currentColor"
    />
    <path
      d="M4.53 5.25H20.47C20.6976 5.25 20.9135 5.35036 21.06 5.5241C21.2065 5.69784 21.2676 5.92621 21.227 6.15002L19.427 16.05C19.3582 16.4274 19.0305 16.7032 18.647 16.7032H6.353C5.96954 16.7032 5.64177 16.4274 5.573 16.05L3.812 6.368L3.219 3.407C3.17822 3.20335 3.01358 3.0487 2.809 3.023L2.25 2.953C1.83579 2.90122 1.54228 2.52418 1.59406 2.10997C1.64583 1.69576 2.02288 1.40225 2.43708 1.45403L3.085 1.535C3.99307 1.6487 4.72382 2.33519 4.905 3.239L5.268 5.053C5.27188 5.0724 5.2764 5.0917 5.28155 5.1109L5.309 5.25H4.53ZM6.762 15.203H18.238L19.729 7.003H5.271L6.762 15.203Z"
      fill="currentColor"
    />
  </svg>
);

// Fluent Play Icon
const FluentPlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M5 5.27403C5 3.56703 6.826 2.48203 8.325 3.29703L20.687 10.024C22.253 10.876 22.253 13.124 20.687 13.976L8.325 20.702C6.826 21.518 5 20.432 5 18.726V5.27403Z"
      fill="currentColor"
    />
  </svg>
);

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Resolve current blog detail or fallback gracefully to blog-2 (Marvel Tokon)
  const blog = React.useMemo(() => getBlogById(id), [id]);

  // Related 4 blogs for "Berita Gamezygo" section (matching Image 1: blog-1, blog-2, blog-3, blog-4)
  const relatedBlogs = React.useMemo(() => {
    return BLOGS_DATA.slice(0, 4);
  }, []);

  // Quadrupled items for seamless infinite carousel loop
  const carouselGames = React.useMemo(() => {
    return [...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES];
  }, []);

  const currentUser = {
    name: "Cihuy6767",
    email: "cihuy@gmail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
  };

  const [headerSearch, setHeaderSearch] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/blogs?q=${encodeURIComponent(headerSearch)}`);
    }
  };

  return (
    <>
      <Head>
        <title>{`${blog.title} - Gamezygo Artikel`}</title>
        <meta name="description" content={blog.description} />
      </Head>

      <div className="min-h-screen bg-deep-blue-950 text-gray-50 flex flex-col justify-between select-none overflow-x-hidden">
        {/* ========================================================
            1. TOP NAVBAR (Back Navigation, Search, Cart, Profile)
           ======================================================== */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-deep-blue-950/90 border-b border-b-gradient-secondary">
          <div className="w-full max-w-320 mx-auto px-4 sm:px-8 xl:px-0 h-20 flex items-center justify-between">
            {/* Left: Back Button + "Artikel" Label */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                onClick={() => router.push("/blogs")}
                aria-label="Kembali ke Daftar Artikel"
              >
                <ArrowLeftIcon className="w-4 h-4 text-deep-blue-100" />
              </Button>
              <h1 className="text-body-lg font-semibold text-gray-50 tracking-normal">
                Artikel
              </h1>
            </div>

            {/* Right: Search Input Field + Cart + User Avatar */}
            <div className="flex items-center gap-3">
              <form
                onSubmit={handleSearchSubmit}
                className="relative hidden md:flex items-center bg-deep-blue-950 border border-white/10 rounded-lg px-3.5 py-2.5 h-10 w-64 md:w-80 gap-2.5 focus-within:border-deep-blue-100/40 transition-colors"
              >
                <SearchIcon className="w-4 h-4 text-deep-blue-100 shrink-0" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Cari di toko"
                  className="w-full bg-transparent text-label-sm text-gray-50 placeholder:text-gray-400 outline-none tracking-normal"
                />
              </form>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                onClick={() => {}}
                aria-label="Keranjang Belanja"
              >
                <CartIcon className="w-4 h-4 text-deep-blue-100" />
              </Button>

              <div className="w-8 h-8 rounded-full bg-deep-blue-700/80 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================
            2. MAIN CONTENT
           ======================================================== */}
        <main className="flex-1 w-full flex flex-col pt-8 pb-20">
          {/* Upper Section (Constrained to max-w-320 container) */}
          <div className="w-full max-w-320 mx-auto px-4 sm:px-8 xl:px-0 flex flex-col">
            {/* A. BREADCRUMB */}
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Toko", href: "/blogs" },
                  {
                    label: `Aksesoris Toko ${blog.title}`,
                    isCurrent: true,
                  },
                ]}
                className="text-body-sm text-gray-400 font-normal"
              />
            </div>

            {/* B. HERO BANNER COVER IMAGE */}
            <div className="w-full aspect-21/9 sm:aspect-3/1 max-h-110 rounded-xl sm:rounded-lg overflow-hidden  shadow-2xl bg-deep-blue-900 shrink-0 relative">
              <img
                src={blog.bannerSrc || blog.imageSrc}
                alt={blog.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src =
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-deep-blue-950/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* C. TITLE & METADATA + INTRO PARAGRAPHS (2 Columns) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-10 sm:mt-12 border-l-4 border-pale-red-500 pl-4 sm:pl-6 my-2">
              {/* Left Column (Pill, Heading with Red Border, Date) */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="w-fit">
                  <Pill variant="secondary" size="sm">
                    {blog.category}
                  </Pill>
                </div>

                <div className="">
                  <h1 className="text-h3 sm:text-h2 font-bold text-white tracking-tight leading-snug">
                    {blog.title}
                  </h1>
                </div>

                <span className="text-body-xs sm:text-body-sm text-gray-400 font-medium uppercase tracking-wider ">
                  {blog.fullDate || blog.date}
                </span>
              </div>

              {/* Right Column (2 Overview Paragraphs) */}
              <div className="lg:col-span-6 flex flex-col gap-5 text-gray-300 text-body-sm sm:text-body-md leading-relaxed font-normal">
                {blog.intro1 && <p>{blog.intro1}</p>}
                {blog.intro2 && <p>{blog.intro2}</p>}
              </div>
            </section>

            {/* D. ROSTER GUIDE CONTENT SECTION
                Per Image 3: 200px margin on left & right within 1280px container = max-w-220 mx-auto
            */}
            <section className="w-full mx-auto mt-16 sm:mt-24 border-t-gradient-secondary px-8xl sm:px-11xl pt-16 sm:pt-24">
              <h2 className="text-h3 sm:text-h2 font-bold text-white mb-10 sm:mb-12">
                {blog.guideTitle || "The Marvel Tokon Roster Guide"}
              </h2>

              {/* Per Image 4: Exactly 48px (gap-12) between each numbered guide entry */}
              <div className="flex flex-col gap-12">
                {blog.guideEntries && blog.guideEntries.length > 0 ? (
                  blog.guideEntries.map((entry, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <h3 className="text-body-lg sm:text-h6 font-semibold text-gray-50">
                        {entry.name}
                      </h3>

                      {entry.keyMove && (
                        <span className="text-body-sm text-gray-400 font-medium">
                          {entry.keyMove}
                        </span>
                      )}

                      <div className="flex flex-col gap-4 mt-1">
                        {entry.paragraphs.map((p, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-body-sm sm:text-body-md text-gray-300 leading-relaxed font-normal"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-body-sm text-gray-400 leading-relaxed">
                    {blog.description}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Per Image 2: Exact 200px gap before Promo Section */}
          <div className="h-24 sm:h-36 lg:h-11xl" aria-hidden="true" />

          {/* E. PROMO SECTION - 100% Full Width of Screen (Emerges directly from right screen edge) */}
          <section className="w-full flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Promo Header Text (Centered, unconstrained width) */}
            <div className="flex flex-col items-center gap-8 w-full px-4">
              <Pill variant="secondary" size="md">
                Promo Musim Panas Telah Datang!
              </Pill>

              <h2 className="text-h2 sm:text-h1 font-semibold text-gradient-heading ">
                Beli Sekali, Main Semua di <br />Gamezygo!
              </h2>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-start  text-body-xs flex-col text-gray-400">
                  <p>Ingin Langsung Buka</p>
                  <p>Semua? Beli Premium!</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => router.push("/bundle")}
                  size="sm"
                >
                  <FluentPlayIcon className="w-4 h-4 text-white" />
                  <span>Lihat Premium</span>
                </Button>
              </div>
            </div>

            {/* Infinite Game Cards Carousel - Full width from right edge with bottom shadow */}
            <div className="relative w-full overflow-hidden pt-8 pb-14 mt-12">
              {/* Left subtle vignette mask */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-deep-blue-950 to-transparent z-10" />

              {/* Bottom Shadow Gradient Overlay - Matching Gambar 2 */}
              <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-deep-blue-950 via-deep-blue-950/80 to-transparent z-10" />

              {/* Infinite Scrolling Track */}
              <div className="flex gap-6 w-max animate-infinite-carousel hover:[animation-play-state:paused] items-center">
                {carouselGames.map((game, idx) => (
                  <div
                    key={`${game.id}-${idx}`}
                    onClick={() => router.push("/bundle")}
                    className="relative w-48 sm:w-56 md:w-60 shrink-0 aspect-2/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group cursor-pointer bg-deep-blue-900 hover:border-white/30 hover:scale-105 hover:z-20 hover:brightness-105"
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
                    {/* Shadow overlay inside each card matching Gambar 2 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Per Image 2: Exact 200px gap before Berita Gamezygo Section */}
          <div className="h-24 sm:h-36 lg:h-11xl" aria-hidden="true" />

          {/* Lower Section (Constrained to max-w-320 container) */}
          <div className="w-full max-w-320 mx-auto px-4 sm:px-8 xl:px-0 flex flex-col">
            {/* F. BERITA GAMEZYGO (Related Blogs Section) */}
            <section className="w-full flex flex-col">
              <SectionHeader
                type="outer"
                title="Berita Gamezygo"
                actionLabel="Lihat Semua"
                onActionClick={() => router.push("/blogs")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {relatedBlogs.map((b) => (
                  <BlogCard
                    key={b.id}
                    href={`/blogs/${b.id}`}
                    imageSrc={b.imageSrc}
                    date={b.date}
                    title={b.title}
                    category={b.category}
                    description={b.description}
                    className="shadow-none h-full"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Per Image 2: Exact 200px gap before Footer */}
          <div className="h-24 sm:h-36 lg:h-11xl" aria-hidden="true" />
        </main>

        {/* ========================================================
            3. FOOTER
           ======================================================== */}
        <Footer />
      </div>
    </>
  );
}
