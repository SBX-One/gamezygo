import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminCommunityItem } from "../../types/admin-community.types";

export interface AdminCommunityDrawerProps {
  isOpen: boolean;
  item?: AdminCommunityItem | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    pageLink: string;
    tag: string;
    imageUrl: string;
  }) => void;
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

const QUICK_TAGS = ["Whatsapp", "Telegram", "Discord"];

export function AdminCommunityDrawer({
  isOpen,
  item,
  onClose,
  onSave,
  className,
}: AdminCommunityDrawerProps) {
  const [name, setName] = React.useState("");
  const [pageLink, setPageLink] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(["Whatsapp"]);
  const [tagInput, setTagInput] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageMeta, setImageMeta] = React.useState<{
    name: string;
    size: string;
  }>({
    name: "gta5_cover.png",
    size: "PNG • 820 KB",
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (item) {
      setName(item.name || "");
      setPageLink(item.pageLink || "");
      // Parse tags (comma separated or single)
      const existingTags = item.tag
        ? item.tag.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Whatsapp"];
      setTags(existingTags.length > 0 ? existingTags : ["Whatsapp"]);
      setTagInput("");
      setImageUrl(
        item.imageUrl ||
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg"
      );
      setImageMeta({
        name: "gta5_cover.png",
        size: "PNG • 820 KB",
      });
    } else {
      setName("");
      setPageLink("");
      setTags([]);
      setTagInput("");
      setImageUrl("");
      setImageMeta({
        name: "",
        size: "",
      });
    }
  }, [item, isOpen]);

  // Handle ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInKb = Math.round(file.size / 1024);
    const ext = file.name.split(".").pop()?.toUpperCase() || "PNG";
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

  const handleAddTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleToggleQuickTag = (quickTag: string) => {
    if (tags.includes(quickTag)) {
      handleRemoveTag(quickTag);
    } else {
      setTags([...tags, quickTag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTags =
      tags.length > 0
        ? tags.join(", ")
        : tagInput.trim()
        ? tagInput.trim()
        : "Whatsapp";

    onSave({
      name: name.trim() || "Komunitas GTA | Gamezygo",
      pageLink: pageLink.trim() || "https://chat.whatsapp.com",
      tag: finalTags,
      imageUrl:
        imageUrl ||
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    });
  };

  const isEditing = Boolean(item);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans"
    >
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-over Drawer Panel matching Images 3 & 4 */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 w-[480px] max-w-[95vw] h-full bg-deep-blue-950 border-l border-deep-blue-700 shadow-2xl flex flex-col justify-start animate-in slide-in-from-right duration-200 overflow-y-auto",
          className
        )}
      >
        {/* Header: Title and Close Button */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-deep-blue-700">
          <h3
            id="community-drawer-title"
            className="text-lg sm:text-xl font-bold text-white tracking-tight"
          >
            {isEditing ? "Edit Community" : "New Community"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body matching Images 3 & 4 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
          {/* NAMA */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              NAMA
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama komunitas"
              className="w-full h-11 px-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
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
              placeholder="Halaman destinasi"
              className="w-full h-11 px-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* LINK TAGS (Matching Image 4 with interactive tag chips inside input + buttons below) */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              LINK TAGS
            </label>

            {/* Input with chips */}
            <div className="w-full min-h-[44px] px-3 py-1.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg flex items-center gap-2 flex-wrap mb-3 focus-within:border-white/25 transition-colors">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-label-xs font-medium bg-deep-blue-950 border border-deep-blue-700 text-white"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="p-0.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <XSmallIcon />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                    handleRemoveTag(tags[tags.length - 1]);
                  }
                }}
                placeholder={tags.length === 0 ? "Add tags..." : ""}
                className="flex-1 min-w-[100px] h-8 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Quick Tag Pills: Whatsapp, Telegram, Discord (Matching Images 3 & 4) */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {QUICK_TAGS.map((quickTag) => {
                const isActive = tags.includes(quickTag);
                return (
                  <button
                    key={quickTag}
                    type="button"
                    onClick={() => handleToggleQuickTag(quickTag)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-label-xs sm:text-sm font-medium border transition-colors cursor-pointer",
                      isActive
                        ? "bg-[#181A26] border-[#DF3848] text-white ring-1 ring-[#DF3848]/40"
                        : "bg-[#181A26] hover:bg-[#222534] border-white/10 text-gray-300 hover:text-white"
                    )}
                  >
                    {quickTag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* IMAGE DROPZONE (Matching Image 3 & Image 4) */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
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
              /* Image 4 State: Uploaded Image Card + Adjacent Add Image button */
              <div className="flex items-center gap-3 w-full">
                {/* Uploaded Image Card */}
                <div className="relative w-36 h-40 rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-2.5 flex flex-col justify-between shrink-0 group">
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/5 bg-black/30">
                    <img
                      src={imageUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover object-center"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImageMeta({ name: "", size: "" });
                      }}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-black text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Hapus gambar"
                    >
                      <XSmallIcon />
                    </button>
                  </div>

                  <div className="flex flex-col min-w-0 mt-1.5">
                    <span
                      className="text-label-xs font-medium text-white truncate"
                      title={imageMeta.name || "cover_image.png"}
                    >
                      {imageMeta.name || "cover_image.png"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {imageMeta.size || "PNG • 820 KB"}
                    </span>
                  </div>
                </div>

                {/* Adjacent Dashed Add Image Card matching Image 4 */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-40 rounded-lg border border-dashed border-white/15 bg-[#181A26]/40 hover:bg-[#181A26]/70 hover:border-white/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all group shrink-0"
                >
                  <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-semibold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors text-center">
                    ADD IMAGE
                  </span>
                </div>
              </div>
            ) : (
              /* Image 3 State: Full-width Dashed Dropzone */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[160px] rounded-lg border border-dashed border-white/15 bg-[#181A26]/40 hover:bg-[#181A26]/70 hover:border-white/30 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group overflow-hidden relative"
              >
                <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-label-xs font-semibold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors">
                  ADD IMAGE
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: [ Batalkan ] & [ Simpan ] */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="inactive"
              size="sm"
              onClick={onClose}
              className="px-5 py-2.5"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
