import * as React from "react";

export interface BannerSlide {
  id: string;
  imageSrc: string;
  title?: string;
  alt?: string;
  href?: string;
  badge?: string;
}

export interface BannerCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of slide data items
   */
  slides: BannerSlide[];

  /**
   * Whether to enable automatic sliding
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Duration in ms between automatic slide transitions
   * @default 4000
   */
  autoPlayInterval?: number;

  /**
   * Whether to display bottom pagination dots
   * @default true
   */
  showDots?: boolean;

  /**
   * Whether to display left/right navigation arrows
   * @default true
   */
  showArrows?: boolean;

  /**
   * Callback invoked when a slide is clicked
   */
  onSlideClick?: (slide: BannerSlide, index: number) => void;
}
