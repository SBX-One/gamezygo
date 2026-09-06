import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BannerCarouselProps, BannerSlide } from "./BannerCarousel.types";

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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

export function BannerCarousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  onSlideClick,
  className,
  ...props
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  // Touch swipe support
  const touchStartX = React.useRef<number | null>(null);
  const touchDeltaX = React.useRef<number>(0);

  const totalSlides = slides?.length || 0;

  const nextSlide = React.useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = React.useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play effect
  React.useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isPaused, nextSlide, totalSlides]);

  // Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      const swipeDistance = touchDeltaX.current;
      const minSwipeDistance = 40;

      if (swipeDistance < -minSwipeDistance) {
        nextSlide();
      } else if (swipeDistance > minSwipeDistance) {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const renderSlideContent = (slide: BannerSlide, index: number) => {
    const content = (
      <div
        className="w-full h-full relative cursor-pointer group/slide overflow-hidden"
        onClick={() => onSlideClick?.(slide, index)}
      >
        <Image
          src={slide.imageSrc}
          alt={slide.alt || slide.title || `Slide ${index + 1}`}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center select-none transition-transform duration-500 ease-out group-hover/slide:scale-[1.02]"
          draggable={false}
          priority={index === 0}
        />
        {/* Subtle bottom vignette to ensure indicators and badges remain prominent */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );

    if (slide.href) {
      return (
        <Link
          key={slide.id}
          href={slide.href}
          className="min-w-full h-full shrink-0 relative block outline-none"
        >
          {content}
        </Link>
      );
    }

    return (
      <div key={slide.id} className="min-w-full h-full shrink-0 relative">
        {content}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-deep-blue-900 select-none",
        "min-h-[260px] sm:min-h-[340px] lg:min-h-0",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {/* Slides Container Track */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => renderSlideContent(slide, index))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Slide sebelumnya"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9.5 h-9.5 rounded-full bg-slate-900/60 hover:bg-slate-900/85 border border-white/20 backdrop-blur-md text-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Slide berikutnya"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9.5 h-9.5 rounded-full bg-slate-900/60 hover:bg-slate-900/85 border border-white/20 backdrop-blur-md text-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-6 left-7xl -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={slide.id || idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={cn(
                  "transition-all duration-300 rounded-full cursor-pointer h-1.5",
                  isActive
                    ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    : "w-1.5 bg-white/40 hover:bg-white/75"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
