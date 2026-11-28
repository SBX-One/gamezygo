import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { AdminReviewItem } from "../../types/admin-review.types";

export interface AdminReviewCardProps {
  review: AdminReviewItem;
  isPostedView?: boolean;
  onPost?: (review: AdminReviewItem) => void;
  onHide?: (review: AdminReviewItem) => void;
  onArchive?: (review: AdminReviewItem) => void;
  onReply?: (review: AdminReviewItem) => void;
  onViewImage?: (imageUrl: string) => void;
  className?: string;
}

const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current text-gray-50 shrink-0"
    {...props}
  >
    <path d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198Z" />
  </svg>
);

export function AdminReviewCard({
  review,
  isPostedView = false,
  onPost,
  onHide,
  onArchive,
  onReply,
  onViewImage,
  className,
}: AdminReviewCardProps) {
  const isPosted = review.status === "Posted";
  const isArchived = review.status === "Archive";

  return (
    <div
      className={cn(
        "bg-deep-blue-900 border border-deep-blue-700 rounded-lg p-6 flex flex-col justify-between hover:border-neutral-500 transition-all select-none",
        className
      )}
    >
      <div>
        {/* Top Header: Email & Date on left, Rating Pill on right (flex-col on mobile to prevent clipping) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="text-body-sm font-bold text-gray-50 tracking-tight truncate sm:max-w-[260px]">
              {review.userEmail}
            </h4>
            <p className="text-body-xs text-gray-400 mt-0.5 sm:mt-1 font-normal">
              {review.createdAt}
            </p>
          </div>

          {/* Rating Pill using Pill component (stacks on mobile below email) */}
          <div className="self-start sm:self-auto shrink-0">
            <Pill
              variant="secondary"
              size="sm"
              rightIcon={<StarFilledIcon />}
              className="shrink-0"
            >
              {review.rating} Star
            </Pill>
          </div>
        </div>

        {/* Review Quote Text (Matching Image 1 & 3) */}
        <p className="text-body-sm text-gray-300 font-normal leading-relaxed my-4 line-clamp-5">
          {review.reviewText}
        </p>

        {/* Thumbnails Row: 3 thumbnails (Matching Image 1 & 3) */}
        {review.thumbnails && review.thumbnails.length > 0 && (
          <div className="flex items-center gap-2.5 mb-5">
            {review.thumbnails.slice(0, 3).map((thumb, idx) => (
              <div
                key={idx}
                onClick={() => onViewImage?.(thumb)}
                className="relative flex-1 h-16 sm:h-18 rounded-lg overflow-hidden border border-white/10 bg-deep-blue-950 group cursor-pointer"
                title="Lihat screenshot"
              >
                <img
                  src={thumb}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        )}
        {/* Existing Admin Reply Preview */}
        {review.reply && (
          <div className="mb-4 rounded-lg bg-deep-blue-950/80 border border-indigo-500/25 px-3.5 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-300 block mb-1">
              Balasan Admin
            </span>
            <p className="text-body-xs text-gray-300 leading-relaxed line-clamp-3">
              {review.reply}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons using Button Component */}
      <div className="pt-2">
        {isPostedView ? (
          /* Posted View ("Di Posting"): Clear unpublish action distinct from Archive */
          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={() => onHide?.(review)}
            title="Tarik ulasan ini dari halaman publik tanpa menghapusnya ke Arsip"
            className="w-full justify-center"
          >
            Tarik dari Store
          </Button>
        ) : (
          /* Normal View: "Post", "Arsipkan", "Balas" */
          <div className="flex flex-col gap-2.5">
            {/* Main Action: Primary Button "Post" */}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onPost?.(review)}
              className="w-full justify-center"
            >
              {isPosted ? "Posted ✓" : "Post"}
            </Button>

            {/* Secondary Actions: "Arsipkan" & "Balas" */}
            <div className="flex items-center gap-2.5 w-full">
              <Button
                type="button"
                variant="inactive"
                size="sm"
                onClick={() => onArchive?.(review)}
                title="Pindahkan ulasan ke Arsip (disembunyikan dari store dan antrean aktif)"
                className="flex-1 justify-center"
              >
                {isArchived ? "Diarsipkan" : "Arsipkan"}
              </Button>

              <Button
                type="button"
                variant="inactive"
                size="sm"
                onClick={() => onReply?.(review)}
                className="flex-1 justify-center"
              >
                {review.reply ? "Edit Balasan" : "Balas"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
