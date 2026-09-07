import * as React from "react";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import type {
  TestimonialCardProps,
  TestimonialImage,
} from "./TestimonialCard.types";

/**
 * Fluent Star Filled Icon from assets (fluent_star-24-filled.svg)
 */
const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current text-gray-50 shrink-0"
    {...props}
  >
    <path
      d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198Z"
      fill="currentColor"
    />
  </svg>
);

export function TestimonialCard({
  avatarSrc,
  avatarAlt,
  avatarSlot,
  rating = "5 Star",
  review = '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
  images,
  userName = "Dyven Siauw",
  gameName = "Black Myth Wukong, 2+",
  className,
  ref,
  ...props
}: TestimonialCardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col p-6 rounded-2xl bg-deep-blue-900 border border-white/5 select-none transition-all duration-150 w-full",
        className
      )}
      {...props}
    >
      {/* 1. Header Row: Avatar (w-12 h-12) & 5 Star Pill (primary sm) */}
      <div className="flex items-center justify-between gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-deep-blue-950 border border-gradient-secondary shrink-0 flex items-center justify-center">
          {avatarSlot ? (
            avatarSlot
          ) : avatarSrc ? (
            <img
              src={avatarSrc}
              alt={avatarAlt || (typeof userName === "string" ? userName : "User Avatar")}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-tr from-amber-900 via-rose-900 to-deep-blue-700 flex items-center justify-center text-label-sm font-bold text-gray-50">
              {typeof userName === "string" ? userName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        {/* 5 Star Pill Primary Small */}
        {rating && (
          <Pill
            variant="primary"
            size="sm"
            rightIcon={<StarFilledIcon />}
          >
            {rating}
          </Pill>
        )}
      </div>

      {/* 2. Review Text Quote (gap-8 / 32px from header) */}
      <blockquote className="mt-8 text-body-lg text-gray-400 font-normal leading-relaxed">
        {review}
      </blockquote>

      {/* 3. Screenshot Images Gallery (rounded-lg with border-gradient-secondary, gap-8 / 32px from review) */}
      {images !== false && (
        <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {Array.isArray(images) && images.length > 0 ? (
            images.map((item, index) => {
              const src = typeof item === "string" ? item : item?.src;
              const alt =
                typeof item === "string"
                  ? `Screenshot ${index + 1}`
                  : item?.alt || `Screenshot ${index + 1}`;
              const key = typeof item === "string" ? index : item?.id || index;

              return (
                <div
                  key={key}
                  className="aspect-video w-24 sm:w-28 rounded-lg overflow-hidden border-gradient-secondary shrink-0 bg-deep-blue-950 flex items-center justify-center relative"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={alt}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-deep-blue-950 via-deep-blue-900/60 to-deep-blue-800/40 animate-pulse flex items-center justify-center">
                      <div className="w-6 h-4 rounded bg-white/5 border border-white/5" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Default 3 Skeleton Screenshot Placeholders */
            [1, 2, 3].map((num) => (
              <div
                key={num}
                className="aspect-video w-24 sm:w-28 rounded-lg overflow-hidden border-gradient-secondary shrink-0 bg-deep-blue-950 flex items-center justify-center relative"
              >
                <div className="w-full h-full bg-linear-to-tr from-deep-blue-950 via-deep-blue-900/60 to-deep-blue-800/40 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-4 rounded bg-white/5 border border-white/5" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. User Info Block: mt-16 (64px), pl-6, border-l-2, User Name (body lg semibold text-gray-200) + Game Name (body md text-gray-400), gap-2 */}
      <div className="mt-16 border-l-2 border-deep-blue-700/60 pl-6 flex flex-col gap-2">
        <h4 className="text-body-lg font-semibold text-gray-200">
          {userName}
        </h4>
        {gameName && (
          <p className="text-body-md font-normal text-gray-400">
            {gameName}
          </p>
        )}
      </div>
    </div>
  );
}
