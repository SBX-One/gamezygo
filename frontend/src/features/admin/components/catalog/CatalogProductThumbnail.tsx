import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/utils/image-url";

export interface CatalogProductThumbnailProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const GamepadCoverIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("w-4 h-4 text-gray-500", className)}
  >
    <rect x="2" y="6" width="20" height="12" rx="4" />
    <path d="M6 12h4" />
    <path d="M8 10v4" />
    <circle cx="15" cy="11" r="1" fill="currentColor" />
    <circle cx="18" cy="13" r="1" fill="currentColor" />
  </svg>
);

export function CatalogProductThumbnail({
  src,
  alt,
  size = "md",
  className,
}: CatalogProductThumbnailProps) {
  const [hasError, setHasError] = React.useState(false);

  const cleanSrc = React.useMemo(() => {
    if (!src || hasError) return null;
    const resolved = resolveImageUrl(src);
    const lower = resolved.toLowerCase();
    // If backend returns placehold.co, via.placeholder, or invalid storage, use clean SVG poster
    if (
      lower.includes("placehold.co") ||
      lower.includes("via.placeholder") ||
      lower.includes("placeholder.com") ||
      lower.includes("dummyimage.com") ||
      lower.includes("placeholder") ||
      lower.endsWith("/storage/") ||
      lower.endsWith("/storage") ||
      lower.includes("text=")
    ) {
      return null;
    }
    return resolved;
  }, [src, hasError]);

  const sizeClasses = {
    sm: "w-8 h-10 rounded-md", // 32px x 40px - clean portrait poster
    md: "w-9 h-12 rounded-lg", // 36px x 48px - standard 3:4 game box ratio
    lg: "w-12 h-16 rounded-lg", // 48px x 64px
  }[size];

  if (!cleanSrc) {
    return (
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center bg-gradient-to-b from-[#1E202B] to-[#14151E] border border-deep-blue-700/80 select-none shadow-sm",
          sizeClasses,
          className
        )}
        title={alt}
      >
        <GamepadCoverIcon className="w-4 h-4 text-indigo-400/80" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-[#1E202B] border border-deep-blue-700 select-none shadow-sm group-hover:border-deep-blue-500 transition-colors",
        sizeClasses,
        className
      )}
    >
      <Image
        src={cleanSrc}
        alt={alt}
        fill
        sizes="96px"
        unoptimized
        onError={() => setHasError(true)}
        className="object-cover object-center transition-transform duration-200"
        style={{
          imageRendering: "auto",
        }}
      />
    </div>
  );
}

