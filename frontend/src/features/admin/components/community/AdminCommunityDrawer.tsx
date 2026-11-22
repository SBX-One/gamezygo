import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminCommunityItem } from "../../types/admin-community.types";

export interface AdminCommunityDrawerSaveData {
  name: string;
  pageLink: string;
  tags: string[];
  imageUrl: string;
  imageFile: File | null;
  removeImage: boolean;
  isActive: boolean;
}

export interface AdminCommunityDrawerProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  item?: AdminCommunityItem | null;
  availableTags?: string[];
  onClose: () => void;
  onSave: (data: AdminCommunityDrawerSaveData) => void | Promise<void>;
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

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const XSmallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DEFAULT_QUICK_TAGS = [
  "WhatsApp",
  "Telegram",
  "Discord",
  "Steam Group",
  "Reddit",
  "Forum",
];

function getInitialTags(item?: AdminCommunityItem | null): string[] {
  if (!item) return [];
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    return item.tags;
  }
  if (item.tag) {
    return item.tag
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

interface AdminCommunityFormProps {
  item?: AdminCommunityItem | null;
  availableTags: string[];
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (data: AdminCommunityDrawerSaveData) => void | Promise<void>;
}

function AdminCommunityForm({
  item,
  availableTags,
  isSubmitting,
  onClose,
  onSave,
}: AdminCommunityFormProps) {
  const [name, setName] = React.useState(item?.name ?? "");
  const [pageLink, setPageLink] = React.useState(item?.pageLink ?? "");
  const [tags, setTags] = React.useState<string[]>(() => getInitialTags(item));
  const [tagInput, setTagInput] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState(item?.imageUrl ?? "");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [removeImage, setRemoveImage] = React.useState(false);
  const [isActive, setIsActive] = React.useState(item ? item.isActive : true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [imageMeta, setImageMeta] = React.useState<{
    name: string;
    size: string;
  }>(() =>
    item?.imageUrl
      ? { name: "cover_image", size: "Saved cover" }
      : { name: "", size: "" }
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = Math.max(1, Math.round(file.size / 1024));
    const ext = file.name.split(".").pop()?.toUpperCase() || "IMG";
    setImageFile(file);
    setRemoveImage(false);
    setErrorMessage(null);
    setImageMeta({
      name: file.name,
      size: `${ext} • ${sizeInKb} KB`,
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageUrl("");
    setRemoveImage(Boolean(item?.imageUrl));
    setImageMeta({ name: "", size: "" });
  };

  const handleAddTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(
      tags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase())
    );
  };

  const handleToggleQuickTag = (quickTag: string) => {
    const exists = tags.some(
      (t) => t.toLowerCase() === quickTag.toLowerCase()
    );
    if (exists) {
      handleRemoveTag(quickTag);
    } else {
      setTags([...tags, quickTag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Nama komunitas wajib diisi.");
      return;
    }

    const pendingTag = tagInput.trim();
    const finalTags =
      pendingTag &&
      !tags.some((t) => t.toLowerCase() === pendingTag.toLowerCase())
        ? [...tags, pendingTag]
        : tags;

    await onSave({
      name: trimmedName,
      pageLink: pageLink.trim(),
      tags: finalTags,
      imageUrl: imageFile ? "" : imageUrl.trim(),
      imageFile,
      removeImage: removeImage && !imageFile && !imageUrl.trim(),
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
      {/* NAMA */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
          NAMA <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="Nama komunitas"
          disabled={isSubmitting}
          className="w-full h-11 px-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors disabled:opacity-60"
        />
      </div>

      {/* PAGE LINK */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
          PAGE LINK
        </label>
        <input
          type="text"
          value={pageLink}
          onChange={(e) => setPageLink(e.target.value)}
          placeholder="https://chat.whatsapp.com/... atau https://discord.gg/..."
          disabled={isSubmitting}
          className="w-full h-11 px-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors disabled:opacity-60"
        />
      </div>

      {/* LINK TAGS */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
          LINK TAGS
        </label>

        <div className="w-full min-h-[44px] px-3 py-1.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg flex items-center gap-2 flex-wrap mb-3 focus-within:border-white/25 transition-colors">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-label-xs font-medium bg-deep-blue-950 border border-deep-blue-700 text-white"
            >
              <span>{t}</span>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleRemoveTag(t)}
                className="p-0.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                <XSmallIcon />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={tagInput}
            disabled={isSubmitting}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddTag(tagInput);
              } else if (
                e.key === "Backspace" &&
                !tagInput &&
                tags.length > 0
              ) {
                handleRemoveTag(tags[tags.length - 1]);
              }
            }}
            placeholder={tags.length === 0 ? "Add tags..." : ""}
            className="flex-1 min-w-[100px] h-8 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-60"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {availableTags.map((quickTag) => {
            const isTagSelected = tags.some(
              (t) => t.toLowerCase() === quickTag.toLowerCase()
            );
            return (
              <button
                key={quickTag}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleToggleQuickTag(quickTag)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-label-xs sm:text-sm font-medium border transition-colors cursor-pointer disabled:opacity-50",
                  isTagSelected
                    ? "bg-deep-blue-900 border-[#DF3848] text-white ring-1 ring-[#DF3848]/40"
                    : "bg-deep-blue-900 hover:bg-[#222534] border-white/10 text-gray-300 hover:text-white"
                )}
              >
                {quickTag}
              </button>
            );
          })}
        </div>
      </div>

      {/* IMAGE DROPZONE & URL */}
      <div className="space-y-3">
        <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
          IMAGE
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
        />

        {imageUrl ? (
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-36 h-40 rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-2.5 flex flex-col justify-between shrink-0 group">
              <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/5 bg-black/30">
                <Image
                  src={imageUrl}
                  alt="Thumbnail"
                  fill
                  unoptimized
                  sizes="144px"
                  className="object-cover object-center"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleClearImage}
                  className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-black text-gray-300 hover:text-white transition-colors cursor-pointer z-10"
                  title="Hapus gambar"
                >
                  <XSmallIcon />
                </button>
              </div>

              <div className="flex flex-col min-w-0 mt-1.5">
                <span
                  className="text-label-xs font-medium text-white truncate"
                  title={imageMeta.name || "cover_image"}
                >
                  {imageMeta.name || "cover_image"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {imageMeta.size || "Uploaded image"}
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                if (!isSubmitting) fileInputRef.current?.click();
              }}
              className="w-32 h-40 rounded-lg border border-dashed border-white/15 bg-deep-blue-900/40 hover:bg-deep-blue-900/70 hover:border-white/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all group shrink-0"
            >
              <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-semibold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors text-center">
                GANTI IMAGE
              </span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              if (!isSubmitting) fileInputRef.current?.click();
            }}
            className="w-full min-h-[140px] rounded-lg border border-dashed border-white/15 bg-deep-blue-900/40 hover:bg-deep-blue-900/70 hover:border-white/30 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group overflow-hidden relative"
          >
            <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-label-xs font-semibold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors">
              ADD IMAGE
            </span>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
            Atau masukkan URL gambar (opsional)
          </label>
          <input
            type="text"
            value={imageFile ? "" : imageUrl}
            onChange={(e) => {
              setImageFile(null);
              const val = e.target.value;
              setImageUrl(val);
              setRemoveImage(!val.trim() && Boolean(item?.imageUrl));
              setImageMeta({
                name: val.trim() ? "URL Image" : "",
                size: val.trim() ? "External URL" : "",
              });
            }}
            placeholder={
              imageFile
                ? `File terpilih: ${imageFile.name}`
                : "https://.../cover.jpg"
            }
            disabled={isSubmitting || Boolean(imageFile)}
            className="w-full h-10 px-3.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors disabled:opacity-60"
          />
        </div>
      </div>

      {/* STATUS AKTIF */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700">
        <div>
          <p className="text-sm font-semibold text-white">Status Komunitas</p>
          <p className="text-xs text-gray-400">
            {isActive
              ? "Aktif — tampil di halaman landing pengguna"
              : "Nonaktif — hanya terlihat di panel admin"}
          </p>
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setIsActive((prev) => !prev)}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shrink-0",
            isActive
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-gray-800 border-white/10 text-gray-400"
          )}
        >
          {isActive ? "Aktif" : "Nonaktif"}
        </button>
      </div>

      {errorMessage && (
        <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-2">
        <Button
          type="button"
          variant="inactive"
          size="sm"
          disabled={isSubmitting}
          onClick={onClose}
          className="px-5 py-2.5"
        >
          Batalkan
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}

export function AdminCommunityDrawer({
  isOpen,
  isSubmitting = false,
  item,
  availableTags = DEFAULT_QUICK_TAGS,
  onClose,
  onSave,
  className,
}: AdminCommunityDrawerProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const isEditing = Boolean(item);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 w-[480px] max-w-[95vw] h-full bg-deep-blue-950 border-l border-deep-blue-700 shadow-2xl flex flex-col justify-start animate-in slide-in-from-right duration-200 overflow-y-auto",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-deep-blue-700">
          <h3
            id="community-drawer-title"
            className="text-lg sm:text-xl font-bold text-white tracking-tight"
          >
            {isEditing ? "Edit Community" : "New Community"}
          </h3>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Tutup"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <AdminCommunityForm
          key={`${item?.id || "new"}-${isOpen ? "open" : "closed"}`}
          item={item}
          availableTags={availableTags}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
