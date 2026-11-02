import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductCardRowProps } from "./ProductCardRow.types";

/**
 * Chevron Left Icon (24x24)
 */
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Chevron Right Icon (24x24)
 */
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ProductCardRow({
  products,
  onAddToCart,
  threshold,
  visibleCount,
  orientation = "vertical",
  showScrollIndicator = true,
  cardClassName,
  itemClassName,
  className,
  ref,
  ...props
}: ProductCardRowProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [thumbRatio, setThumbRatio] = React.useState(0.25);
  const [isScrollable, setIsScrollable] = React.useState(false);

  const isHorizontal = orientation === "horizontal";
  const effectiveThreshold = threshold ?? (visibleCount ?? (isHorizontal ? 2 : 4));
  const hasOverflow = products.length > effectiveThreshold;

  // Check scroll position to dynamically show/hide gradient shadows and update scroll-x indicator
  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const scrollable = maxScroll > 4;
    setIsScrollable(scrollable);
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollable && scrollLeft < maxScroll - 6);

    if (scrollable && maxScroll > 0) {
      const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      setScrollProgress(progress);
      const ratio = Math.max(0.15, Math.min(0.5, clientWidth / scrollWidth));
      setThumbRatio(ratio);
    } else {
      setScrollProgress(0);
      setThumbRatio(0.25);
    }
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();

    const handleResize = () => checkScroll();
    const observer = new ResizeObserver(handleResize);
    observer.observe(el);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScroll, products]);

  // Smooth scroll by direction helper
  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Interactive drag or click on progress track
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    track.setPointerCapture(e.pointerId);

    const updateScrollFromPointer = (clientX: number) => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = ratio * maxScroll;
    };

    updateScrollFromPointer(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      updateScrollFromPointer(ev.clientX);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  // If products length is <= threshold, render standard static grid without scroll
  if (!hasOverflow) {
    return (
      <div
        ref={ref}
        className={cn(
          isHorizontal
            ? "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            : visibleCount === 5
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5"
              : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5",
          className
        )}
        {...props}
      >
        {products.map((product, idx) => (
          <ProductCard
            key={`pcr-card-${product.id}-${idx}`}
            data-product-card="true"
            orientation={orientation}
            title={product.title}
            imageSrc={product.imageSrc}
            genres={product.genres}
            originalPrice={product.originalPrice}
            price={product.price}
            discount={product.discount}
            platform={product.platform}
            isBestSeller={product.isBestSeller ?? false}
            buttonText={product.buttonText || "Tambah Keranjang"}
            isActionDisabled={product.isActionDisabled}
            href={`/store/${product.slug || product.id}`}
            onActionClick={() => !product.isActionDisabled && onAddToCart?.(product.title)}
            className={cn(isHorizontal ? "w-full" : "max-lg:pb-8xl", cardClassName)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("relative w-full flex flex-col gap-2 group/product-row", className)}
      {...props}
    >
      {/* Container wrapper for cards + shadows + floating side navigation */}
      <div className="relative w-full">
        {/* ========================================================
            1. LEFT GRADIENT SHADOW (Affordance for scrolled left)
           ======================================================== */}
        <div
          className={cn(
            "pointer-events-none absolute -left-4 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-r from-deep-blue-950 via-deep-blue-950/80 to-transparent z-20 transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />

        {/* ========================================================
            2. RIGHT GRADIENT SHADOW (Affordance for more items)
           ======================================================== */}
        <div
          className={cn(
            "pointer-events-none absolute -right-4 top-0 bottom-0 bg-linear-to-l from-deep-blue-950 via-deep-blue-950/85 to-transparent z-20 transition-opacity duration-300",
            visibleCount === 5 ? "w-16 sm:w-24 lg:w-32" : "w-20 sm:w-32 lg:w-44",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />

        {/* ========================================================
            3. FLOATING SIDE ARROWS (Desktop & Tablet on hover)
           ======================================================== */}
        {isScrollable && (
          <>
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              aria-label="Geser ke kiri"
              className={cn(
                "hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-deep-blue-950/90 hover:bg-deep-blue-900 border border-white/20 backdrop-blur-md text-gray-50 items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none",
                canScrollLeft
                  ? "opacity-0 group-hover/product-row:opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              aria-label="Geser ke kanan"
              className={cn(
                "hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-deep-blue-950/90 hover:bg-deep-blue-900 border border-white/20 backdrop-blur-md text-gray-50 items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none",
                canScrollRight
                  ? "opacity-0 group-hover/product-row:opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* ========================================================
            4. NATURAL MANUAL HORIZONTAL SCROLL CONTAINER
           ======================================================== */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth pb-3 pt-1 -mx-1 px-1"
        >
          {products.map((product, idx) => (
            <div
              key={`pcr-wrap-${product.id}-${idx}`}
              data-product-card="true"
              className={cn(
                "shrink-0 flex flex-col",
                isHorizontal
                  ? "w-80 sm:w-140 max-w-full"
                  : visibleCount === 5
                    ? "w-52 sm:w-[calc(50%-12px)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-96px)/5)]"
                    : "w-60 sm:w-[calc(50%-10px)] lg:w-[calc((100%-45px)/4)]",
                itemClassName
              )}
            >
              <ProductCard
                orientation={orientation}
                title={product.title}
                imageSrc={product.imageSrc}
                genres={product.genres}
                originalPrice={product.originalPrice}
                price={product.price}
                discount={product.discount}
                platform={product.platform}
                isBestSeller={product.isBestSeller ?? false}
                buttonText={product.buttonText || "Tambah Keranjang"}
                isActionDisabled={product.isActionDisabled}
                href={`/store/${product.slug || product.id}`}
                onActionClick={() => !product.isActionDisabled && onAddToCart?.(product.title)}
                className={cn("h-full", isHorizontal ? "sm:min-w-0" : "max-lg:pb-8xl", cardClassName)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          5. SCROLL-X PROGRESS INDICATOR (Horizontal Scroll Bar)
         ======================================================== */}
      {showScrollIndicator && isScrollable && (
        <div className="flex items-center justify-center gap-3 pt-2 pb-1 select-none">
          {/* Small Left Arrow */}
          {/* <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Geser ke kiri"
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed",
              !canScrollLeft && "pointer-events-none"
            )}
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </button> */}

          {/* Interactive Progress Track */}
          <div
            onPointerDown={handleTrackPointerDown}
            className="relative w-36 sm:w-1/4 h-1.5 bg-white/10 hover:bg-white/15 rounded-full overflow-hidden cursor-pointer transition-colors p-0"
            role="scrollbar"
            aria-orientation="horizontal"
            aria-valuenow={Math.round(scrollProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Indikator scroll horizontal produk"
          >
            {/* Active Moving Gradient Thumb */}
            <div
              className="absolute top-0 bottom-0 bg-border-primary-default rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
              style={{
                left: `${scrollProgress * (100 - thumbRatio * 100)}%`,
                width: `${thumbRatio * 100}%`,
              }}
            />
          </div>

          {/* Small Right Arrow */}
          {/* <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Geser ke kanan"
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed",
              !canScrollRight && "pointer-events-none"
            )}
          >
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button> */}
        </div>
      )}
    </div>
  );
}
