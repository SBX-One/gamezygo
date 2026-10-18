import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import type { ProductCardProps } from "./ProductCard.types";

/**
 * Steam Logo SVG (mdi_steam.svg) with size 5.5 (22px / w-5.5 h-5.5)
 */
const SteamIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5.5 h-5.5 fill-current text-gray-50 shrink-0"
    {...props}
  >
    <path
      d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C7.4 22 3.55 18.92 2.36 14.73L6.19 16.31C6.32124 16.9506 6.66949 17.5262 7.17597 17.9398C7.68245 18.3534 8.31612 18.5795 8.97 18.58C10.53 18.58 11.8 17.31 11.8 15.75V15.62L15.2 13.19H15.28C17.36 13.19 19.05 11.5 19.05 9.42C19.05 7.34 17.36 5.65 15.28 5.65C13.2 5.65 11.5 7.34 11.5 9.42V9.47L9.13 12.93L8.97 12.92C8.38 12.92 7.83 13.1 7.38 13.41L2 11.2C2.43 6.05 6.73 2 12 2ZM8.28 17.17C9.08 17.5 10 17.13 10.33 16.33C10.66 15.53 10.28 14.62 9.5 14.29L8.22 13.76C8.71 13.58 9.26 13.57 9.78 13.79C10.31 14 10.72 14.41 10.93 14.94C11.15 15.46 11.15 16.04 10.93 16.56C10.5 17.64 9.23 18.16 8.15 17.71C7.65 17.5 7.27 17.12 7.06 16.67L8.28 17.17ZM17.8 9.42C17.8 10.81 16.67 11.94 15.28 11.94C14.6134 11.9374 13.975 11.6707 13.5046 11.1984C13.0341 10.7261 12.77 10.0866 12.77 9.42C12.7687 9.09001 12.8327 8.76303 12.9584 8.4579C13.084 8.15278 13.2689 7.87555 13.5022 7.64221C13.7356 7.40887 14.0128 7.22404 14.3179 7.09837C14.623 6.9727 14.95 6.90868 15.28 6.91C15.9466 6.90999 16.5861 7.17412 17.0584 7.64455C17.5307 8.11498 17.7974 8.75339 17.8 9.42ZM13.4 9.42C13.4 10.46 14.24 11.31 15.29 11.31C16.33 11.31 17.17 10.46 17.17 9.42C17.17 8.38 16.33 7.53 15.29 7.53C14.24 7.53 13.4 8.38 13.4 9.42Z"
      fill="currentColor"
    />
  </svg>
);

export function ProductCard({
  orientation = "vertical",
  state = "default",
  imageSrc,
  imageAlt,
  imageSlot,
  platform = "Steam",
  isBestSeller = orientation === "horizontal",
  bestSellerLabel = "Best Seller",
  genres = ["Action", "Adventure"],
  title = "Assassin's Creed Black Flag Resynced",
  originalPrice = "Rp 439.000,00",
  price = "Rp 219.500",
  discount = "-30%",
  releaseDate = "Release at 5 July",
  buttonText,
  onActionClick,
  href,
  showPrice = true,
  showActionButton = true,
  className,
  ref,
  ...props
}: ProductCardProps) {
  const isHorizontal = orientation === "horizontal";
  const isUnavailable = state === "unavailable";
  const isPreOrder = state === "pre-order";

  // Action Button Rendering
  const renderActionButton = () => {
    if (isUnavailable) {
      return (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled
          className="w-full justify-center cursor-not-allowed"
          onClick={onActionClick}
        >
          {buttonText || "Tidak Tersedia"}
        </Button>
      );
    }

    if (isPreOrder) {
      return (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          rightLabel={releaseDate}
          className="w-full justify-center cursor-pointer"
          onClick={onActionClick}
        >
          {buttonText || "Pre-order"}
        </Button>
      );
    }

    // Default state: Outline MD for horizontal, Secondary SM for vertical
    if (isHorizontal) {
      return (
        <Button
          type="button"
          variant="outline"
          size="md" 
          className="w-full justify-center cursor-pointer text-xs sm:text-sm"
          onClick={onActionClick}
        >
          {buttonText || "Tambah Keranjang"}
        </Button>

      );
    }

    return (
      <Button
        type="button"
        variant="secondary"
        size="md"
        className="w-full justify-center cursor-pointer text-xs "
        onClick={onActionClick}
      >
        {buttonText || "Tambah Keranjang"}
      </Button>
    );
  };

  // Pricing & Discount sub-component
  const renderPrices = () => (
    <div className="flex items-center gap-1.5 sm:gap-4 flex-wrap">
      <div className="flex items-baseline sm:items-center justify-start gap-1 sm:gap-2 shrink-0 flex-wrap">
        {originalPrice && (
          <span className="text-[10px] sm:text-body-xs text-gray-400 line-through">
            {originalPrice}
          </span>
        )}
        <span className="text-body-xs sm:text-body-lg font-semibold leading-[140%] text-gray-50">
          {price}
        </span>
      </div>

      {discount && (
        <Pill variant="primary" size="xs">
          {discount}
        </Pill>
      )}
    </div>
  );

  const router = useRouter();

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      props.onClick?.(e);
      return;
    }
    if (href) {
      router.push(href);
    }
    props.onClick?.(e);
  };

  // Horizontal Card Layout
  if (isHorizontal) {
    return (
      <div
        ref={ref}
        onClick={handleContainerClick}
        className={cn(
          "flex flex-col sm:flex-row gap-4 sm:gap-6 p-3 items-stretch rounded-lg bg-deep-blue-900 border border-white/5 select-none transition-all duration-150 w-full min-w-0 max-w-full h-auto min-h-55 sm:min-h-65 shrink-0 overflow-hidden",
          href && "cursor-pointer hover:border-white/20 hover:scale-[1.01]",
          className
        )}
        {...props}
      >
        {/* Left: Game Cover */}
        <div className="w-full sm:w-44 md:w-48 lg:w-44 xl:w-44 h-47.5 sm:h-auto aspect-video sm:aspect-3/4 rounded-lg overflow-hidden relative bg-deep-blue-950 shrink-0 self-stretch">
          {/* Cover Image */}
          {imageSlot ? (
            imageSlot
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt || (typeof title === "string" ? title : "Game cover")}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/assets/png/")) {
                  target.src = "/assets/png/Banner.png";
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-deep-blue-950 flex items-center justify-center text-gray-500 text-body-xs">
              Cover Game
            </div>
          )}

          {/* Badges Overlay at Top */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            {/* Steam Platform Badge */}
            {platform && (
              <div className="flex items-center gap-1.5 drop-shadow-md">
                <SteamIcon />
                <span className="text-body-xs font-semibold text-gray-50">
                  {platform}
                </span>
              </div>
            )}

            {/* Best Seller Pill */}
            {isBestSeller && (
              <Pill variant="primary" size="xs" className="">
                {bestSellerLabel}
              </Pill>
            )}
          </div>
        </div>

        {/* Right: Content Column */}
        <div className="flex flex-col justify-between flex-1 self-stretch min-w-0 py-1 gap-2.5 sm:gap-3">
          {/* Top Block: Title & Genres */}
          <div className="flex flex-col gap-2 sm:gap-3 pt-1">
            {/* 1. Title Game */}
            {href ? (
              <Link
                href={href}
                className="text-xs sm:text-h6 font-semibold text-gray-50 hover:text-gray-50 line-clamp-2 transition-colors outline-none leading-tight sm:leading-snug"
              >
                {title}
              </Link>
            ) : (
              <h4 className="text-xs sm:text-h6 font-semibold text-gray-50 leading-tight sm:leading-[120%] line-clamp-2">
                {title}
              </h4>
            )}

            {/* 2. Genres Pills */}
            {genres && genres.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {genres.map((genre, idx) => (
                  <Pill key={idx} variant="secondary" size="xs" className="px-3">
                    {genre}
                  </Pill>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Block: Prices & Action Button */}
          <div className="flex flex-col justify-center gap-2 sm:gap-2.5 mt-auto pt-2">
            {showPrice && price && renderPrices()}
            {renderActionButton()}
          </div>
        </div>
      </div>
    );
  }

  // Vertical Card Layout (Optimized for 2-column mobile and 4-column desktop)
  return (
    <div
      ref={ref}
      onClick={handleContainerClick}
      className={cn(
        "flex flex-col justify-between h-full gap-2.5 sm:gap-4 lg:gap-6 w-full bg-transparent select-none transition-all duration-150",
        href && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {/* 1. Game Cover Image */}
      <div className="w-full aspect-3/4 rounded-lg overflow-hidden relative bg-deep-blue-950 shrink-0">
        {imageSlot ? (
          imageSlot
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || (typeof title === "string" ? title : "Game cover")}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-deep-blue-950 flex items-center justify-center text-gray-500 text-body-xs">
            Cover Game
          </div>
        )}

        {/* Badges Overlay at Top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {platform && (
            <div className="flex items-center gap-1.5 drop-shadow-md">
              <SteamIcon />
              <span className="text-body-xs font-semibold text-gray-50">
                {platform}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Genres Pills */}
      {genres && genres.length > 0 && (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {genres.map((genre, idx) => (
            <Pill key={idx} variant="secondary" size="xs">
              {genre}
            </Pill>
          ))}
        </div>
      )}

      {/* 3. Title & Pricing block */}
      <div className="flex flex-col gap-1.5 sm:gap-3 lg:gap-4">
        {/* Title */}
        {href ? (
          <Link
            href={href}
            className="text-xs sm:text-body-sm font-semibold text-gray-50 hover:text-gray-50 line-clamp-2 transition-colors outline-none leading-tight sm:leading-snug"
          >
            {title}
          </Link>
        ) : (
          <h4 className="text-xs sm:text-body-sm font-semibold text-gray-50 line-clamp-2 leading-tight sm:leading-snug">
            {title}
          </h4>
        )}

        {/* Pricing & Discount */}
        {showPrice && price && renderPrices()}
      </div>

      {/* 4. Action Button */}
      {showActionButton && <div>{renderActionButton()}</div>}
    </div>
  );
}
