import type { User, Product } from "@/types";

export const MOCK_USER: User = {
  id: "mock-uuid-1234",
  email: "dyven@gamezygo.com",
  name: "Dyven Siauw",
  role: "customer",
  avatarUrl:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
  joinedDate: "22/06/2026",
};

export const MOCK_ADMIN: User = {
  id: "mock-uuid-5678",
  email: "admin@gamezygo.com",
  name: "Jane Admin",
  role: "admin",
};

export const MOCK_TOKEN = "mock-jwt-token-xyz-98765";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "gta5-uuid",
    title: "Grand Theft Auto V Premium Edition",
    slug: "gta-v-premium-edition",
    price: 150000,
    cover_image_url: "https://s3.amazonaws.com/gamezygo/covers/gta5.jpg",
  },
  {
    id: "rdr2-uuid",
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    price: 350000,
    cover_image_url: "https://s3.amazonaws.com/gamezygo/covers/rdr2.jpg",
  },
];
