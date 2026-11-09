import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import { TrashIcon } from "./AdminSectionIcons";
import type { SectionProduct } from "../../../types/admin-section.types";

export interface AdminSectionGameCardProps {
  product: SectionProduct;
  onRemove?: () => void;
  className?: string;
}

export function AdminSectionGameCard({
  product,
  onRemove,
  className,
}: AdminSectionGameCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-[175px] sm:w-[190px] shrink-0 group select-none transition-transform duration-200",
        className
      )}
    >
      {/* 1. Portrait Poster Image Container */}
      <div className="relative w-full h-[245px] sm:h-[260px] rounded-lg overflow-hidden bg-deep-blue-900 border border-deep-blue-700 shadow-lg group-hover:border-deep-blue-500 transition-all">
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 175px, 190px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Subtle Dark Gradient Overlay at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Remove Game Button (visible on hover) */}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove from section"
            className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-deep-blue-950/80 hover:bg-rose-600/90 text-gray-300 hover:text-white border border-deep-blue-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md hover:scale-105"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Category Pills (Matching Image 2: "Action", "Adventure") */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 min-h-[22px]">
        {product.categories.slice(0, 2).map((cat, catIdx) => (
          <Pill
            key={`${product.id}-${cat}-${catIdx}`}
            variant="secondary"
            size="xs"
          >
            {cat}
          </Pill>
        ))}
      </div>

      {/* 3. Game Title */}
      <h4 className="mt-2 text-label-xs sm:text-[13px] font-semibold text-gray-50 tracking-normal leading-snug line-clamp-2 title-hover group-hover:text-deep-blue-100 transition-colors">
        {product.title}
      </h4>
    </div>
  );
}
