import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminAnnouncementItem } from "../../types/admin-announcement.types";

export interface AdminAnnouncementDrawerProps {
  isOpen: boolean;
  item?: AdminAnnouncementItem | null;
  onClose: () => void;
  onSave: (data: {
    pageLink: string;
    imageUrl: string;
    isPublished: boolean;
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

export function AdminAnnouncementDrawer({
  isOpen,
  item,
  onClose,
  onSave,
  className,
}: AdminAnnouncementDrawerProps) {
  const [pageLink, setPageLink] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (item) {
      setPageLink(item.pageLink);
      setImageUrl(item.imageUrl);
      setIsPublished(item.isPublished);
    } else {
      setPageLink("");
      // Default to the promo banner if creating fresh
      setImageUrl("/assets/png/Banner.png");
      setIsPublished(true);
    }
  }, [item, isOpen]);

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
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      pageLink: pageLink.trim() || "Page Link",
      imageUrl: imageUrl || "/assets/png/Banner.png",
      isPublished,
    });
  };

  const isEditing = Boolean(item);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans"
    >
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-over Drawer Panel (Matching Image 4) */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 w-[500px] max-w-[95vw] h-full bg-deep-blue-950 border-l border-deep-blue-700 shadow-2xl flex flex-col justify-start animate-in slide-in-from-right duration-200 overflow-y-auto",
          className
        )}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-deep-blue-700">
          <h3
            id="announcement-drawer-title"
            className="text-lg sm:text-xl font-bold text-white tracking-tight"
          >
            {isEditing ? "Edit Announcement" : "New Announcement"}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
          {/* PAGE LINK */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              PAGE LINK
            </label>
            <input
              type="text"
              value={pageLink}
              onChange={(e) => setPageLink(e.target.value)}
              placeholder="Pertanyaan"
              className="w-full h-11 px-4 bg-[#181A26] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* ANSWER / IMAGE UPLOAD */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              ANSWER
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[160px] rounded-lg border border-dashed border-white/15 bg-[#181A26]/40 hover:bg-[#181A26]/70 hover:border-white/30 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group overflow-hidden relative"
            >
              {imageUrl ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-white/10 group-hover:opacity-90 transition-opacity">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 rounded-lg bg-black/70 text-label-xs font-medium text-white border border-white/20">
                      Ganti Gambar
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-label-xs font-semibold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors">
                    ADD IMAGE
                  </span>
                </>
              )}
            </div>
          </div>

          {/* PUBLISH TOGGLE */}
          <div
            onClick={() => setIsPublished(!isPublished)}
            className="flex items-center gap-2.5 cursor-pointer select-none self-start"
            role="switch"
            aria-checked={isPublished}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsPublished(!isPublished);
              }
            }}
          >
            <div
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-white/10 bg-[#181A26] p-0.5 transition-colors"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full transition-transform shadow-xs",
                  isPublished
                    ? "translate-x-4 bg-[#DF3848]"
                    : "translate-x-0 bg-gray-500"
                )}
              />
            </div>
            <span className="text-label-xs sm:text-sm font-medium text-white">
              Publish
            </span>
          </div>

          {/* Action Buttons: [ Batalkan ] & [ Simpan ] */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="inactive"
              size="sm"
              onClick={onClose}
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
