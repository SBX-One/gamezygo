import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAdminBlogDetail } from "@/hooks/use-admin-blogs";
import {
  formatArticlePublishedDate,
  mapBackendStatusToUi,
  parseContentToArticleBlocks,
} from "@/features/admin/utils/article-content.utils";
import { resolveImageUrl } from "@/utils/image-url";

export interface AdminArticlePreviewModalProps {
  isOpen: boolean;
  articleId: string | null;
  onClose: () => void;
  onEdit?: (articleId: string) => void;
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

export function AdminArticlePreviewModal({
  isOpen,
  articleId,
  onClose,
  onEdit,
}: AdminArticlePreviewModalProps) {
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useAdminBlogDetail(articleId || undefined, {
    enabled: isOpen && Boolean(articleId),
  });

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const parsedBlocks = React.useMemo(
    () => parseContentToArticleBlocks(detail?.content),
    [detail?.content]
  );

  if (!isOpen) return null;

  const uiStatus = mapBackendStatusToUi(detail?.status);
  const formattedDate = formatArticlePublishedDate(detail?.published_at);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-article-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-[780px] max-w-[95vw] rounded-lg bg-[#161722] border border-white/10 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-deep-blue-700 shrink-0">
          <div className="flex items-center gap-3">
            <h2
              id="preview-article-title"
              className="text-base font-bold text-white tracking-normal"
            >
              Preview Artikel
            </h2>
            {detail && (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border",
                  uiStatus === "published"
                    ? "bg-[#0f291e] text-green-400 border-green-800/40"
                    : uiStatus === "unpublished"
                    ? "bg-[#2a141b] text-rose-400 border-rose-800/40"
                    : "bg-[#2a1d13] text-amber-400 border-amber-700/40"
                )}
              >
                {uiStatus === "published"
                  ? "PUBLISHED"
                  : uiStatus === "unpublished"
                  ? "UNPUBLISH"
                  : "DRAFT"}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup preview"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="w-full h-56 rounded-lg bg-white/5" />
              <div className="h-7 w-2/3 rounded bg-white/10" />
              <div className="h-4 w-1/3 rounded bg-white/5" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-4 w-5/6 rounded bg-white/5" />
                <div className="h-4 w-4/5 rounded bg-white/5" />
              </div>
            </div>
          ) : isError || !detail ? (
            <div className="py-12 text-center space-y-4">
              <p className="text-sm text-rose-300">
                Gagal memuat detail artikel dari server.
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </div>
          ) : (
            <>
              {/* Cover Banner */}
              <div className="relative w-full aspect-video max-h-72 rounded-lg overflow-hidden bg-deep-blue-900 border border-white/10">
                <Image
                  src={resolveImageUrl(
                    detail.banner_file_url,
                    "https://placehold.co/1200x600/13151F/6366F1?text=No+Banner"
                  )}
                  alt={detail.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Meta & Title */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-label-xs text-gray-400">
                  {detail.categories?.name && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                      {detail.categories.name}
                    </span>
                  )}
                  {detail.author?.name && (
                    <span>Oleh {detail.author.name}</span>
                  )}
                  {formattedDate && (
                    <>
                      <span>•</span>
                      <span>Dipublikasikan {formattedDate}</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-white leading-snug">
                  {detail.title}
                </h1>
              </div>

              <div className="w-full h-px bg-white/10" />

              {/* Rendered Content Blocks */}
              <div className="space-y-4 text-gray-200 leading-relaxed">
                {parsedBlocks.map((block) => {
                  const alignClass =
                    block.align === "center"
                      ? "text-center"
                      : block.align === "right"
                      ? "text-right"
                      : "text-left";
                  const styleClass = cn(
                    block.isBold && "font-bold",
                    block.isItalic && "italic",
                    block.isUnderline && "underline",
                    block.isStrike && "line-through"
                  );

                  switch (block.type) {
                    case "h1":
                      return (
                        <h2
                          key={block.id}
                          className={cn("text-2xl font-bold text-white", alignClass)}
                        >
                          {block.content}
                        </h2>
                      );
                    case "h2":
                      return (
                        <h3
                          key={block.id}
                          className={cn("text-xl font-bold text-white", alignClass)}
                        >
                          {block.content}
                        </h3>
                      );
                    case "h3":
                    case "h4":
                      return (
                        <h4
                          key={block.id}
                          className={cn("text-lg font-semibold text-white", alignClass)}
                        >
                          {block.content}
                        </h4>
                      );
                    case "bullet-list":
                      return (
                        <div key={block.id} className="flex items-start gap-2.5 pl-2">
                          <span className="text-gray-400 font-bold">•</span>
                          <span className={cn("text-sm text-gray-200", styleClass)}>
                            {block.content}
                          </span>
                        </div>
                      );
                    case "numbered-list":
                      return (
                        <div key={block.id} className="flex items-start gap-2.5 pl-2">
                          <span className="text-gray-400 font-semibold">-</span>
                          <span className={cn("text-sm text-gray-200", styleClass)}>
                            {block.content}
                          </span>
                        </div>
                      );
                    case "quote":
                      return (
                        <blockquote
                          key={block.id}
                          className="border-l-4 border-[#DF3848] pl-4 italic text-sm text-gray-300"
                        >
                          {block.content}
                        </blockquote>
                      );
                    case "code":
                      return (
                        <pre
                          key={block.id}
                          className="p-3.5 rounded-lg bg-deep-blue-950 border border-white/10 text-xs text-indigo-300 overflow-x-auto font-mono"
                        >
                          <code>{block.content}</code>
                        </pre>
                      );
                    case "callout":
                      return (
                        <div
                          key={block.id}
                          className="p-3.5 rounded-lg bg-[#151722] border border-indigo-500/30 flex items-start gap-3 text-sm text-gray-200"
                        >
                          <span>💡</span>
                          <span>{block.content}</span>
                        </div>
                      );
                    case "divider":
                      return <hr key={block.id} className="border-t border-white/10" />;
                    case "image":
                      return block.imageUrl ? (
                        <figure key={block.id} className="space-y-1.5">
                          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={resolveImageUrl(block.imageUrl)}
                              alt={block.imageCaption || "Gambar artikel"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          {block.imageCaption && (
                            <figcaption className="text-center text-xs text-gray-400">
                              {block.imageCaption}
                            </figcaption>
                          )}
                        </figure>
                      ) : null;
                    case "table":
                      return block.tableData && block.tableData.length > 0 ? (
                        <div key={block.id} className="overflow-x-auto">
                          <table className="w-full border-collapse border border-white/15 text-sm">
                            <tbody>
                              {block.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="border border-white/10 px-3 py-2 text-gray-200"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : null;
                    default:
                      return block.content ? (
                        <p
                          key={block.id}
                          className={cn(
                            "text-sm sm:text-base text-gray-200 whitespace-pre-line",
                            alignClass,
                            styleClass
                          )}
                        >
                          {block.content}
                        </p>
                      ) : null;
                  }
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-deep-blue-700 shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </Button>
          {detail && onEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(String(detail.id));
              }}
            >
              Edit Artikel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

