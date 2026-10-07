import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { ItemProps } from "./Item.types";

/**
 * Trash Can Icon (16px / w-4 h-4)
 */
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Item({
  id,
  title,
  imageSrc,
  imageAlt,
  discount,
  originalPrice,
  price,
  onBuyNow,
  onDelete,
  buyNowText = "Beli Sekarang",
  className,
  ref,
  ...props
}: ItemProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full bg-surface-secondary-default rounded-lg p-2 flex items-stretch gap-3 sm:gap-4 transition-all duration-150 hover:border-white/20 select-none",
        className
      )}
      {...props}
    >
      {/* 1. KIRI: Cover Game (min-w: 65px, height menyesuaikan / self-stretch) */}
      <div className="w-16.25 sm:min-h-17.5 self-stretch rounded-md overflow-hidden shrink-0 bg-deep-blue-950 relative flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || (typeof title === "string" ? title : "Game cover")}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-label-xs">
            Game
          </div>
        )}
      </div>

      {/* 2. KANAN: Content area (Pojok kiri atas: Judul & Pill, Pojok bawah kanan: Harga & Tombol) */}
      <div className="flex flex-col justify-between flex-1 min-w-0 self-stretch gap-2 py-3">
        {/* Pojok Kiri Atas: Judul & Pill Diskon */}
        <div className="flex flex-col items-start gap-1.5 self-start">
          <h3 className="text-body-md font-semibold text-gray-50 ">
            {title}
          </h3>

       
        </div>
        <div className="flex  justify-between">

   {discount && (
     <Pill
     variant="primary"
     size="xs"
              className="px-3"
            >
              {discount}
            </Pill>
          )}
        {/* Pojok Bawah Kanan: Harga + Tombol Beli Sekarang + Tombol Trash */}
        <div className="flex items-center justify-end flex-wrap sm:flex-nowrap gap-3 sm:gap-4 self-end mt-auto">
          {/* Kolom Harga dengan text-right dan items-end */}
          <div className="flex flex-col items-end text-right leading-tight shrink-0">
            {originalPrice && (
              <span className="text-body-xs text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-body-sm font-semibold text-gray-50">
              {price}
            </span>
          </div>

          {/* Tombol Beli Sekarang */}
          {onBuyNow && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBuyNow}
            >
              {buyNowText}
            </Button>
          )}

          {/* Tombol Hapus (Trash) */}
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              aria-label={`Hapus ${typeof title === "string" ? title : "item"}`}
              className="w-10 h-10 "
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
            </div>
        </div>
      </div>
    </div>
  );
}
