import * as React from "react";
import Head from "next/head";
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
import { MOCK_ADMIN_REVIEWS } from "@/features/admin/data/admin-review-mock-data";
import type {
  AdminReviewItem,
  AdminReviewFilterState,
  ReviewStatus,
} from "@/features/admin/types/admin-review.types";

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

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
  statuses: ["Posted", "Draft", "Archive"],
  priceRange: [0, 200000],
  sortBy: "terbaru",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<AdminReviewItem[]>(MOCK_ADMIN_REVIEWS);
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

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load from localStorage on mount (hydration safe)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_reviews");
      if (stored) {
        const parsed: AdminReviewItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: AdminReviewItem[]) => {
    setReviews(updated);
    try {
      localStorage.setItem("gamezygo_admin_reviews", JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }
  };

  // Action: Open Post Review Modal (Matching user reference image)
  const handlePromptPost = (review: AdminReviewItem) => {
    setPostModalState({
      isOpen: true,
      review,
    });
  };

  // Action: Execute Post from Post Modal
  const handleExecutePost = (review: AdminReviewItem, replyText?: string) => {
    const updated = reviews.map((r) =>
      r.id === review.id
        ? {
            ...r,
            status: "Posted" as ReviewStatus,
            ...(replyText
              ? {
                  reply: replyText,
                  repliedAt: new Date().toLocaleDateString("id-ID"),
                }
              : {}),
          }
        : r
    );
    saveToStorage(updated);
    showToast(`Ulasan dari "${review.userEmail}" berhasil di-Post!`);
    setPostModalState({ isOpen: false, review: null });
  };

  // Action: Confirm Post (from small confirmation modal)
  const handleConfirmPost = (review: AdminReviewItem) => {
    const nextStatus: ReviewStatus = review.status === "Posted" ? "Draft" : "Posted";
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, status: nextStatus } : r
    );
    saveToStorage(updated);
    showToast(
      nextStatus === "Posted"
        ? `Ulasan dari "${review.userEmail}" berhasil di-Post!`
        : `Ulasan dari "${review.userEmail}" dikembalikan ke Draft.`
    );
    setPostConfirmModalState({ isOpen: false, review: null });
  };

  // Action: Archive review
  const handleArchive = (review: AdminReviewItem) => {
    const nextStatus: ReviewStatus = review.status === "Archive" ? "Draft" : "Archive";
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, status: nextStatus } : r
    );
    saveToStorage(updated);
    showToast(
      nextStatus === "Archive"
        ? `Ulasan dari "${review.userEmail}" telah diarsipkan.`
        : `Ulasan dari "${review.userEmail}" dipulihkan dari arsip.`
    );
  };

  // Action: Reply modal open
  const handleOpenReply = (review: AdminReviewItem) => {
    setReplyModalState({
      isOpen: true,
      review,
    });
  };

  // Action: Send reply
  const handleSendReply = (reviewId: string, replyText: string) => {
    const updated = reviews.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            reply: replyText,
            repliedAt: new Date().toLocaleDateString("id-ID"),
          }
        : r
    );
    saveToStorage(updated);
    showToast("Balasan ulasan berhasil dikirim!");
  };

  // Action: Toggle Posted Review View
  const handleTogglePostedView = () => {
    setIsPostedViewOnly((prev) => !prev);
  };

  // Action: Hide review from posted view (sets to Draft)
  const handleHide = (review: AdminReviewItem) => {
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, status: "Draft" as ReviewStatus } : r
    );
    saveToStorage(updated);
    showToast(`Ulasan dari "${review.userEmail}" berhasil disembunyikan.`);
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

    // 5. Price range
    const [minPrice, maxPrice] = filters.priceRange;
    result = result.filter((r) => {
      const p = r.price ?? 50000;
      return p >= minPrice && p <= maxPrice;
    });

    // 6. Sort
    if (filters.sortBy === "name_asc") {
      result.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
    } else {
      // Terbaru (default by id / createdAt)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [reviews, filters, isPostedViewOnly]);

  const isFilterActive =
    Boolean(filters.search.trim()) ||
    filters.star !== null ||
    filters.statuses.length < 3 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 200000 ||
    filters.sortBy !== "terbaru";

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
          <AdminReviewsHeaderSearch
            searchQuery={filters.search}
            onSearchChange={(search) =>
              setFilters((prev) => ({ ...prev, search }))
            }
            filters={filters}
            onFilterChange={setFilters}
          />
        }
        className="!p-0 !pt-0 !pb-0 !space-y-0 w-full bg-deep-blue-950 min-h-screen"
      >
        {/* Floating Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-emerald-500/40 text-emerald-300 text-label-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Sub-Header: "92 Ulasan" or "[ < ] 92 Ulasan" (Matching Image 2) */}
        <AdminReviewsTopSection
          totalCount={filteredReviews.length}
          isPostedViewActive={isPostedViewOnly}
          onTogglePostedView={handleTogglePostedView}
        />

        {/* 2. Review Cards Grid Area (Matching Image 3 & 4) */}
        <div className="p-6 sm:p-8 bg-deep-blue-950">
          {filteredReviews.length === 0 ? (
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
                  onArchive={handleArchive}
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
          onArchive={handleArchive}
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
              <img
                src={previewImage}
                alt="Enlarged screenshot"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
