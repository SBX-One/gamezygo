import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../Button";

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
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

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
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

export interface FilterBadgeSwiperProps {
  children: React.ReactNode;
  onClearAll?: () => void;
  clearAllLabel?: string;
  className?: string;
}

export function FilterBadgeSwiper({
  children,
  onClearAll,
  clearAllLabel = "Hapus semua",
  className,
}: FilterBadgeSwiperProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => checkScroll());
      observer.observe(el);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [checkScroll, children]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 240;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 max-w-full min-w-0 select-none",
        className
      )}
    >
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="shrink-0 w-8 h-8 rounded-lg bg-[image:var(--gradient-surface-secondary-default)] border border-white/10 hover:border-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-10"
          aria-label="Geser filter ke kiri"
        >
          <ChevronLeftIcon />
        </button>
      )}

      {/* Horizontal Badges Track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth no-scrollbar py-1 shrink min-w-0"
      >
        {children}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="shrink-0 w-8 h-8 rounded-lg bg-[image:var(--gradient-surface-secondary-default)] border border-white/10 hover:border-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-10"
          aria-label="Geser filter ke kanan"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Clear All Button */}
      {onClearAll && (
        <Button
          type="button"
          variant="inactive"
          size="sm"
          onClick={onClearAll}
          className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-50 whitespace-nowrap ml-1"
        >
          {clearAllLabel}
        </Button>
      )}
    </div>
  );
}
