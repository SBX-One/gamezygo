import type {
  ProductListItem,
  ProductDetailItem,
  AnnouncementItem,
  CustomSectionItem,
} from "@/types";
import type { BannerSlide } from "@/components/ui/BannerCarousel/BannerCarousel.types";
import type { ProductCardRowItem } from "@/components/ui/ProductCardRow/ProductCardRow.types";
import { resolveImageUrl, normalizeSteamVerticalCover } from "./image-url";

function getCoverImage(product: ProductListItem | ProductDetailItem | Record<string, unknown>): string {
  const p = product as Record<string, unknown>;
  const rawThumbnail = typeof p.thumbnail === "string" ? p.thumbnail.trim() : "";
  if (rawThumbnail) {
    return normalizeSteamVerticalCover(resolveImageUrl(rawThumbnail));
  }
  const rawImageSrc = typeof p.imageSrc === "string" ? p.imageSrc.trim() : "";
  if (rawImageSrc) {
    return normalizeSteamVerticalCover(resolveImageUrl(rawImageSrc));
  }
  const rawImageUrl = typeof p.image_url === "string" ? p.image_url.trim() : "";
  if (rawImageUrl) {
    return normalizeSteamVerticalCover(resolveImageUrl(rawImageUrl));
  }
  const rawBanner = typeof p.banner_file_url === "string" ? p.banner_file_url.trim() : "";
  if (rawBanner) {
    return normalizeSteamVerticalCover(resolveImageUrl(rawBanner));
  }
  if ("steam_url" in p && typeof p.steam_url === "string" && p.steam_url) {
    const match = p.steam_url.match(/\/app\/(\d+)/);
    if (match && match[1]) {
      return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${match[1]}/library_600x900_2x.jpg`;
    }
  }
  return "";
}

import { formatRupiah, formatDiscount } from "./formatters";

/**
 * Convert backend ProductListItem into ProductCardRowItem format
 */
export function mapProductToCardItem(
  product: ProductListItem | ProductDetailItem | Record<string, unknown>
): ProductCardRowItem {
  const p = product as Record<string, unknown>;
  const finalPrice =
    "discount_price" in p && p.discount_price !== undefined && p.discount_price !== null
      ? Number(p.discount_price)
      : "price_discount" in p && p.price_discount !== undefined && p.price_discount !== null
      ? Number(p.price_discount)
      : Number(p.price ?? 0);

  const rawCategories =
    "categories" in p && p.categories
      ? p.categories
      : "product_genre_categories" in p && p.product_genre_categories
      ? p.product_genre_categories
      : [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  const platform =
    "launcher_category" in p && (p as { launcher_category?: { name: string } }).launcher_category
      ? (p as { launcher_category?: { name: string } }).launcher_category?.name
      : "product_launcher_category" in p && (p as { product_launcher_category?: { name: string } }).product_launcher_category
      ? (p as { product_launcher_category?: { name: string } }).product_launcher_category?.name
      : "Steam";

  const numPrice = Number(p.price ?? 0);
  const numDiscount = Number(p.discount ?? 0);
  const hasDiscount = numDiscount > 0 && finalPrice < numPrice;

  return {
    id: String(p.id ?? "1"),
    slug: typeof p.slug === "string" && p.slug ? p.slug : String(p.id ?? "1"),
    title: String(p.name ?? p.title ?? "Untitled Game"),
    imageSrc: getCoverImage(p),
    genres: categories.map((c: unknown) => (typeof c === "string" ? c : (c as { name?: string })?.name || "")).filter(Boolean),
    originalPrice: hasDiscount ? formatRupiah(numPrice) : "",
    price: formatRupiah(finalPrice),
    numericPrice: finalPrice,
    discount: hasDiscount ? formatDiscount(numDiscount) : "",
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
  const rawImageSrc =
    a.banner_file_url ||
    a.imageUrl ||
    a.image_url ||
    a.banner_url ||
    "/assets/png/Banner.png";

  const imageSrc = rawImageSrc.startsWith("/assets/")
    ? rawImageSrc
    : resolveImageUrl(rawImageSrc, "/assets/png/Banner.png");

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
  section: CustomSectionItem | Record<string, unknown>
): ProductCardRowItem[] {
  const s = section as Record<string, unknown>;
  const rawProducts = s.custom_section_products ?? s.products ?? [];
  const list = Array.isArray(rawProducts)
    ? rawProducts
    : Array.isArray((rawProducts as { data?: unknown[] })?.data)
    ? (rawProducts as { data: unknown[] }).data
    : [];
  const activeList = list.filter((item: unknown) => {
    if (!item || typeof item !== "object") return false;
    const prod = item as { status?: string; archived_at?: string | null; is_archived?: boolean };
    return prod.status !== "archive" && !prod.archived_at && !prod.is_archived;
  });
  return activeList.map((item) => mapProductToCardItem(item as Record<string, unknown>));
}
