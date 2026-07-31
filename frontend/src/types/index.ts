export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

export interface Product {
  id: string;
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
