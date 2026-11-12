import * as React from "react";
import Image from "next/image";
import { MOCK_PRODUCT_HERO_DATA } from "../../data/admin-product-performance-mock-data";
import type { ProductHeroData } from "../../types/admin-product-performance.types";

export interface AdminProductHeroBannerProps {
  data?: ProductHeroData;
  className?: string;
}

const FALLBACK_COVER =
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg";

export function AdminProductHeroBanner({
  data = MOCK_PRODUCT_HERO_DATA,
  className,
}: AdminProductHeroBannerProps) {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const imgSrc = failedSrc === data.coverImage ? FALLBACK_COVER : data.coverImage;

  return (
    <div
      className={`flex flex-col sm:flex-row items-start  gap-6 sm:gap-8 ${
        className || ""
      }`}
    >
      {/* 1. Game Cover Poster Image (Gambar 1 Left) */}
      <div className="relative w-36 h-48 sm:w-44 sm:h-56 lg:w-55.25 lg:h-73.75 rounded-lg overflow-hidden shrink-0 shadow-2xl border border-deep-blue-700/60 bg-deep-blue-950">
        <Image
          src={imgSrc}
          alt={data.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 192px"
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={() => {
            setFailedSrc(data.coverImage);
          }}
        />
      </div>

      {/* 2. Product Details Info (Gambar 1 Right) */}
      <div className="flex flex-col  space-y-6">
        <div className="flex flex-col gap-3">

        {/* Title */}
        <h2 className="text-h4 sm:text-h3 lg:text-h2 font-semibold text-white">
          {data.title}
        </h2>

        {/* Genre Tags Row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {data.genres.map((genre) => (
            <span
            key={genre}
            className="px-3.5 py-1 rounded-full text-label-xs font-medium text-gray-300 bg-[#1A1D27] border border-deep-blue-700 select-none shadow-sm"
            >
              {genre}
            </span>
          ))}
        </div>
          </div>

        {/* Total Sold Row */}
        <div className="flex gap-2 pt-1 select-none">
          <span className="text-body-sm font-semibold text-gray-400 uppercase">
            TOTAL SOLD :
          </span>
          <span className="text-label-sm sm:text-label-md font-semibold text-white">
            {data.totalSold} sold
          </span>
        </div>
      </div>
    </div>
  );
}
