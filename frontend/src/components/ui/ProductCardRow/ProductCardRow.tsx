import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductCardRowProps } from "./ProductCardRow.types";

export function ProductCardRow({
  products,
  onAddToCart,
  threshold = 4,
  cardClassName,
  className,
  ref,
  ...props
}: ProductCardRowProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const hasOverflow = products.length > threshold;

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
          "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5",
          className
        )}
        {...props}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            imageSrc={product.imageSrc}
            genres={product.genres}
            originalPrice={product.originalPrice}
            price={product.price}
            discount={product.discount}
            platform={product.platform}
            href={`/store/${product.id}`}
            onActionClick={() => onAddToCart?.(product.title)}
            className={cn("max-lg:pb-8xl", cardClassName)}
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
          "pointer-events-none absolute -left-4 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-deep-blue-950 via-deep-blue-950/80 to-transparent z-20 transition-opacity duration-300",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      {/* ========================================================
          2. RIGHT GRADIENT SHADOW (Affordance for >4 items)
         ======================================================== */}
      <div
        className={cn(
          "pointer-events-none absolute -right-4 top-0 bottom-0 w-20 sm:w-32 lg:w-44 bg-gradient-to-l from-deep-blue-950 via-deep-blue-950/85 to-transparent z-20 transition-opacity duration-300",
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
        className="flex gap-3 sm:gap-5 overflow-x-auto overflow-y-hidden no-scrollbar pb-3 pt-1 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[240px] sm:w-[calc(50%-10px)] lg:w-[calc((100%-45px)/4)] shrink-0 flex flex-col"
          >
            <ProductCard
              title={product.title}
              imageSrc={product.imageSrc}
              genres={product.genres}
              originalPrice={product.originalPrice}
              price={product.price}
              discount={product.discount}
              platform={product.platform}
              href={`/store/${product.id}`}
              onActionClick={() => onAddToCart?.(product.title)}
              className={cn("h-full max-lg:pb-8xl", cardClassName)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
