import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  BlogCard,
  Breadcrumbs,
  Button,
  Pill,
  SectionHeader,
} from "@/components/ui";
import { StoreLayout } from "@/components/layout";
import {
  BLOGS_DATA,
  PROMO_GAMES,
  getBlogById,
} from "@/features/catalog/blogs.data";
import { useBlogDetail } from "@/hooks/use-blogs";
import { formatDate } from "@/utils/formatters";

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

interface ResolvedBlogDetail {
  id: string;
  title: string;
  slug?: string;
  category: string;
  date: string;
  fullDate?: string;
  bannerSrc?: string;
  imageSrc: string;
  description: string;
  content?: string;
  author?: string;
  guideTitle?: string;
  guideEntries?: Array<{
    name: string;
    keyMove?: string;
    paragraphs: string[];
  }>;
  intro1?: string;
  intro2?: string;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const slug = typeof id === "string" ? id : "";

  // API Blog Detail Hook
  const { data: blogApiRes } = useBlogDetail(slug);
  const apiBlog = blogApiRes?.data;

  // Resolve current blog detail with API priority or fallback gracefully
  const fallbackBlog = React.useMemo(() => getBlogById(id), [id]);

  const blog: ResolvedBlogDetail = React.useMemo(() => {
    if (apiBlog) {
      return {
        id: String(apiBlog.id),
        title: apiBlog.title,
        slug: apiBlog.slug,
        category: apiBlog.category?.name || "Gaming",
        date: formatDate(apiBlog.published_at),
        fullDate: formatDate(apiBlog.published_at),
        bannerSrc: apiBlog.banner_file_url,
        imageSrc: apiBlog.banner_file_url,
        description: apiBlog.sort_description,
        content: apiBlog.content,
        author: apiBlog.author?.name || "Admin",
        guideTitle: apiBlog.title,
        guideEntries: fallbackBlog.guideEntries,
        intro1: apiBlog.sort_description,
        intro2: undefined,
      };
    }
    return {
      ...fallbackBlog,
      content: undefined,
    };
  }, [apiBlog, fallbackBlog]);

  // Related 4 blogs for "Berita Gamezygo" section (matching Image 1: blog-1, blog-2, blog-3, blog-4)
  const relatedBlogs = React.useMemo(() => {
    return BLOGS_DATA.slice(0, 4);
  }, []);

  // Quadrupled items for seamless infinite carousel loop
  const carouselGames = React.useMemo(() => {
    return [...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES];
  }, []);

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

      <StoreLayout
        navbarVariant="back"
        backTitle="Artikel"
        onBackClick={() => router.push("/blogs")}
        hideSidebar={true}
        searchValue={headerSearch}
        searchPlaceholder="Cari game"
        onSearchChange={(val) => setHeaderSearch(val)}
        onSearchSubmit={() => {
          if (headerSearch.trim()) {
            router.push(`/blogs?q=${encodeURIComponent(headerSearch)}`);
          }
        }}
        onCartClick={() => router.push("/cart")}
        contentClassName="flex-1 w-full flex flex-col pt-8 pb-20 p-0 mb-0"
      >
          {/* Upper Section (Constrained to max-w-320 container) */}
          <div className="w-full max-w-320 mx-auto px-4 sm:px-8 xl:px-0 flex flex-col pt-20">
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
            <div className="w-full aspect-21/9 sm:aspect-3/1 max-h-110 rounded-lg sm:rounded-lg overflow-hidden   bg-deep-blue-900 shrink-0 relative">
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
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-10 sm:mt-12 border-l-gradient-primary pb-6 pl-4 sm:pl-6 my-2">
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

                <span className="text-body-xs sm:text-body-sm text-gray-400 font-medium uppercase  ">
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

              {/* Guide / Content entries */}
              <div className="flex flex-col gap-12">
                {blog.content ? (
                  <div className="prose prose-invert max-w-none text-body-sm sm:text-body-md text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                    {blog.content}
                  </div>
                ) : blog.guideEntries && blog.guideEntries.length > 0 ? (
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
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-deep-blue-950 to-transparent z-10" />

              {/* Bottom Shadow Gradient Overlay - Matching Gambar 2 */}
              <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 sm:h-44 bg-linear-to-t from-deep-blue-950 via-deep-blue-950/80 to-transparent z-10" />

              {/* Infinite Scrolling Track */}
              <div className="flex gap-6 w-max animate-infinite-carousel hover:[animation-play-state:paused] items-center">
                {carouselGames.map((game, idx) => (
                  <div
                    key={`${game.id}-${idx}`}
                    onClick={() => router.push("/bundle")}
                    className="relative w-48 sm:w-56 md:w-60 shrink-0 aspect-2/3 rounded-lg overflow-hidden border border-gradient-secondary  transition-all duration-300 group cursor-pointer bg-deep-blue-900 hover:border-white/30 hover:scale-105 hover:z-20 hover:brightness-105"
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
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
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

              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-5 gap-y-12 mt-8 ">
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
      </StoreLayout>
    </>
  );
}
