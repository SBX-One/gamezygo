import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductCardRowProps } from "./ProductCardRow.types";

export function ProductCardRow({
  products,
  onAddToCart,
  threshold,
  visibleCount,
  orientation = "vertical",
  cardClassName,
  itemClassName,
  className,
  ref,
  ...props
}: ProductCardRowProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const isHorizontal = orientation === "horizontal";
  const effectiveThreshold = threshold ?? (visibleCount ?? (isHorizontal ? 2 : 4));
  const hasOverflow = products.length > effectiveThreshold;

  // Check scroll position to dynamically show/hide gradient shadows
  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const isScrollable = scrollWidth > clientWidth + 4;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(isScrollable && scrollLeft < scrollWidth - clientWidth - 6);
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
        {products.map((product) => (
          <ProductCard
            key={product.id}
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
            buttonText="Tambah Keranjang"
            href={`/store/${product.id}`}
            onActionClick={() => onAddToCart?.(product.title)}
            className={cn(isHorizontal ? "w-full" : "max-lg:pb-8xl", cardClassName)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("relative w-full group/product-row", className)}
      {...props}
    >
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
          3. NATURAL MANUAL HORIZONTAL SCROLL CONTAINER
         ======================================================== */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden no-scrollbar pb-3 pt-1 -mx-1 px-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-product-card="true"
            className={cn(
              "shrink-0 flex flex-col",
              isHorizontal
                ? "w-80 sm:w-105 lg:w-120 max-w-full"
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
              buttonText="Tambah Keranjang"
              href={`/store/${product.id}`}
              onActionClick={() => onAddToCart?.(product.title)}
              className={cn("h-full", isHorizontal ? "sm:min-w-0" : "max-lg:pb-8xl", cardClassName)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
