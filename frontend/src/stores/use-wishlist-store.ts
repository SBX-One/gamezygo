import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface WishlistGameItem {
  id: string;
  productId?: number;
  slug?: string;
  steamAppId?: number;
  title: string;
  imageSrc: string;
  genres: string[];
  platform?: string;
  launcher?: string;
  addedAt?: number;
}

export interface WishlistStore {
  items: WishlistGameItem[];
  addToWishlist: (item: WishlistGameItem) => void;
  removeFromWishlist: (productIdOrSlugOrId: string | number) => void;
  toggleWishlist: (item: WishlistGameItem) => boolean;
  isWishlisted: (productIdOrSlugOrId?: string | number, title?: string) => boolean;
  clearWishlist: () => void;
  setWishlistItems: (items: WishlistGameItem[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addToWishlist: (item: WishlistGameItem) => {
          const { items } = get();
          const targetId = String(item.productId || item.id || "").trim();
          const targetTitle = item.title?.trim().toLowerCase();
          const targetSlug = item.slug?.trim().toLowerCase();

          const alreadyExists = items.some((x) => {
            if (targetId && String(x.productId || x.id) === targetId) return true;
            if (targetSlug && x.slug?.trim().toLowerCase() === targetSlug) return true;
            if (targetTitle && x.title?.trim().toLowerCase() === targetTitle) return true;
            return false;
          });

          if (!alreadyExists) {
            set({
              items: [{ ...item, addedAt: Date.now() }, ...items],
            });
          }
        },

        removeFromWishlist: (productIdOrSlugOrId: string | number) => {
          const { items } = get();
          const target = String(productIdOrSlugOrId).trim().toLowerCase();
          if (!target) return;

          set({
            items: items.filter((x) => {
              if (String(x.id).toLowerCase() === target) return false;
              if (x.productId && String(x.productId) === target) return false;
              if (x.slug && x.slug.toLowerCase() === target) return false;
              if (x.title && x.title.toLowerCase() === target) return false;
              return true;
            }),
          });
        },

        toggleWishlist: (item: WishlistGameItem): boolean => {
          const { isWishlisted, addToWishlist, removeFromWishlist } = get();
          const exists = isWishlisted(item.productId || item.id, item.title);

          if (exists) {
            removeFromWishlist(item.productId || item.id);
            return false;
          } else {
            addToWishlist(item);
            return true;
          }
        },

        isWishlisted: (productIdOrSlugOrId?: string | number, title?: string): boolean => {
          const { items } = get();
          if (!productIdOrSlugOrId && !title) return false;

          const target = productIdOrSlugOrId
            ? String(productIdOrSlugOrId).trim().toLowerCase()
            : "";
          const cleanTitle = title ? title.trim().toLowerCase() : "";

          return items.some((x) => {
            if (target) {
              if (String(x.id).toLowerCase() === target) return true;
              if (x.productId && String(x.productId) === target) return true;
              if (x.slug && x.slug.toLowerCase() === target) return true;
            }
            if (cleanTitle && x.title && x.title.toLowerCase() === cleanTitle) return true;
            return false;
          });
        },

        clearWishlist: () => set({ items: [] }),

        setWishlistItems: (items: WishlistGameItem[]) => set({ items }),
      }),
      {
        name: "gamezygo_wishlist_storage",
      }
    )
  )
);

