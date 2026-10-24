import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminArticle, AdminArticleStatus } from "../../types/admin-article.types";

export interface AdminArticleAddEditModalProps {
  isOpen: boolean;
  initialData?: AdminArticle | null;
  onClose: () => void;
  onSave: (articleData: Omit<AdminArticle, "id">, id?: string) => void;
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

interface AdminArticleFormProps {
  initialData?: AdminArticle | null;
  onClose: () => void;
  onSave: (articleData: Omit<AdminArticle, "id">, id?: string) => void;
}

function AdminArticleForm({
  initialData,
  onClose,
  onSave,
}: AdminArticleFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [coverImage, setCoverImage] = React.useState(
    initialData?.coverImage ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  );
  const [status, setStatus] = React.useState<AdminArticleStatus>(
    initialData?.status || "published"
  );
  const [publishedAt, setPublishedAt] = React.useState(
    initialData?.publishedAt || "22/06/2026"
  );
  const [category, setCategory] = React.useState(
    initialData?.category || "Promo"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        coverImage:
          coverImage.trim() ||
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        status,
        publishedAt: status === "published" ? publishedAt : undefined,
        lastEdited: "Just now",
        views: initialData?.views ?? 0,
        category,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4.5">
      {/* Title */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-300 mb-1.5">
          Judul Artikel <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Panduan pembeli Promo Musim Panas Epic Games..."
          required
          className="w-full px-3.5 py-2.5 bg-[#12131A] border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-300 mb-1.5">
          URL Cover Banner
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full h-10 px-3.5 bg-[#12131A] border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {coverImage && (
          <div className="relative mt-2 w-full h-32 rounded-lg overflow-hidden bg-black/40 border border-white/5">
            <Image
              src={coverImage}
              alt="Preview cover"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Status Radio Buttons */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-300 mb-1.5">
          Status Artikel
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(["published", "draft", "unpublished"] as const).map((s) => {
            const isSelected = status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "h-10 rounded-lg border text-label-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center",
                  isSelected
                    ? s === "published"
                      ? "bg-[#0f291e] border-emerald-500/60 text-emerald-400"
                      : s === "draft"
                      ? "bg-[#2a1d13] border-amber-500/60 text-amber-400"
                      : "bg-[#2a141b] border-rose-500/60 text-rose-400"
                    : "bg-[#12131A] border-deep-blue-700 text-gray-400 hover:text-white hover:border-gray-500"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Published At (Only if status is published) */}
      {status === "published" && (
        <div>
          <label className="block text-label-xs font-semibold text-gray-300 mb-1.5">
            Tanggal Publikasi (DD/MM/YYYY)
          </label>
          <input
            type="text"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            placeholder="22/06/2026"
            className="w-full h-10 px-3.5 bg-[#12131A] border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-300 mb-1.5">
          Kategori
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-10 px-3.5 bg-[#12131A] border border-deep-blue-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="Promo">Promo</option>
          <option value="Action">Action</option>
          <option value="Card Game">Card Game</option>
          <option value="Comics">Comics</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Review">Review</option>
        </select>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-deep-blue-700">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          className="h-10! px-5 text-label-xs font-semibold"
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="h-10! px-6 text-label-xs font-semibold"
        >
          {initialData ? "Simpan Perubahan" : "Tambah Artikel"}
        </Button>
      </div>
    </form>
  );
}

export function AdminArticleAddEditModal({
  isOpen,
  initialData,
  onClose,
  onSave,
}: AdminArticleAddEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (max rounded-lg, no shadow per user instructions) */}
      <div className="relative w-140 max-w-[95vw] rounded-lg bg-[#161722] border border-white/10 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-deep-blue-700">
          <h2 className="text-base font-bold text-white tracking-normal">
            {initialData ? "Edit Artikel" : "Tambah Artikel Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form mounted with key to avoid set-state-in-effect */}
        <AdminArticleForm
          key={initialData?.id || "new-article-form"}
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
