import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  BlogCard,
  Button,
  EmptyState,
  FilterModal,
  Pagination,
  Pill,
} from "@/components/ui";
import { StoreLayout } from "@/components/layout";

// Icon for 500 Server Error
const WifiOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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

const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const ReloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12C4 7.58172 7.58172 4 12 4C15.5333 4 18.5285 6.29052 19.5702 9.5M20 12C20 16.4183 16.4183 20 12 20C8.4667 20 5.47147 17.7095 4.42975 14.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 4V10H14M4 20V14H10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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

import {
  BLOGS_DATA,
  CATEGORIES,
  STATUS_OPTIONS,
  PLATFORM_OPTIONS,
  GAME_OPTIONS,
  SORT_OPTIONS,
} from "@/features/catalog/blogs.data";
import { useBlogs } from "@/hooks/use-blogs";
import { formatDate } from "@/utils/formatters";

export default function BlogsPage() {
  const router = useRouter();

  // API Blogs Hook
  const { data: blogsApiRes } = useBlogs();

  // Preview state derived from query or local override
  const [previewStateOverride, setPreviewStateOverride] = React.useState<
    "default" | "error-500" | "filter-empty" | null
  >(null);

  const queryState =
    router.query.state === "error-500"
      ? "error-500"
      : router.query.state === "filter-empty"
      ? "filter-empty"
      : router.query.state === "default"
      ? "default"
      : null;

  const previewState = previewStateOverride ?? queryState ?? "default";
  const setPreviewState = (state: "default" | "error-500" | "filter-empty") => {
    setPreviewStateOverride(state);
  };

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isNavbarFilterOpen, setIsNavbarFilterOpen] = React.useState(false);
  const [isContentFilterOpen, setIsContentFilterOpen] = React.useState(false);

  // Staged Filter States (edited in modal before clicking Apply)
  const [modalCategories, setModalCategories] = React.useState<string[]>([]);
  const [modalStatus, setModalStatus] = React.useState<string[]>([]);
  const [modalPlatforms, setModalPlatforms] = React.useState<string[]>([]);
  const [modalGames, setModalGames] = React.useState<string[]>([]);
  const [modalSort, setModalSort] = React.useState<string>("Terbaru");

  // Applied Filter States (active filters applied to the blog list, matching bundle concept)
  const [appliedCategories, setAppliedCategories] = React.useState<string[]>([]);
  const [appliedStatus, setAppliedStatus] = React.useState<string[]>([]);
  const [appliedPlatforms, setAppliedPlatforms] = React.useState<string[]>([]);
  const [appliedGames, setAppliedGames] = React.useState<string[]>([]);
  const [appliedSort, setAppliedSort] = React.useState<string>("Terbaru");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeNavId, setActiveNavId] = React.useState("artikel");

  const isFilterActive =
    appliedCategories.length > 0 ||
    appliedStatus.length > 0 ||
    appliedPlatforms.length > 0 ||
    appliedGames.length > 0 ||
    appliedSort !== "Terbaru";

  const handleClearAllFilters = () => {
    setAppliedCategories([]);
    setAppliedStatus([]);
    setAppliedPlatforms([]);
    setAppliedGames([]);
    setAppliedSort("Terbaru");
    setModalCategories([]);
    setModalStatus([]);
    setModalPlatforms([]);
    setModalGames([]);
    setModalSort("Terbaru");
  };

  const handleOpenNavbarFilter = () => {
    setModalCategories(appliedCategories);
    setModalStatus(appliedStatus);
    setModalPlatforms(appliedPlatforms);
    setModalGames(appliedGames);
    setModalSort(appliedSort);
    setIsContentFilterOpen(false);
    setIsNavbarFilterOpen((prev) => !prev);
  };

  const handleOpenContentFilter = () => {
    setModalCategories(appliedCategories);
    setModalStatus(appliedStatus);
    setModalPlatforms(appliedPlatforms);
    setModalGames(appliedGames);
    setModalSort(appliedSort);
    setIsNavbarFilterOpen(false);
    setIsContentFilterOpen((prev) => !prev);
  };

  // Filter logic (applies searchQuery and applied filter states)
  const filteredBlogs = React.useMemo(() => {
    if (previewState === "filter-empty") return [];

    if (blogsApiRes?.data && blogsApiRes.data.length > 0) {
      let apiList = blogsApiRes.data.map((b) => ({
        id: String(b.id),
        title: b.title,
        slug: b.slug,
        imageSrc: b.banner_file_url,
        description: b.sort_description,
        category: b.category?.name || "Gaming",
        date: formatDate(b.published_at),
        fullDate: formatDate(b.published_at),
        status: b.status,
      }));

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        apiList = apiList.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q)
        );
      }

      if (appliedCategories.length > 0) {
        apiList = apiList.filter((b) => appliedCategories.includes(b.category));
      }

      return apiList;
    }

    let result = [...BLOGS_DATA];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    // Applied Categories filter
    if (appliedCategories.length > 0) {
      result = result.filter((b) => appliedCategories.includes(b.category));
    }

    // Applied Status filter
    if (appliedStatus.length > 0) {
      result = result.filter(
        (b) => b.status && appliedStatus.includes(b.status)
      );
    }

    // Applied Platform filter
    if (appliedPlatforms.length > 0) {
      result = result.filter(
        (b) => b.platform && appliedPlatforms.includes(b.platform)
      );
    }

    // Applied Game filter
    if (appliedGames.length > 0) {
      result = result.filter((b) => b.game && appliedGames.includes(b.game));
    }

    // Sort
    if (appliedSort === "Nama (A - Z)") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [
    searchQuery,
    appliedCategories,
    appliedStatus,
    appliedPlatforms,
    appliedGames,
    appliedSort,
    previewState,
    blogsApiRes,
  ]);

  const hasEmptyResults = filteredBlogs.length === 0;

  return (
    <>
      <Head>
        <title>Cerita Terkini Dari Gamezygo! - Artikel & Blog</title>
        <meta
          name="description"
          content="Baca berita terbaru, panduan bermain, tutorial, serta review & rekomendasi game terkini di Gamezygo!"
        />
      </Head>

      <StoreLayout
        navbarVariant="login"
        hideSidebar={true}
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
        onFilterClick={handleOpenNavbarFilter}
        contentClassName="w-full  mx-auto px-4 sm:px-8 lg:px-20 pt-12 pb-20 flex flex-col"
      >
        {/* ========================================================
            NAVBAR FILTER & SORT DROPDOWN (placement="navbar", z-50)
           ======================================================== */}
        <FilterModal
          isOpen={isNavbarFilterOpen}
          variant="dropdown"
          placement="navbar"
          onClose={() => setIsNavbarFilterOpen(false)}
          title="Filter & Sort"
          categories={CATEGORIES}
          selectedCategories={modalCategories}
          onToggleCategory={(cat) => {
            setModalCategories((prev) =>
              prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
            );
          }}
          statusOptions={STATUS_OPTIONS}
          selectedStatus={modalStatus}
          onToggleStatus={(st) => {
            setModalStatus((prev) =>
              prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
            );
          }}
          platformOptions={PLATFORM_OPTIONS}
          selectedPlatforms={modalPlatforms}
          onTogglePlatform={(pl) => {
            setModalPlatforms((prev) =>
              prev.includes(pl) ? prev.filter((p) => p !== pl) : [...prev, pl]
            );
          }}
          gameOptions={GAME_OPTIONS}
          selectedGames={modalGames}
          onToggleGame={(gm) => {
            setModalGames((prev) =>
              prev.includes(gm) ? prev.filter((g) => g !== gm) : [...prev, gm]
            );
          }}
          sortOptions={SORT_OPTIONS}
          selectedSort={modalSort}
          onSelectSort={setModalSort}
          showPriceRange={false}
          onReset={() => {
            handleClearAllFilters();
            setIsNavbarFilterOpen(false);
          }}
          onApply={() => {
            setAppliedCategories(modalCategories);
            setAppliedStatus(modalStatus);
            setAppliedPlatforms(modalPlatforms);
            setAppliedGames(modalGames);
            setAppliedSort(modalSort);
            setIsNavbarFilterOpen(false);
          }}
        />
          {/* ======================================================
              CASE A: 500 SERVER ERROR
             ====================================================== */}
          {previewState === "error-500" ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center select-none px-4 py-16 my-auto">
              <div className="w-14 h-14 rounded-lg bg-white/5 border border-gradient-secondary flex items-center justify-center text-white mb-6">
                <WifiOffIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-h4 sm:text-h3 font-bold text-white mb-2">
                500: Internal Server Error
              </h2>
              <p className="text-gray-400 text-body-sm mx-auto mb-8 font-normal leading-relaxed">
                This page you&apos;re looking for doesn&apos;t exist or has been
                moved. Please check the URL or return to the homepage.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
                  onClick={() => setPreviewState("default")}
                >
                  Kembali
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<ReloadIcon className="w-4 h-4" />}
                  onClick={() => setPreviewState("default")}
                >
                  Reload
                </Button>
              </div>
            </div>
          ) : (
            /* ======================================================
                CASE B: BLOGS LISTING (Normal & Filter-Empty)
               ====================================================== */
            <div className="flex flex-col w-full">
              {/* HERO SECTION */}
              <section className="flex flex-col items-center text-center pt-12   py-10xl">
                {/* State Switcher for Dev/Testing */}
                <div className="flex items-center gap-2 mb-8">
                  <Pill variant="secondary">
                    Promo Musim Panas Telah Datang!
                  </Pill>
                </div>

                {/* Big Title */}
                <h1 className="text-h3 sm:text-h2 lg:text-h1 font-semibold text-gradient-heading w-fit ">
                  Cerita Terkini Dari
                  <br />
                  Gamezygo!
                </h1>
              </section>

              {/* FILTER & SEARCH BAR WITH BORDER-B-GRADIENT-SECONDARY */}
              <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-b-gradient-secondary pb-6 mb-12">
                {/* Left: Category Buttons or Applied Filter Badges (matching bundle.tsx concept) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-body-sm font-medium text-gray-400 mr-1">
                    Tampilkan:
                  </span>

                  {isFilterActive ? (
                    <>
                      {/* Active Categories */}
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
                          className="cursor-pointer text-label-xs"
                        >
                          {cat}
                        </Button>
                      ))}

                      {/* Active Status */}
                      {appliedStatus.map((st) => (
                        <Button
                          key={st}
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() =>
                            setAppliedStatus((prev) =>
                              prev.filter((s) => s !== st)
                            )
                          }
                          className="cursor-pointer text-label-xs"
                        >
                          {st}
                        </Button>
                      ))}

                      {/* Active Platforms */}
                      {appliedPlatforms.map((pl) => (
                        <Button
                          key={pl}
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() =>
                            setAppliedPlatforms((prev) =>
                              prev.filter((p) => p !== pl)
                            )
                          }
                          className="cursor-pointer text-label-xs"
                        >
                          {pl}
                        </Button>
                      ))}

                      {/* Active Games */}
                      {appliedGames.map((gm) => (
                        <Button
                          key={gm}
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() =>
                            setAppliedGames((prev) =>
                              prev.filter((g) => g !== gm)
                            )
                          }
                          className="cursor-pointer text-label-xs"
                        >
                          {gm}
                        </Button>
                      ))}

                      {/* Active Sort (if not default) */}
                      {appliedSort !== "Terbaru" && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          rightIcon={<CrossIcon />}
                          onClick={() => setAppliedSort("Terbaru")}
                          className="cursor-pointer text-label-xs"
                        >
                          Sort: {appliedSort}
                        </Button>
                      )}

                      {/* Clear All Button */}
                      <Button
                        type="button"
                        variant="inactive"
                        size="sm"
                        onClick={handleClearAllFilters}
                        className="cursor-pointer text-gray-400 hover:text-gray-50 text-label-xs"
                      >
                        Hapus semua
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Default state: 'Semua' button + quick Category tabs */}
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleClearAllFilters}
                        className="text-label-xs"
                      >
                        Semua
                      </Button>
                      {CATEGORIES.map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAppliedCategories([cat]);
                            setModalCategories([cat]);
                            setPreviewState("default");
                          }}
                          className="text-label-xs"
                        >
                          {cat}
                        </Button>
                      ))}
                    </>
                  )}
                </div>

                {/* Right: Search Input + Floating Filter Dropdown (matching bundle.tsx) */}
                <div className="relative flex items-center gap-3 shrink-0 self-end sm:self-auto w-full md:w-auto">
                  <div className="relative flex items-center bg-deep-blue-950 border border-gradient-secondary rounded-lg px-3.5 py-2.5 h-10 w-full md:w-72 gap-2.5 focus-within:border-deep-blue-100/40 transition-colors">
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

                  {/* Filter Icon Button */}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={handleOpenContentFilter}
                    aria-label="Buka Filter & Sort"
                    title="Filter & Sort"
                  >
                    <FilterIcon className="w-4 h-4 text-deep-blue-100" />
                  </Button>

                  {/* Floating FilterModal Dropdown (Positioned relative to trigger container) */}
                  <FilterModal
                    isOpen={isContentFilterOpen}
                    variant="dropdown"
                    placement="content"
                    onClose={() => setIsContentFilterOpen(false)}
                    className="sm:top-12 sm:right-0 lg:right-0"
                    title="Filter & Sort"
                    categories={CATEGORIES}
                    selectedCategories={modalCategories}
                    onToggleCategory={(cat) => {
                      setModalCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      );
                    }}
                    statusOptions={STATUS_OPTIONS}
                    selectedStatus={modalStatus}
                    onToggleStatus={(st) => {
                      setModalStatus((prev) =>
                        prev.includes(st)
                          ? prev.filter((s) => s !== st)
                          : [...prev, st]
                      );
                    }}
                    platformOptions={PLATFORM_OPTIONS}
                    selectedPlatforms={modalPlatforms}
                    onTogglePlatform={(pl) => {
                      setModalPlatforms((prev) =>
                        prev.includes(pl)
                          ? prev.filter((p) => p !== pl)
                          : [...prev, pl]
                      );
                    }}
                    gameOptions={GAME_OPTIONS}
                    selectedGames={modalGames}
                    onToggleGame={(gm) => {
                      setModalGames((prev) =>
                        prev.includes(gm)
                          ? prev.filter((g) => g !== gm)
                          : [...prev, gm]
                      );
                    }}
                    sortOptions={SORT_OPTIONS}
                    selectedSort={modalSort}
                    onSelectSort={setModalSort}
                    showPriceRange={false}
                    onReset={() => {
                      handleClearAllFilters();
                      setIsContentFilterOpen(false);
                    }}
                    onApply={() => {
                      setAppliedCategories(modalCategories);
                      setAppliedStatus(modalStatus);
                      setAppliedPlatforms(modalPlatforms);
                      setAppliedGames(modalGames);
                      setAppliedSort(modalSort);
                      setIsContentFilterOpen(false);
                    }}
                  />
                </div>
              </section>

              {/* ======================================================
                  CASE C: FILTER EMPTY
                 ====================================================== */}
              {hasEmptyResults || previewState === "filter-empty" ? (
                <div className="py-20 flex items-center justify-center">
                  <EmptyState
                    title="Ups!... Hasil tidak ditemukan"
                    description="Coba cari hal lain!"
                    backLabel="Kembali"
                    searchLabel="Search"
                    onBack={() => {
                      setPreviewState("default");
                      setSearchQuery("");
                      handleClearAllFilters();
                    }}
                    onSearch={() => {
                      setPreviewState("default");
                      setSearchQuery("");
                      handleClearAllFilters();
                    }}
                  />
                </div>
              ) : (
                /* ======================================================
                    CASE D: BLOG GRID
                   ====================================================== */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-12 w-full mb-12">
                    {filteredBlogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        href={`/blogs/${blog.id}`}
                        imageSrc={blog.imageSrc}
                        date={blog.date}
                        title={blog.title}
                        category={blog.category}
                        description={blog.description}
                        className="shadow-none h-full "
                      />
                    ))}
                  </div>

                  {/* PAGINATION */}
                  <div className="flex justify-center pb-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={25}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </div>
          )}
      </StoreLayout>
    </>
  );
}
