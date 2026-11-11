import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import {
  AdminArticlesTopBar,
  AdminArticlesGrid,
  AdminArticleAddEditModal,
  AdminArticlePreviewModal,
  AdminArticleDeleteModal,
  type AdminArticleModalSavePayload,
} from "@/features/admin/components/articles";
import {
  INITIAL_ARTICLE_FILTER_STATE,
  type AdminArticleFilterState,
  type AdminArticle,
  type AdminArticleStatus,
  type BackendBlogStatus,
} from "@/features/admin/types/admin-article.types";
import {
  useAdminBlogs,
  useAdminBlogCategories,
  useCreateAdminBlog,
  useUpdateAdminBlog,
  usePublishAdminBlog,
  useBulkPublishAdminBlogs,
  useDeleteAdminBlog,
  useBulkDeleteAdminBlogs,
} from "@/hooks/use-admin-blogs";
import { mapUiStatusToBackend } from "@/features/admin/utils/article-content.utils";
import { toast } from "@/stores/use-toast-store";

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

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return err?.response?.data?.message || err?.message || fallback;
}

export default function AdminArticlesPage() {
  const router = useRouter();

  const [filters, setFilters] = React.useState<AdminArticleFilterState>(
    INITIAL_ARTICLE_FILTER_STATE
  );
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [editingArticle, setEditingArticle] = React.useState<AdminArticle | null>(
    null
  );
  const [previewArticleId, setPreviewArticleId] = React.useState<string | null>(
    null
  );
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    type: "single" | "multiple";
    targetId?: string;
  }>({
    isOpen: false,
    type: "single",
  });

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // Reset pagination when filter criteria change
  const handleFilterChange = React.useCallback(
    (nextFilters: AdminArticleFilterState) => {
      setFilters(nextFilters);
      setCurrentPage(1);
    },
    []
  );

  // Fetch blog categories from PostgreSQL
  const { data: blogCategories = [] } = useAdminBlogCategories();

  // Map UI filter state -> Backend API query parameters
  const selectedStatuses: BackendBlogStatus[] = React.useMemo(() => {
    const list: BackendBlogStatus[] = [];
    if (filters.isPublished) list.push("published");
    if (filters.isDraft) list.push("draft");
    if (filters.isUnpublished) list.push("archived");
    return list;
  }, [filters.isPublished, filters.isDraft, filters.isUnpublished]);

  const selectedCategoryIds: number[] = React.useMemo(() => {
    if (!filters.categories?.length || blogCategories.length === 0) return [];
    return blogCategories
      .filter((cat) => filters.categories?.includes(cat.name))
      .map((cat) => cat.id);
  }, [filters.categories, blogCategories]);

  const queryParams = React.useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
      statuses: selectedStatuses.length > 1 ? selectedStatuses : undefined,
      category_ids:
        selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      sort_by: (filters.sortBy === "name_asc" ? "name_asc" : "latest") as
        | "name_asc"
        | "latest",
      page: currentPage,
      per_page: 9,
    }),
    [
      debouncedSearch,
      selectedStatuses,
      selectedCategoryIds,
      filters.sortBy,
      currentPage,
    ]
  );

  // Live TanStack Query hooks
  const {
    articles,
    totalBlog,
    overallTotal,
    totalPages,
    isLoading,
    isError,
    refetch,
  } = useAdminBlogs(queryParams);

  const createMutation = useCreateAdminBlog();
  const updateMutation = useUpdateAdminBlog();
  const publishMutation = usePublishAdminBlog();
  const bulkPublishMutation = useBulkPublishAdminBlogs();
  const deleteMutation = useDeleteAdminBlog();
  const bulkDeleteMutation = useBulkDeleteAdminBlogs();

  const isDeleting = deleteMutation.isPending || bulkDeleteMutation.isPending;

  const hasAnyActiveFilter =
    Boolean(debouncedSearch) ||
    selectedStatuses.length > 0 ||
    selectedCategoryIds.length > 0 ||
    filters.sortBy === "name_asc";

  // Selection handlers
  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status transition handler (Publish / Unpublish -> archived)
  const handleStatusChange = async (
    id: string,
    newStatus: AdminArticleStatus
  ) => {
    try {
      if (newStatus === "published") {
        await publishMutation.mutateAsync(id);
        toast.success("Artikel berhasil dipublikasikan.");
      } else {
        await updateMutation.mutateAsync({
          id,
          payload: { status: mapUiStatusToBackend(newStatus) },
        });
        toast.success(
          newStatus === "unpublished"
            ? "Artikel berhasil di-unpublish (archived)."
            : "Status artikel diubah ke draft."
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui status artikel."));
    }
  };

  // Bulk Publish handler
  const handlePublishSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkPublishMutation.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} artikel berhasil dipublikasikan.`);
      setSelectedIds([]);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal mempublikasikan artikel terpilih.")
      );
    }
  };

  // Edit navigates to full Notion-style block editor page
  const handleEdit = (article: AdminArticle) => {
    router.push(`/admin/articles/edit/${article.id}`);
  };

  // Preview opens authenticated detail modal
  const handlePreview = (article: AdminArticle) => {
    setPreviewArticleId(article.id);
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

  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.type === "single" && deleteModalState.targetId) {
        const id = deleteModalState.targetId;
        await deleteMutation.mutateAsync(id);
        setSelectedIds((prev) => prev.filter((sId) => sId !== id));
        toast.success("Artikel berhasil dihapus.");
      } else if (deleteModalState.type === "multiple" && selectedIds.length > 0) {
        const count = selectedIds.length;
        await bulkDeleteMutation.mutateAsync(selectedIds);
        setSelectedIds([]);
        toast.success(`${count} artikel berhasil dihapus.`);
      }
      setDeleteModalState({ isOpen: false, type: "single" });
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus artikel."));
    }
  };

  const handleQuickSaveArticle = async (
    data: AdminArticleModalSavePayload,
    id?: string
  ) => {
    try {
      const backendStatus = mapUiStatusToBackend(data.status);
      if (id) {
        await updateMutation.mutateAsync({
          id,
          payload: {
            title: data.title,
            status: backendStatus,
            category_id: data.categoryId ?? null,
            banner_file: data.coverFile || data.coverImage,
          },
        });
        toast.success("Artikel berhasil diperbarui.");
      } else {
        await createMutation.mutateAsync({
          title: data.title,
          content: `<p>${data.title}</p>`,
          status: backendStatus,
          category_id: data.categoryId ?? null,
          banner_file: data.coverFile || data.coverImage,
        });
        toast.success("Artikel baru berhasil ditambahkan.");
      }
      setIsAddModalOpen(false);
      setEditingArticle(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan artikel."));
    }
  };

  const headerRight = (
    <AdminArticlesTopBar
      filters={filters}
      categories={blogCategories}
      onFilterChange={handleFilterChange}
    />
  );

  const showEmptyDatabaseState =
    !isLoading && !isError && overallTotal === 0 && !hasAnyActiveFilter;

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
          {/* Top Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isLoading ? "Memuat Artikel..." : `${totalBlog} Artikel`}
            </h2>

            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <>
                  <Button
                    variant="secondary"
                    size="xs"
                    disabled={bulkPublishMutation.isPending}
                    onClick={handlePublishSelected}
                    className="px-3 py-2"
                  >
                    {bulkPublishMutation.isPending
                      ? "Publishing..."
                      : `Publish (${selectedIds.length})`}
                  </Button>
                  <Button
                    variant="inactive"
                    size="xs"
                    disabled={isDeleting}
                    onClick={handleDeleteSelected}
                    className="px-3 py-2"
                  >
                    Delete ({selectedIds.length})
                  </Button>
                </>
              )}

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

          <div className="w-full h-px bg-white/10 -mt-2" />

          {isError ? (
            <div className="w-full py-16 rounded-lg bg-[#13151F] border border-rose-500/30 flex flex-col items-center justify-center text-center gap-3 px-4">
              <p className="text-sm text-rose-300 font-medium">
                Gagal memuat daftar artikel dari database. Pastikan Anda sudah login sebagai Admin.
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Muat Ulang
              </Button>
            </div>
          ) : showEmptyDatabaseState ? (
            <div className="w-full min-h-115 py-20 flex flex-col items-center justify-center text-center select-none animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-lg bg-[#161822] border border-white/5 flex items-center justify-center text-gray-200 mb-5">
                <ArticleDocumentIcon className="w-8 h-8 text-gray-200" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                Belum Ada Data Artikel
              </h3>

              <p className="text-label-xs sm:text-sm text-gray-400 mb-6 font-normal">
                Katalog artikel Anda saat ini masih kosong.
              </p>

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
            <>
              <AdminArticlesGrid
                articles={articles}
                selectedIds={selectedIds}
                isLoading={isLoading}
                onToggleSelect={handleToggleSelectItem}
                onEdit={handleEdit}
                onPreview={handlePreview}
                onDelete={handleDeleteItem}
                onStatusChange={handleStatusChange}
                onResetFilters={() => {
                  setFilters(INITIAL_ARTICLE_FILTER_STATE);
                  setCurrentPage(1);
                }}
              />

              {!isLoading && totalPages > 1 && (
                <div className="pt-6 sm:pt-10 flex justify-center w-full">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="justify-center"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Add / Edit Modal (Authenticated & DB-Connected) */}
        <AdminArticleAddEditModal
          isOpen={isAddModalOpen}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          initialData={editingArticle}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingArticle(null);
          }}
          onSave={handleQuickSaveArticle}
          onOpenFullEditor={(id) => router.push(`/admin/articles/edit/${id}`)}
        />

        {/* Authenticated Article Preview Modal */}
        <AdminArticlePreviewModal
          isOpen={Boolean(previewArticleId)}
          articleId={previewArticleId}
          onClose={() => setPreviewArticleId(null)}
          onEdit={(id) => router.push(`/admin/articles/edit/${id}`)}
        />

        {/* Delete Confirmation Modal */}
        <AdminArticleDeleteModal
          isOpen={deleteModalState.isOpen}
          isDeleting={isDeleting}
          title={
            deleteModalState.type === "multiple"
              ? `Are you sure to delete ${selectedIds.length} articles?`
              : "Are you sure to delete this article?"
          }
          description="If you delete this article you can't recover it."
          onClose={() => {
            if (!isDeleting) {
              setDeleteModalState({ isOpen: false, type: "single" });
            }
          }}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
