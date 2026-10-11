import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AdminAddProductMediaUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  className?: string;
}

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

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 6h16" />
    <path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export function AdminAddProductMediaUpload({
  value,
  onChange,
  className,
}: AdminAddProductMediaUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange?.(url);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-[#2F2F37] hover:border-gray-500 bg-[#15161D]/60 transition-all cursor-pointer flex flex-col items-center justify-center p-6 select-none group overflow-hidden shadow-sm",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={value}
            alt="Product cover preview"
            fill
            unoptimized
            className="object-cover"
          />
          {/* Overlay hover actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <span className="text-xs font-medium text-white px-3.5 py-1.5 rounded-lg bg-[#1E202B] border border-deep-blue-700 shadow-md">
              Ganti Gambar
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
              aria-label="Hapus Gambar"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-200 transition-colors">
          <PlusIcon className="w-10 h-10 mb-3 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-400 group-hover:text-gray-200">
            ADD IMAGE
          </span>
        </div>
      )}
    </div>
  );
}
