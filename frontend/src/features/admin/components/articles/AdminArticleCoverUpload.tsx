import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AdminArticleCoverUploadProps {
  coverUrl?: string;
  onCoverChange: (url: string) => void;
  onRemoveCover?: () => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
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

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Sample cover matching Image 5 (Promo Musim Panas with tropical water & summer donut)
const SAMPLE_COVER =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

export function AdminArticleCoverUpload({
  coverUrl,
  onCoverChange,
  onRemoveCover,
  className,
}: AdminArticleCoverUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onCoverChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full select-none", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {coverUrl ? (
        /* Uploaded State: Cover Banner with 'Change Image' button (Matching Image 5) */
        <div className="relative w-full h-55 sm:h-70 rounded-lg overflow-hidden border border-white/10 group">
          <Image
            src={coverUrl}
            alt="Article thumbnail cover"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {/* Action Buttons Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {onRemoveCover && (
              <button
                type="button"
                onClick={onRemoveCover}
                aria-label="Hapus gambar"
                className="px-3 py-1.5 rounded-lg bg-deep-blue-950/85 hover:bg-rose-500/80 border border-white/20 text-xs font-medium text-white flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-colors"
              >
                <TrashIcon />
                <span>Hapus</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTriggerUpload}
              className="px-3.5 py-1.5 rounded-lg bg-deep-blue-950/85 hover:bg-deep-blue-950 border border-white/20 text-xs font-medium text-white flex items-center gap-2 backdrop-blur-md cursor-pointer transition-colors"
            >
              <ImageIcon />
              <span>Change Image</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Dashed Rectangle with + and ADD THUMBNAIL (Matching Image 3 & 4) */
        <div className="space-y-2">
          <div
            onClick={handleTriggerUpload}
            className="w-full h-45 sm:h-11xl border-2 border-dashed border-[#2F3241] hover:border-gray-400 rounded-lg bg-deep-blue-950/40 hover:bg-white/2 flex flex-col items-center justify-center gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#161823] group-hover:bg-[#1E202E] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
              <PlusIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-200 tracking-wider uppercase transition-colors">
              ADD THUMBNAIL
            </span>
          </div>

          {/* Quick preset thumbnail option */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => onCoverChange(SAMPLE_COVER)}
              className="text-[11px] text-gray-400 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
            >
              Gunakan Gambar Sampel Summer Promo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
