import type {
  SubscriptionPlan,
  SubscriberAccount,
  SubscriptionGameStats,
} from "../types/admin-subscription.types";
import type { SectionProduct } from "../types/admin-section.types";

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "subs-plan-1",
    title: "Paket 1",
    duration: "1 BULAN",
    price: "IDR 150,000",
    period: "/ Month",
    benefits: ["Membuka 1000+ Game", "Membuka 1000+ Game"],
  },
  {
    id: "subs-plan-2",
    title: "Paket 1",
    duration: "2 BULAN",
    price: "IDR 280,000",
    period: "/ Month",
    benefits: ["Membuka 1000+ Game", "Membuka 1000+ Game"],
  },
  {
    id: "subs-plan-3",
    title: "Paket 1",
    duration: "3 BULAN",
    price: "IDR 400,000",
    period: "/ Month",
    benefits: ["Membuka 1000+ Game", "Membuka 1000+ Game"],
  },
];

export const SUBSCRIPTION_GAME_STATS: SubscriptionGameStats = {
  totalGames: 1005,
  totalValue: "IDR 200.000.000",
};

export const SUBSCRIPTION_GAMES: SectionProduct[] = [
  {
    id: "ac-black-flag-subs",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
  },
  {
    id: "007-first-light-subs",
    title: "007 - First Light",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
  },
  {
    id: "ea-college-football-subs",
    title: "EA College Football 27",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
  },
  {
    id: "subnautica-2-subs-1",
    title: "Subnautica 2",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
  },
  {
    id: "subnautica-2-subs-2",
    title: "Subnautica 2",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
  },
];

// 105 mock subscribers matching Image 4
export const MOCK_SUBSCRIBERS: SubscriberAccount[] = Array.from(
  { length: 105 },
  (_, i) => {
    const id = String(i + 1).padStart(4, "0");
    return {
      id,
      email: "user123@test.com",
      accountCreated: "22/07/2026 16:39:40",
      subsEnd: "01/09/2026",
      status: "active",
    };
  }
);
