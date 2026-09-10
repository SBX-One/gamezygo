import * as React from "react";
import type { ProductCardProps } from "@/components/ui/ProductCard/ProductCard.types";

export interface ProductCardRowItem {
  id: string;
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
   * Item threshold to enable horizontal scroll and fade shadows (default: 4)
   */
  threshold?: number;
  /**
   * Optional custom card class name
   */
  cardClassName?: string;
  /**
   * Custom ref
   */
  ref?: React.Ref<HTMLDivElement>;
}
