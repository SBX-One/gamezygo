import type { PreOrderItem } from "../types/admin-preorder.types";

export const MOCK_PREORDER_ITEMS: PreOrderItem[] = Array.from(
  { length: 90 },
  (_, i) => {
    const id = `preorder-${i + 1}`;
    return {
      id,
      title: "Grand Thief Auto VI",
      imageSrc:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
      categories: ["Action", "Adventure", "Open World", "Crime"],
      price: 480000,
      formattedPrice: "Rp 480.000",
      releaseDate: "2026-11-20",
      status: "pre-order",
    };
  }
);
