export * from "./api";

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: "admin" | "customer" | "user" | "guest";
  avatarUrl?: string;
  joinedDate?: string;
}

export interface Product {
  id: string | number;
  title: string;
  slug: string;
  price: number;
  cover_image_url: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

