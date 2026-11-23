import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminReviewItem } from "../../types/admin-review.types";

export interface AdminReviewReplyModalProps {
  isOpen: boolean;
  review: AdminReviewItem | null;
  onClose: () => void;
  onSendReply: (reviewId: string, replyText: string) => void;
  className?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function AdminReviewReplyModal({
  isOpen,
  review,
  onClose,
  onSendReply,
  className,
}: AdminReviewReplyModalProps) {
  const [replyText, setReplyText] = React.useState("");

  React.useEffect(() => {
    if (review) {
      setReplyText(review.reply || "");
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(review.id, replyText.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reply-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-sans"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative z-10 w-[500px] max-w-[95vw] bg-deep-blue-950 border border-deep-blue-700 rounded-lg p-6 sm:p-7 flex flex-col gap-5 animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-deep-blue-700 pb-4">
          <div>
            <h3
              id="reply-modal-title"
              className="text-base sm:text-lg font-bold text-gray-50 tracking-tight"
            >
              Balas Ulasan
            </h3>
            <p className="text-body-xs text-gray-400 mt-0.5">
              Kepada: <span className="text-gray-50 font-medium">{review.userEmail}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-lg"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Review Snippet */}
        <div className="bg-deep-blue-950 border border-white/5 rounded-lg p-3.5 text-body-xs text-gray-300 leading-relaxed italic line-clamp-3">
          {review.reviewText}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-body-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Pesan Balasan
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis balasan resmi untuk ulasan ini..."
              required
              className="w-full p-3.5 bg-deep-blue-950 border border-deep-blue-700 rounded-lg text-body-sm text-gray-50 placeholder-gray-500 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
            />
          </div>

          {/* Action Buttons using Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="inactive"
              size="sm"
              onClick={onClose}
              className="px-5 py-2.5 cursor-pointer min-w-20 justify-center"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="px-6 py-2.5 cursor-pointer min-w-24 justify-center"
            >
              Kirim Balasan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
