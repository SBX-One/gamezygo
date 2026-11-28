import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  BlogCard,
  Breadcrumbs,
  Button,
  Pill,
  SectionHeader,
  Skeleton,
} from "@/components/ui";
import { StoreLayout } from "@/components/layout";
import {
  BLOGS_DATA,
  PROMO_GAMES,
  getBlogById,
} from "@/features/catalog/blogs.data";
import { useBlogDetail, useBlogs } from "@/hooks/use-blogs";
import { useAuthStore } from "@/stores/use-auth-store";
import { formatDate } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/image-url";
import { parseContentToArticleBlocks } from "@/features/admin/utils/article-content.utils";

function stripHtmlTags(raw?: string | null): string {
  if (!raw) return "";
  return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

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

  // Auth state to differentiate between back (logged in) and back-guest
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  const isLoggedIn = isMounted && Boolean(isAuthenticated && authUser);

  // API Blog Detail Hook
  const { data: blogApiRes, isLoading: isBlogLoading } = useBlogDetail(slug);
  const { data: blogsListRes } = useBlogs();
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
        description: stripHtmlTags(apiBlog.sort_description),
        content: apiBlog.content,
        author: apiBlog.author?.name || "Admin",
        guideTitle: apiBlog.title,
        guideEntries: fallbackBlog.guideEntries,
        intro1: stripHtmlTags(apiBlog.sort_description),
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
    if (blogsListRes?.data && blogsListRes.data.length > 0) {
      return blogsListRes.data.slice(0, 4).map((b) => ({
        id: b.slug || String(b.id),
        title: b.title,
        imageSrc: b.banner_file_url,
        date: formatDate(b.published_at),
        category: b.category?.name || "Gaming",
        description: b.sort_description,
      }));
    }
    return BLOGS_DATA.slice(0, 4);
  }, [blogsListRes]);

  // Quadrupled items for seamless infinite carousel loop
  const carouselGames = React.useMemo(() => {
    return [...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES, ...PROMO_GAMES];
  }, []);


  return (
    <>
      <Head>
        <title>{`${blog.title} - Gamezygo Artikel`}</title>
        <meta name="description" content={blog.description} />
      </Head>

      <StoreLayout
        navbarVariant={isLoggedIn ? "back" : "back-guest"}
        backTitle="Artikel"
        onBackClick={() => router.push("/blogs")}
        hideSidebar={true}
        onCartClick={() => router.push("/cart")}
        onLoginClick={() => router.push("/login")}
        onSignUpClick={() => router.push("/login?tab=signup")}
        contentClassName="flex-1 w-full flex flex-col pt-8 pb-20 p-0 mb-0"
      >
          {/* Upper Section (Constrained to max-w-320 container) */}
          <div className="w-full max-w-320 mx-auto px-4 sm:px-8 xl:px-0 flex flex-col pt-20">
            {isBlogLoading && !apiBlog ? (
              <div className="flex flex-col gap-8">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="w-full aspect-21/9 sm:aspect-3/1 max-h-110 rounded-lg" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 flex flex-col gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-3/4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="lg:col-span-6 flex flex-col gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ) : (
            <>
            {/* A. BREADCRUMB */}
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Artikel", href: "/blogs" },
                  {
                    label: blog.title,
                    isCurrent: true,
                  },
                ]}
                className="text-body-sm text-gray-400 font-normal"
              />
            </div>

            {/* B. HERO BANNER COVER IMAGE */}
            <div className="w-full aspect-21/9 sm:aspect-3/1 max-h-110 rounded-lg sm:rounded-lg overflow-hidden bg-deep-blue-900 shrink-0 relative">
              <Image
                src={blog.bannerSrc || blog.imageSrc || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85"}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
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
            <section className="w-full mx-auto mt-16 sm:mt-24 border-t-gradient-secondary px-xl lg:px-11xl pt-16 sm:pt-24">
              <h2 className="text-h3 sm:text-h2 font-bold text-white mb-10 sm:mb-12">
                {blog.guideTitle || "The Marvel Tokon Roster Guide"}
              </h2>

              {/* Guide / Content entries */}
              <div className="flex flex-col gap-12">
                {blog.content ? (
                  <div className="flex flex-col gap-5 text-body-sm sm:text-body-md text-gray-300 leading-relaxed font-normal">
                    {(() => {
                      const blocks = parseContentToArticleBlocks(blog.content);
                      if (blocks.length === 0) {
                        return (
                          <p className="whitespace-pre-line">
                            {stripHtmlTags(blog.content)}
                          </p>
                        );
                      }
                      return blocks.map((block) => {
                        const cleanText = stripHtmlTags(block.content);
                        const alignClass =
                          block.align === "center"
                            ? "text-center"
                            : block.align === "right"
                            ? "text-right"
                            : "text-left";
                        const styleClass = [
                          block.isBold ? "font-bold" : "",
                          block.isItalic ? "italic" : "",
                          block.isUnderline ? "underline" : "",
                          block.isStrike ? "line-through" : "",
                          alignClass,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        switch (block.type) {
                          case "h1":
                            return (
                              <h1 key={block.id} className={`text-h3 font-bold text-white ${styleClass}`}>
                                {cleanText}
                              </h1>
                            );
                          case "h2":
                            return (
                              <h2 key={block.id} className={`text-h4 font-bold text-white ${styleClass}`}>
                                {cleanText}
                              </h2>
                            );
                          case "h3":
                          case "h4":
                            return (
                              <h3 key={block.id} className={`text-body-lg sm:text-h6 font-semibold text-gray-50 ${styleClass}`}>
                                {cleanText}
                              </h3>
                            );
                          case "bullet-list":
                            return (
                              <div key={block.id} className={`flex items-start gap-2.5 pl-2 ${styleClass}`}>
                                <span className="text-rose-400 mt-0.5">•</span>
                                <span>{cleanText}</span>
                              </div>
                            );
                          case "numbered-list":
                            return (
                              <div key={block.id} className={`pl-2 ${styleClass}`}>
                                {cleanText}
                              </div>
                            );
                          case "quote":
                            return (
                              <blockquote
                                key={block.id}
                                className="border-l-4 border-[#DF3848] pl-4 italic text-gray-300"
                              >
                                {cleanText}
                              </blockquote>
                            );
                          case "code":
                            return (
                              <pre
                                key={block.id}
                                className="p-4 rounded-lg bg-deep-blue-900 border border-white/10 font-mono text-body-xs text-indigo-300 overflow-x-auto"
                              >
                                <code>{block.content}</code>
                              </pre>
                            );
                          case "callout":
                            return (
                              <div
                                key={block.id}
                                className="p-4 rounded-lg bg-deep-blue-900 border border-indigo-500/30 text-gray-200"
                              >
                                {cleanText}
                              </div>
                            );
                          case "divider":
                            return (
                              <hr key={block.id} className="border-t border-white/10 my-2" />
                            );
                          case "image":
                            return block.imageUrl ? (
                              <figure key={block.id} className="my-2 flex flex-col gap-2">
                                <img
                                  src={resolveImageUrl(block.imageUrl, block.imageUrl)}
                                  alt={block.imageCaption || blog.title}
                                  className="w-full rounded-lg border border-white/10 object-cover max-h-[520px]"
                                />
                                {block.imageCaption && (
                                  <figcaption className="text-body-xs text-gray-400 text-center">
                                    {block.imageCaption}
                                  </figcaption>
                                )}
                              </figure>
                            ) : null;
                          case "table":
                            return block.tableData && block.tableData.length > 0 ? (
                              <div key={block.id} className="overflow-x-auto">
                                <table className="w-full border-collapse border border-white/10 text-body-xs">
                                  <tbody>
                                    {block.tableData.map((row, rIdx) => (
                                      <tr key={rIdx} className="border-b border-white/10">
                                        {row.map((cell, cIdx) => (
                                          <td key={cIdx} className="px-3 py-2 border-r border-white/10 last:border-r-0">
                                            {stripHtmlTags(cell)}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : null;
                          default:
                            return cleanText ? (
                              <p key={block.id} className={`whitespace-pre-line ${styleClass}`}>
                                {cleanText}
                              </p>
                            ) : null;
                        }
                      });
                    })()}
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
            </>
            )}
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
                    className="relative w-48 sm:w-56 md:w-60 shrink-0 aspect-2/3 rounded-lg overflow-hidden border border-gradient-secondary transition-all duration-300 group cursor-pointer bg-deep-blue-900 hover:border-white/30 hover:scale-105 hover:z-20 hover:brightness-105"
                  >
                    <Image
                      src={game.imageSrc || game.fallbackSrc || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=900&q=80"}
                      alt={game.title}
                      fill
                      sizes="240px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
