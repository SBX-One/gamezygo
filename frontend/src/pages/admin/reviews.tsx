import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminReviewCard,
  AdminReviewReplyModal,
  AdminReviewPostConfirmModal,
  AdminReviewPostModal,
  AdminReviewsTopSection,
  AdminReviewsHeaderSearch,
} from "@/features/admin/components/reviews";
import type {
  AdminReviewItem,
  AdminReviewFilterState,
} from "@/features/admin/types/admin-review.types";
import {
  useAdminReviews,
  useUpdateAdminReviewStatus,
  useReplyAdminReview,
  useDeleteAdminReview,
} from "@/hooks/use-admin-reviews";
import { toast } from "@/stores/use-toast-store";
import type { AdminReviewQueryParams } from "@/services/admin-review.service";

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DEFAULT_FILTERS: AdminReviewFilterState = {
  search: "",
  star: null,
  statuses: ["Draft"],
  priceRange: [0, 200000],
  sortBy: "terbaru",
};

export default function AdminReviewsPage() {
  const [filters, setFilters] = React.useState<AdminReviewFilterState>(DEFAULT_FILTERS);
  const [isPostedViewOnly, setIsPostedViewOnly] = React.useState(false);

  // Post review modal state (Full modal matching the user reference image)
  const [postModalState, setPostModalState] = React.useState<{
    isOpen: boolean;
    review: AdminReviewItem | null;
  }>({
    isOpen: false,
    review: null,
  });

  // Post confirmation modal state
  const [postConfirmModalState, setPostConfirmModalState] = React.useState<{
    isOpen: boolean;
    review: AdminReviewItem | null;
  }>({
    isOpen: false,
    review: null,
  });

  // Reply modal state
  const [replyModalState, setReplyModalState] = React.useState<{
    isOpen: boolean;
    review: AdminReviewItem | null;
  }>({
    isOpen: false,
    review: null,
  });

  // Lightbox preview for thumbnails
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  // Query parameters for backend
  const queryParams: AdminReviewQueryParams = React.useMemo(() => {
    return {
      search: filters.search.trim() || undefined,
      star: filters.star !== null ? filters.star : undefined,
      status: isPostedViewOnly
        ? "approved"
        : filters.statuses.length === 1
        ? filters.statuses[0] === "Posted"
          ? "approved"
          : filters.statuses[0] === "Archive"
          ? "archived"
          : "pending"
        : undefined,
      sort_by: filters.sortBy === "name_asc" ? "name_asc" : "latest",
      per_page: 50,
    };
  }, [filters.search, filters.star, filters.statuses, filters.sortBy, isPostedViewOnly]);

  const { data: serverResult, isLoading, isError, refetch } = useAdminReviews(queryParams);
  const updateStatusMutation = useUpdateAdminReviewStatus();
  const replyMutation = useReplyAdminReview();
  const deleteReviewMutation = useDeleteAdminReview();

  const reviews = React.useMemo(() => {
    return serverResult?.reviews ?? [];
  }, [serverResult]);

  // Action: Open Post Review Modal (Matching user reference image)
  const handlePromptPost = (review: AdminReviewItem) => {
    setPostModalState({
      isOpen: true,
      review,
    });
  };

  // Action: Execute Post from Post Modal
  const handleExecutePost = async (review: AdminReviewItem, replyText?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: review.id,
        status: "approved",
      });
      if (replyText?.trim()) {
        await replyMutation.mutateAsync({
          id: review.id,
          message: replyText.trim(),
        });
      }
      toast.success(`Ulasan dari "${review.userEmail}" berhasil di-Post!`);
    } catch {
      toast.error("Gagal mem-posting ulasan ke server.");
    } finally {
      setPostModalState({ isOpen: false, review: null });
    }
  };

  // Action: Confirm Post (from small confirmation modal)
  const handleConfirmPost = async (review: AdminReviewItem) => {
    const nextStatus = review.status === "Posted" ? "pending" : "approved";
    try {
      await updateStatusMutation.mutateAsync({
        id: review.id,
        status: nextStatus,
      });
      toast.success(
        nextStatus === "approved"
          ? `Ulasan dari "${review.userEmail}" berhasil di-Post!`
          : `Ulasan dari "${review.userEmail}" dikembalikan ke Draft.`
      );
    } catch {
      toast.error("Gagal memperbarui status ulasan.");
    } finally {
      setPostConfirmModalState({ isOpen: false, review: null });
    }
  };

  // Action: Delete review from moderation queue
  const handleDeleteReview = async (review: AdminReviewItem) => {
    try {
      await deleteReviewMutation.mutateAsync(review.id);
      toast.success(`Ulasan dari "${review.userEmail}" berhasil dihapus.`);
    } catch {
      toast.error("Gagal menghapus ulasan.");
    }
  };

  // Action: Reply modal open
  const handleOpenReply = (review: AdminReviewItem) => {
    setReplyModalState({
      isOpen: true,
      review,
    });
  };

  // Action: Send reply
  const handleSendReply = async (reviewId: string, replyText: string) => {
    try {
      await replyMutation.mutateAsync({
        id: reviewId,
        message: replyText.trim(),
      });
      toast.success("Balasan ulasan berhasil dikirim!");
    } catch {
      toast.error("Gagal mengirim balasan ulasan.");
    } finally {
      setReplyModalState({ isOpen: false, review: null });
    }
  };

  // Action: Toggle Posted Review View
  const handleTogglePostedView = () => {
    setIsPostedViewOnly((prev) => !prev);
  };

  // Action: Hide review from posted view (sets to Draft)
  const handleHide = async (review: AdminReviewItem) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: review.id,
        status: "pending",
      });
      toast.success(`Ulasan dari "${review.userEmail}" berhasil disembunyikan.`);
    } catch {
      toast.error("Gagal menyembunyikan ulasan.");
    }
  };

  // Filter & Sort Logic
  const filteredReviews = React.useMemo(() => {
    let result = [...reviews];

    // 1. Posted View Toggle (From "Posted Review ->" Button)
    if (isPostedViewOnly) {
      result = result.filter((r) => r.status === "Posted");
    } else if (filters.statuses.length > 0) {
      // 2. Status filter
      result = result.filter((r) => filters.statuses.includes(r.status));
    }

    // 3. Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.userEmail.toLowerCase().includes(q) ||
          r.reviewText.toLowerCase().includes(q) ||
          r.gameTitle?.toLowerCase().includes(q)
      );
    }

    // 4. Star rating
    if (filters.star !== null) {
      result = result.filter((r) => r.rating === filters.star);
    }

    // 5. Sort
    if (filters.sortBy === "name_asc") {
      result.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
    } else {
      // Terbaru (default by id / createdAt)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [reviews, filters, isPostedViewOnly]);

  return (
    <>
      <Head>
        <title>
          {isPostedViewOnly ? "Di Posting | Ulasan Admin" : "Ulasan | Gamezygo Admin"}
        </title>
        <meta
          name="description"
          content="Kelola ulasan dan testimoni pelanggan Gamezygo"
        />
      </Head>

      <AdminLayout
        title={
          isPostedViewOnly ? (
            /* Breadcrumb Header Title (Matching Image 1: Ulasan > Di Posting) */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPostedViewOnly(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Ulasan
              </button>
              <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-white font-semibold">Di Posting</span>
            </div>
          ) : (
            "Ulasan"
          )
        }
        activeNavId="ulasan"
        headerClassName="bg-deep-blue-950 border-b border-deep-blue-700"
        headerRight={
          <div className="hidden sm:flex items-center">
            <AdminReviewsHeaderSearch
              searchQuery={filters.search}
              onSearchChange={(search) =>
                setFilters((prev) => ({ ...prev, search }))
              }
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        }
        className="!p-0 !pt-0 !pb-0 !space-y-0 w-full bg-deep-blue-950 min-h-screen"
        isError={!isLoading && isError}
        onReload={() => refetch()}
      >
        {/* 1. Sub-Header: "92 Ulasan" or "[ < ] 92 Ulasan" (Matching Image 2) */}
        <AdminReviewsTopSection
          totalCount={filteredReviews.length}
          isPostedViewActive={isPostedViewOnly}
          onTogglePostedView={handleTogglePostedView}
        />

        {/* Mobile-Only Search & Filter Bar: Placed under total reviews on < sm (both normal and posted views) */}
        <div className="block sm:hidden px-6 sm:px-8 py-3.5 border-b border-deep-blue-700 bg-deep-blue-950">
          <AdminReviewsHeaderSearch
            searchQuery={filters.search}
            onSearchChange={(search) =>
              setFilters((prev) => ({ ...prev, search }))
            }
            filters={filters}
            onFilterChange={setFilters}
            className="w-full"
          />
        </div>

        {/* 2. Review Cards Grid Area (Matching Image 3 & 4) */}
        <div className="p-6 sm:p-8 bg-deep-blue-950">
          {isLoading ? (
            /* Skeleton Loading Cards Grid (Matching Articles Skeleton) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-deep-blue-900 border border-deep-blue-700 rounded-lg p-6 flex flex-col justify-between animate-pulse"
                >
                  <div>
                    {/* Header: Email & Date on left, Rating Pill on right */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-40 rounded bg-white/10" />
                        <div className="h-3 w-20 rounded bg-white/5" />
                      </div>
                      <div className="h-6 w-16 rounded-full bg-white/5 shrink-0" />
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2 my-4">
                      <div className="h-3.5 w-full rounded bg-white/5" />
                      <div className="h-3.5 w-4/5 rounded bg-white/5" />
                      <div className="h-3.5 w-2/3 rounded bg-white/5" />
                    </div>

                    {/* Thumbnails Row */}
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="flex-1 h-16 sm:h-18 rounded-lg bg-white/5 border border-white/10" />
                      <div className="flex-1 h-16 sm:h-18 rounded-lg bg-white/5 border border-white/10" />
                      <div className="flex-1 h-16 sm:h-18 rounded-lg bg-white/5 border border-white/10" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <div className="h-9 w-full rounded-lg bg-white/10" />
                    <div className="flex items-center gap-2.5 w-full">
                      <div className="h-8 flex-1 rounded-lg bg-white/5" />
                      <div className="h-8 flex-1 rounded-lg bg-white/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            /* Empty state if filtered results are 0 */
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-center select-none py-16">
              <div className="w-16 h-16 rounded-lg bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-400 mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                Tidak Ada Ulasan Ditemukan
              </h3>
              <p className="text-label-xs sm:text-sm text-gray-400 mb-6">
                Tidak ada ulasan yang sesuai dengan kriteria pencarian atau filter Anda.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setIsPostedViewOnly(false);
                }}
              >
                Reset Semua Filter
              </Button>
            </div>
          ) : (
            /* 3-Column Responsive Grid matching Image 3 & 4 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredReviews.map((review) => (
                <AdminReviewCard
                  key={review.id}
                  review={review}
                  isPostedView={isPostedViewOnly}
                  onPost={handlePromptPost}
                  onHide={handleHide}
                  onArchive={handleDeleteReview}
                  onReply={handleOpenReply}
                  onViewImage={(img) => setPreviewImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal for Creating Post / Review Post Detail (Matching Reference Image) */}
        <AdminReviewPostModal
          isOpen={postModalState.isOpen}
          review={postModalState.review}
          onClose={() => setPostModalState({ isOpen: false, review: null })}
          onPost={handleExecutePost}
          onArchive={handleDeleteReview}
          onViewImage={(img) => setPreviewImage(img)}
        />

        {/* Confirmation Modal for Posting Review */}
        <AdminReviewPostConfirmModal
          isOpen={postConfirmModalState.isOpen}
          review={postConfirmModalState.review}
          onClose={() => setPostConfirmModalState({ isOpen: false, review: null })}
          onConfirm={handleConfirmPost}
        />



        {/* Reply Modal */}
        <AdminReviewReplyModal
          isOpen={replyModalState.isOpen}
          review={replyModalState.review}
          onClose={() =>
            setReplyModalState({
              isOpen: false,
              review: null,
            })
          }
          onSendReply={handleSendReply}
        />

        {/* Thumbnail Preview Lightbox Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-3xl max-h-[85vh] bg-deep-blue-950 border border-deep-blue-700 rounded-lg overflow-hidden p-2">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <CloseIcon />
              </button>
              <Image
                src={previewImage}
                alt="Enlarged screenshot"
                width={800}
                height={600}
                unoptimized
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
