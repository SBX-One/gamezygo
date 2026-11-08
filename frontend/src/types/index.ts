export * from "./api";
export type { CartProductItem, CartResponse, AddToCartResponse } from "./api";

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: "admin" | "customer" | "user" | "guest";
  avatarUrl?: string;
  joinedDate?: string;
  phone?: string | null;
}

export interface Product {
  id: string | number;
  title: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  cover_image_url?: string;
  imageSrc?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

