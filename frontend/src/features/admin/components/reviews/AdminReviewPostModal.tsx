import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { AdminReviewItem } from "../../types/admin-review.types";

export interface AdminReviewPostModalProps {
  isOpen: boolean;
  review: AdminReviewItem | null;
  onClose: () => void;
  onPost: (review: AdminReviewItem, replyText?: string) => void;
  onArchive: (review: AdminReviewItem) => void;
  onViewImage?: (imageUrl: string) => void;
  className?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
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

const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current text-white shrink-0"
    {...props}
  >
    <path d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198Z" />
  </svg>
);

export function AdminReviewPostModal({
  isOpen,
  review,
  onClose,
  onPost,
  onArchive,
  onViewImage,
  className,
}: AdminReviewPostModalProps) {
  const [replyText, setReplyText] = React.useState("");

  // Sync reply on review change
  React.useEffect(() => {
    if (review) {
      setReplyText(review.reply || "");
    }
  }, [review]);

  // ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  const handlePostClick = () => {
    onPost(review, replyText.trim());
  };

  const handleArchiveClick = () => {
    onArchive(review);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-post-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none font-sans"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card (Matching Uploaded Image: bg-deep-blue-950, rounded-lg, no shadow) */}
      <div
        className={cn(
          "relative z-10 w-[640px] max-w-[95vw] max-h-[92vh] overflow-y-auto no-scrollbar rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-7 flex flex-col gap-5 animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Header: Title + Close Icon */}
        <div className="flex items-center justify-between">
          <h3
            id="review-post-modal-title"
            className="text-base sm:text-lg font-bold text-white tracking-tight"
          >
            Ulasan
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-md"
            aria-label="Tutup modal ulasan"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Section 1: Customer Info Box */}
        <div className="bg-deep-blue-900 border border-deep-blue-700 rounded-lg p-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {review.userEmail}
            </h4>
            <p className="text-label-xs text-gray-400 mt-1 font-normal">
              {review.createdAt}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-deep-blue-700" />

          {/* Rating Pill */}
          <Pill
            variant="secondary"
            size="sm"
            rightIcon={<StarFilledIcon />}
            className="shrink-0"
          >
            {review.rating} Star
          </Pill>
        </div>

        {/* Section 2: ULASAN */}
        <div className="flex flex-col gap-2">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            ULASAN
          </span>
          <div className="bg-deep-blue-900 border border-deep-blue-700 rounded-lg p-4">
            <p className="text-sm text-gray-100 font-semibold leading-relaxed">
              {review.reviewText}
            </p>
          </div>
        </div>

        {/* Section 3: GAMBAR */}
        <div className="flex flex-col gap-2">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            GAMBAR
          </span>
          {review.thumbnails && review.thumbnails.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {review.thumbnails.slice(0, 3).map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={() => onViewImage?.(thumb)}
                  className="bg-deep-blue-900 border border-deep-blue-700 rounded-lg p-2.5 flex flex-col gap-2 cursor-pointer hover:border-deep-blue-600 transition-colors group"
                  title="Lihat screenshot"
                >
                  <div className="w-full h-16 sm:h-20 rounded-md overflow-hidden bg-deep-blue-950">
                    <img
                      src={thumb}
                      alt={`Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-label-xs font-medium text-white truncate">
                      workspace....
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal mt-0.5">
                      PNG • 820 KB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-deep-blue-900 border border-deep-blue-700 text-label-xs text-gray-400 italic">
              Tidak ada gambar terlampir
            </div>
          )}
        </div>

        {/* Section 4: BALASAN */}
        <div className="flex flex-col gap-2">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            BALASAN
          </span>
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Balasan anda"
            className="w-full p-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Section 5: Actions: [ Arsipkan ]  [ Post ] */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={handleArchiveClick}
            className="min-w-24 justify-center"
          >
            Arsipkan
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handlePostClick}
            className="min-w-24 justify-center"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
