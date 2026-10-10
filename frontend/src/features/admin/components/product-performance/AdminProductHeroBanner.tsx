import * as React from "react";
import Image from "next/image";
import { MOCK_PRODUCT_HERO_DATA } from "../../data/admin-product-performance-mock-data";
import type { ProductHeroData } from "../../types/admin-product-performance.types";

export interface AdminProductHeroBannerProps {
  data?: ProductHeroData;
  className?: string;
}

export function AdminProductHeroBanner({
  data = MOCK_PRODUCT_HERO_DATA,
  className,
}: AdminProductHeroBannerProps) {
  const [imgSrc, setImgSrc] = React.useState(data.coverImage);

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 ${
        className || ""
      }`}
    >
      {/* 1. Game Cover Poster Image (Gambar 1 Left) */}
      <div className="relative w-36 h-48 sm:w-44 sm:h-56 lg:w-48 lg:h-64 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-deep-blue-700/60 bg-deep-blue-950">
        <Image
          src={imgSrc}
          alt={data.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 192px"
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={() => {
            // Fallback to Steam app 475550 Beholder library cover
            setImgSrc(
              "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg"
            );
          }}
        />
      </div>

      {/* 2. Product Details Info (Gambar 1 Right) */}
      <div className="flex flex-col justify-center space-y-4">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
          {data.title}
        </h2>

        {/* Genre Tags Row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {data.genres.map((genre) => (
            <span
              key={genre}
              className="px-3.5 py-1 rounded-full text-xs font-medium text-gray-300 bg-[#1A1D27] border border-deep-blue-700 select-none shadow-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Total Sold Row */}
        <div className="flex items-center gap-2 pt-1 select-none">
          <span className="text-xs font-semibold text-gray-400 uppercase">
            TOTAL SOLD :
          </span>
          <span className="text-sm sm:text-base font-bold text-white">
            {data.totalSold} sold
          </span>
        </div>
      </div>
    </div>
  );
}
