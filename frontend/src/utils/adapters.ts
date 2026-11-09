import type {
  ProductListItem,
  ProductDetailItem,
  AnnouncementItem,
  CustomSectionItem,
} from "@/types";
import type { BannerSlide } from "@/components/ui/BannerCarousel/BannerCarousel.types";
import type { ProductCardRowItem } from "@/components/ui/ProductCardRow/ProductCardRow.types";
import { resolveImageUrl } from "./image-url";

function getCoverImage(product: ProductListItem | ProductDetailItem): string {
  if (product.thumbnail && product.thumbnail.trim() !== "") {
    return resolveImageUrl(product.thumbnail);
  }
  if ("steam_url" in product && product.steam_url) {
    const match = product.steam_url.match(/\/app\/(\d+)/);
    if (match && match[1]) {
      return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${match[1]}/hero_capsule.jpg`;
    }
  }
  return "";
}

import { formatRupiah, formatDiscount } from "./formatters";

/**
 * Convert backend ProductListItem into ProductCardRowItem format
 */
export function mapProductToCardItem(
  product: ProductListItem | ProductDetailItem
): ProductCardRowItem {
  const finalPrice =
    "discount_price" in product
      ? (product as ProductListItem).discount_price
      : "price_discount" in product
      ? (product as ProductDetailItem).price_discount
      : (product as { price: number }).price;

  const rawCategories =
    "categories" in product && product.categories
      ? product.categories
      : "product_genre_categories" in product && product.product_genre_categories
      ? product.product_genre_categories
      : [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  const platform =
    "launcher_category" in product && (product as { launcher_category?: { name: string } }).launcher_category
      ? (product as { launcher_category?: { name: string } }).launcher_category?.name
      : "product_launcher_category" in product && product.product_launcher_category
      ? product.product_launcher_category?.name
      : "Steam";

  const hasDiscount = product.discount > 0 && finalPrice < product.price;

  return {
    id: String(product.id),
    slug: ("slug" in product && product.slug) ? product.slug : String(product.id),
    title: product.name,
    imageSrc: getCoverImage(product),
    genres: categories.map((c) => c.name),
    originalPrice: hasDiscount ? formatRupiah(product.price) : "",
    price: formatRupiah(finalPrice),
    numericPrice: finalPrice,
    discount: hasDiscount ? formatDiscount(product.discount) : "",
    platform: platform || "Steam",
  };
}

/**
 * Convert backend Announcement items into BannerSlide format for BannerCarousel
 */
export interface AnnouncementLike {
  id?: number | string;
  banner_file_url?: string;
  imageUrl?: string;
  image_url?: string;
  banner_url?: string;
  order_number?: number;
  orderNumber?: number;
  title?: string;
  alt?: string;
  link?: string;
  pageLink?: string;
  href?: string;
  isPublished?: boolean;
}

export function mapAnnouncementToSlide(
  announcement: AnnouncementItem | AnnouncementLike
): BannerSlide {
  const a = announcement as AnnouncementLike;
  const imageSrc =
    a.banner_file_url ||
    a.imageUrl ||
    a.image_url ||
    a.banner_url ||
    "/assets/png/Banner.png";

  const orderNum = a.order_number ?? a.orderNumber ?? 1;
  const slideId = a.id ? `banner-${a.id}` : `banner-order-${orderNum}`;

  return {
    id: slideId,
    imageSrc,
    title: a.title || `Promo #${orderNum}`,
    alt: a.alt || `Banner Promo Gamezygo #${orderNum}`,
    href: (() => {
      const rawHref = a.link || a.pageLink || a.href || "/store";
      return rawHref.startsWith("/") || rawHref.startsWith("http")
        ? rawHref
        : `/${rawHref.trim().toLowerCase().replace(/\s+/g, "-")}`;
    })(),
  };
}

/**
 * Convert backend CustomSectionItem products to ProductCardRowItem array
 */
export function mapSectionProducts(
  section: CustomSectionItem
): ProductCardRowItem[] {
  return (section.custom_section_products || []).map(mapProductToCardItem);
}
