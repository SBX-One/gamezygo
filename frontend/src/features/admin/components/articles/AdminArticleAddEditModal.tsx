import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  useAdminBlogCategories,
  useAdminBlogDetail,
} from "@/hooks/use-admin-blogs";
import type { AdminBlogDetailServerData } from "@/services/admin-blog.service";
import {
  mapBackendStatusToUi,
} from "@/features/admin/utils/article-content.utils";
import { resolveImageUrl } from "@/utils/image-url";
import type {
  AdminArticle,
  AdminArticleStatus,
  AdminBlogCategoryItem,
} from "../../types/admin-article.types";

export interface AdminArticleModalSavePayload {
  title: string;
  coverFile?: File | null;
  coverImage?: string;
  status: AdminArticleStatus;
  categoryId?: number | null;
}

export interface AdminArticleAddEditModalProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  initialData?: AdminArticle | null;
  onClose: () => void;
  onSave: (payload: AdminArticleModalSavePayload, id?: string) => void | Promise<void>;
  onOpenFullEditor?: (id: string) => void;
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
  detailData?: AdminBlogDetailServerData;
  categories: AdminBlogCategoryItem[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSave: (payload: AdminArticleModalSavePayload, id?: string) => void | Promise<void>;
  onOpenFullEditor?: (id: string) => void;
}

function AdminArticleForm({
  initialData,
  detailData,
  categories,
  isSubmitting = false,
  onClose,
  onSave,
  onOpenFullEditor,
}: AdminArticleFormProps) {
  const [title, setTitle] = React.useState(
    detailData?.title || initialData?.title || ""
  );
  const [coverImage, setCoverImage] = React.useState(
    detailData?.banner_file_url
      ? resolveImageUrl(detailData.banner_file_url, "")
      : initialData?.coverImage || ""
  );
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<AdminArticleStatus>(
    detailData?.status
      ? mapBackendStatusToUi(detailData.status)
      : initialData?.status || "draft"
  );
  const [categoryId, setCategoryId] = React.useState<number | "">(
    detailData?.categories?.id ?? initialData?.categoryId ?? ""
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    await onSave(
      {
        title: title.trim(),
        coverFile,
        coverImage: coverFile ? undefined : coverImage.trim() || undefined,
        status,
        categoryId: categoryId === "" ? null : Number(categoryId),
      },
      initialData?.id
    );
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

      {/* Cover Image Upload / URL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-label-xs font-semibold text-gray-300">
            Cover Banner
          </label>
          <label className="text-label-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
            Unggah File Gambar
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <input
          type="url"
          value={coverFile ? "" : coverImage}
          onChange={(e) => {
            setCoverFile(null);
            setCoverImage(e.target.value);
          }}
          placeholder={
            coverFile
              ? `File dipilih: ${coverFile.name}`
              : "https://images.unsplash.com/..."
          }
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
                {s === "unpublished" ? "Archived" : s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category (Live DB Blog Categories) */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-300 mb-1.5">
          Kategori
        </label>
        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full h-10 px-3.5 bg-[#12131A] border border-deep-blue-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-deep-blue-700">
        <div>
          {initialData?.id && onOpenFullEditor && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenFullEditor(initialData.id);
              }}
              className="h-10! px-4 text-label-xs font-semibold"
            >
              Buka Editor Lengkap
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-10! px-5 text-label-xs font-semibold"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="h-10! px-6 text-label-xs font-semibold"
          >
            {isSubmitting
              ? "Menyimpan..."
              : initialData
              ? "Simpan Perubahan"
              : "Tambah Artikel"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function AdminArticleAddEditModal({
  isOpen,
  isSubmitting = false,
  initialData,
  onClose,
  onSave,
  onOpenFullEditor,
}: AdminArticleAddEditModalProps) {
  const { data: categories = [] } = useAdminBlogCategories();
  const { data: detailData } = useAdminBlogDetail(initialData?.id, {
    enabled: isOpen && Boolean(initialData?.id),
  });

  if (!isOpen) return null;

  const formKey = `${initialData?.id || "new"}-${detailData?.id || "base"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      <div className="relative w-[560px] max-w-[95vw] rounded-lg bg-[#161722] border border-white/10 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-deep-blue-700">
          <h2 className="text-base font-bold text-white tracking-normal">
            {initialData ? "Edit Artikel (Quick)" : "Tambah Artikel Baru"}
          </h2>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <AdminArticleForm
          key={formKey}
          initialData={initialData}
          detailData={detailData}
          categories={categories}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSave={onSave}
          onOpenFullEditor={onOpenFullEditor}
        />
      </div>
    </div>
  );
}
