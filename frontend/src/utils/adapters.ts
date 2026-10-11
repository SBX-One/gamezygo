import type {
  ProductListItem,
  ProductDetailItem,
  AnnouncementItem,
  CustomSectionItem,
} from "@/types";
import type { BannerSlide } from "@/components/ui/BannerCarousel/BannerCarousel.types";
import type { ProductCardRowItem } from "@/components/ui/ProductCardRow/ProductCardRow.types";
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
    title: product.name,
    imageSrc: ("thumbnail" in product && product.thumbnail) ? product.thumbnail : "",
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
export function mapAnnouncementToSlide(
  announcement: AnnouncementItem
): BannerSlide {
  return {
    id: `banner-${announcement.id}`,
    imageSrc: announcement.banner_file_url,
    title: `Promo #${announcement.order_number}`,
    alt: `Banner Promo Gamezygo #${announcement.order_number}`,
    href: announcement.link || "/store",
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
