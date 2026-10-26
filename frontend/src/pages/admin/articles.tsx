import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import {
  AdminArticlesTopBar,
  AdminArticlesGrid,
  AdminArticleAddEditModal,
  AdminArticleDeleteModal,
} from "@/features/admin/components/articles";
import { MOCK_ADMIN_ARTICLES } from "@/features/admin/data/admin-articles-mock-data";
import {
  INITIAL_ARTICLE_FILTER_STATE,
  type AdminArticleFilterState,
  type AdminArticle,
  type AdminArticleStatus,
} from "@/features/admin/types/admin-article.types";

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Article Document Icon for empty state
const ArticleDocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function AdminArticlesPage() {
  const router = useRouter();
  // Initialize with mock articles and check localStorage
  const [articles, setArticles] = React.useState<AdminArticle[]>(MOCK_ADMIN_ARTICLES);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_articles");
      if (stored) {
        const parsed: AdminArticle[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored articles with mock articles (unique by id)
          const merged = [...parsed, ...MOCK_ADMIN_ARTICLES.filter(
            (m) => !parsed.some((p) => p.id === m.id)
          )];
          setArticles(merged);
        }
      }
    } catch {
      // Storage parsing ignore
    }
  }, []);

  const [filters, setFilters] = React.useState<AdminArticleFilterState>(
    INITIAL_ARTICLE_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [editingArticle, setEditingArticle] = React.useState<AdminArticle | null>(null);
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    type: "single" | "multiple";
    targetId?: string;
  }>({
    isOpen: false,
    type: "single",
  });

  // Filter & Search logic
  const filteredArticles = React.useMemo(() => {
    return articles.filter((article) => {
      // 1. Search query match
      if (
        filters.searchQuery.trim() &&
        !article.title
          .toLowerCase()
          .includes(filters.searchQuery.trim().toLowerCase())
      ) {
        return false;
      }

      // 2. Status checkbox filter
      const hasAnyStatusFilter =
        filters.isPublished || filters.isDraft || filters.isUnpublished;

      if (hasAnyStatusFilter) {
        const matchesPublished = filters.isPublished && article.status === "published";
        const matchesDraft = filters.isDraft && article.status === "draft";
        const matchesUnpublished =
          filters.isUnpublished && article.status === "unpublished";

        if (!matchesPublished && !matchesDraft && !matchesUnpublished) {
          return false;
        }
      }

      // 3. Category tag filter (from Filter & Sort popover)
      if (
        filters.categories &&
        filters.categories.length > 0 &&
        article.category &&
        !filters.categories.some((c) =>
          article.category?.toLowerCase().includes(c.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "name_asc") {
        return a.title.localeCompare(b.title);
      }
      return 0; // Default: terbaru
    });
  }, [articles, filters]);

  // Selection handlers
  const handleToggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Status and edit handlers
  const handleStatusChange = (id: string, newStatus: AdminArticleStatus) => {
    setArticles((prev) =>
      prev.map((art) =>
        art.id === id
          ? {
              ...art,
              status: newStatus,
              publishedAt:
                newStatus === "published"
                  ? art.publishedAt ||
                    new Date().toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : art.publishedAt,
              lastEdited: "Just now",
            }
          : art
      )
    );
  };

  const handleEdit = (article: AdminArticle) => {
    setEditingArticle(article);
    setIsAddModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setDeleteModalState({
      isOpen: true,
      type: "single",
      targetId: id,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      type: "multiple",
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.type === "single" && deleteModalState.targetId) {
      const id = deleteModalState.targetId;
      setArticles((prev) => prev.filter((art) => art.id !== id));
      setSelectedIds((prev) => prev.filter((sId) => sId !== id));
    } else if (deleteModalState.type === "multiple") {
      setArticles((prev) => prev.filter((art) => !selectedIds.includes(art.id)));
      setSelectedIds([]);
    }
    setDeleteModalState({ isOpen: false, type: "single" });
  };

  const handleSaveArticle = (
    data: Omit<AdminArticle, "id">,
    id?: string
  ) => {
    if (id) {
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? { ...art, ...data } : art))
      );
    } else {
      const created: AdminArticle = {
        ...data,
        id: `art-${Date.now()}`,
      };
      setArticles((prev) => [created, ...prev]);
    }
    setIsAddModalOpen(false);
    setEditingArticle(null);
  };

  // Helper to populate demo articles from Image 2 & 3
  const handleLoadDemoArticles = () => {
    setArticles(MOCK_ADMIN_ARTICLES);
  };

  // HeaderRight content matching Image 1
  const headerRight = (
    <AdminArticlesTopBar
      filters={filters}
      onFilterChange={setFilters}
    />
  );

  return (
    <>
      <Head>
        <title>Manajemen Artikel | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola artikel, promosi, dan panduan berita Gamezygo"
        />
      </Head>

      <AdminLayout
        title="Artikel"
        activeNavId="artikel"
        headerRight={headerRight}
      >
        <div className="space-y-6 sm:space-y-7 pb-10">
          {/* Top Action Row (Exact Match with Image 1) */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Total Artikel (Image 1: 102 Artikel) */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {articles.length === 9 ? 102 : filteredArticles.length} Artikel
            </h2>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Delete Button: Only shown when one or more cards are checked per user instruction */}
              {selectedIds.length > 0 && (
                <Button
                  variant="inactive"
                  size="xs"
                  onClick={handleDeleteSelected}
                  className="px-3 py-2"
                >
                  Delete ({selectedIds.length})
                </Button>
              )}

              {/* Add New Button: Always shown (Matching Image 1) */}
              <Button
                variant="outline"
                size="xs"
                leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
                onClick={() => router.push("/admin/articles/add")}
                className="px-3 py-2"
              >
                Add New
              </Button>
            </div>
          </div>

          {/* Horizontal Divider Line across the full container width (Matching Image 1) */}
          <div className="w-full h-px bg-white/10 -mt-2" />

          {/* Conditional Rendering: Empty State vs Cards Grid */}
          {articles.length === 0 ? (
            /* EMPTY STATE VIEW (max rounded-lg, no shadow per user instructions) */
            <div className="w-full min-h-115 py-20 flex flex-col items-center justify-center text-center select-none animate-in fade-in duration-200">
              {/* Article Document Icon in max rounded-lg box, no shadow */}
              <div className="w-16 h-16 rounded-lg bg-[#161822] border border-white/5 flex items-center justify-center text-gray-200 mb-5">
                <ArticleDocumentIcon className="w-8 h-8 text-gray-200" />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                Belum Ada Data Artikel
              </h3>

              {/* Subtitle */}
              <p className="text-label-xs sm:text-sm text-gray-400 mb-6 font-normal">
                Katalog artikel Anda saat ini masih kosong.
              </p>

              {/* Action Button: + Tambah Artikel */}
              <Button
                variant="outline"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4 shrink-0" />}
                onClick={() => router.push("/admin/articles/add")}
              >
                Tambah Artikel
              </Button>
            </div>
          ) : (
            /* POPULATED STATE: 3 Columns Grid & Pagination (Matching Image 2 & 4) */
            <>
              <AdminArticlesGrid
                articles={filteredArticles}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelectItem}
                onEdit={handleEdit}
                onDelete={handleDeleteItem}
                onStatusChange={handleStatusChange}
                onResetFilters={() => setFilters(INITIAL_ARTICLE_FILTER_STATE)}
              />

              {/* Pagination matching Image 4 */}
              <div className="pt-6 sm:pt-10 flex justify-center w-full">
                <Pagination
                  currentPage={currentPage}
                  totalPages={articles.length === 9 ? 25 : Math.max(1, Math.ceil(filteredArticles.length / 9))}
                  onPageChange={setCurrentPage}
                  className="justify-center"
                />
              </div>
            </>
          )}
        </div>

        {/* Add / Edit Article Modal */}
        <AdminArticleAddEditModal
          isOpen={isAddModalOpen}
          initialData={editingArticle}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingArticle(null);
          }}
          onSave={handleSaveArticle}
        />

        {/* Delete Confirmation Modal (Exact Match with Image 4 & AdminCatalogDeleteModal) */}
        <AdminArticleDeleteModal
          isOpen={deleteModalState.isOpen}
          title={
            deleteModalState.type === "multiple"
              ? `Are you sure to delete ${selectedIds.length} articles?`
              : "Are you sure to delete this article?"
          }
          description="If you this you can't recover it."
          onClose={() =>
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
