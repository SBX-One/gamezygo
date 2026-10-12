import type { ProductSection, SectionProduct } from "../types/admin-section.types";

export const MOCK_SECTION_GAMES: SectionProduct[] = [
  {
    id: "ac-black-flag",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
    originalPrice: "Rp 313.500",
    discount: "-30%",
  },
  {
    id: "007-first-light",
    title: "007 - First Light",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
    originalPrice: "Rp 313.500",
    discount: "-30%",
  },
  {
    id: "ea-college-football-27",
    title: "EA College Football 27",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2582560/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
    originalPrice: "Rp 313.500",
    discount: "-30%",
  },
  {
    id: "subnautica-2",
    title: "Subnautica 2",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 219500,
    originalPrice: "Rp 313.500",
    discount: "-30%",
  },
  {
    id: "gta-6",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Open World"],
    price: 480000,
    originalPrice: "Rp 600.000",
    discount: "-20%",
  },
  {
    id: "ghost-tsushima",
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    categories: ["Action", "Adventure"],
    price: 349500,
    originalPrice: "Rp 799.000",
    discount: "-56%",
  },
  {
    id: "ea-sports-fc-26",
    title: "EA SPORTS FC™ 26",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    categories: ["Sport-Racing", "Multiplayer"],
    price: 349500,
    originalPrice: "Rp 799.000",
    discount: "-56%",
  },
  {
    id: "beholder-conductor",
    title: "Beholder: Conductor",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    categories: ["Strategy", "Indie"],
    price: 122999,
    originalPrice: "Rp 439.000",
    discount: "-30%",
  },
];

export const MOCK_CATALOG_TABLE_GAMES: SectionProduct[] = [
  {
    id: "gta-6-1",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Open World", "Shooter"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-2",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Open World", "Crime"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-3",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Crime", "Racing"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-4",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Open World", "Fantasy"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-5",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Shooter", "RPG"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-6",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Open World", "Crime"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-7",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Crime", "Racing"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  {
    id: "gta-6-8",
    title: "Grand Theft Auto VI",
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    categories: ["Action", "Adventure", "Open World", "Shooter"],
    price: 480000,
    originalPrice: "Rp 600.000",
  },
  ...MOCK_SECTION_GAMES,
];


export const INITIAL_PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: "sec-tawaran-khusus",
    title: "Tawaran Khusus!",
    slug: "tawaran-khusus",
    products: [
      MOCK_SECTION_GAMES[0], // Assassin's Creed Black Flag Resynced
      MOCK_SECTION_GAMES[1], // 007 - First Light
      MOCK_SECTION_GAMES[2], // EA College Football 27
      MOCK_SECTION_GAMES[3], // Subnautica 2
    ],
  },
  {
    id: "sec-empty-header",
    title: "Section header",
    slug: "section-header",
    products: [],
  },
];
