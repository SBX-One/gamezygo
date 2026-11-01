import * as React from "react";
import type { ProductCardProps } from "@/components/ui/ProductCard/ProductCard.types";

export interface ProductCardRowItem {
  id: string;
  slug?: string;
  steamAppId?: number;
  title: string;
  imageSrc: string;
  bannerSrc?: string;
  genres: string[];
  originalPrice: string;
  price: string;
  numericPrice?: number;
  discount: string;
  platform?: string;
  isBestSeller?: boolean;
}

export interface ProductCardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * List of products to render
   */
  products: ProductCardRowItem[];
  /**
   * Callback when "Tambah Keranjang" / action button on a product is clicked
   */
  onAddToCart?: (title: string) => void;
  /**
   * Item threshold to enable horizontal scroll and fade shadows (default: 4 for vertical, 2 for horizontal)
   */
  threshold?: number;
  /**
   * Card orientation: 'vertical' | 'horizontal' (default: 'vertical')
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Number of visible cards on desktop (default: 4 for vertical, 2 for horizontal)
   */
  visibleCount?: number;
  /**
   * Optional custom card class name
   */
  cardClassName?: string;
  /**
   * Optional custom item wrapper class name
   */
  itemClassName?: string;
  /**
   * Menampilkan indikator progress scroll horizontal & kontrol navigasi (default: true)
   */
  showScrollIndicator?: boolean;
  /**
   * Custom ref
   */
  ref?: React.Ref<HTMLDivElement>;
}
