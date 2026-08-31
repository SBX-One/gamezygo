import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import type { BlogCardProps } from "./BlogCard.types";

export function BlogCard({
  imageSrc,
  imageAlt,
  imageSlot,
  date = "1 BULAN LALU",
  title = "Pratinjau langsung Star Wars Zero Company: Attack Astromech, permadeath, dan taktik Rube Goldberg yang mematikan dan memuaskan.",
  category = "Review & Rekomendasi",
  description = "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yan...",
  href,
  onClick,
  className,
  ref,
  ...props
}: BlogCardProps) {
  const CardContent = (
    <article
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex flex-col gap-8 p-6 rounded-2xl bg-deep-blue-900 select-none transition-all duration-150 border border-white/5",
        href || onClick ? "cursor-pointer hover:border-white/20 hover:brightness-105" : "",
        className
      )}
      {...props}
    >
      {/* 1. Cover Image (rounded-2xl) */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-deep-blue-950 shrink-0">
        {imageSlot ? (
          imageSlot
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || (typeof title === "string" ? title : "Blog cover")}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-deep-blue-950 flex items-center justify-center text-gray-500 text-body-sm rounded-2xl">
            Blog Cover Image
          </div>
        )}
      </div>

      {/* 2. Middle Content: Date + Title + Category Pill (gap-5 / 20px) */}
      <div className="flex flex-col gap-5">
        {/* Date (1 BULAN LALU) */}
        {date && (
          <span className="text-body-sm text-gray-400 uppercase tracking-wider">
            {date}
          </span>
        )}

        {/* Title */}
        <h3 className="text-body-lg font-semibold text-gray-50 tracking-normal leading-snug">
          {title}
        </h3>

        {/* Category Pill (variant="secondary" size="sm") */}
        {category && (
          <div className="w-fit">
            <Pill variant="secondary" size="sm">
              {category}
            </Pill>
          </div>
        )}
      </div>

      {/* 3. Description Bottom */}
      {description && (
        <p className="text-body-sm text-gray-400 line-clamp-3 leading-relaxed">
          {description}
        </p>
      )}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block outline-none">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
