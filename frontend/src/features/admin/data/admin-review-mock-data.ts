import type { AdminReviewItem } from "../types/admin-review.types";

const COMMON_REVIEW_TEXT =
  '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...”';

const SAMPLE_STEAM_IMAGES = [
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg", // Black Myth Wukong
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg", // Cyberpunk 2077
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", // Elden Ring
];

export const MOCK_ADMIN_REVIEWS: AdminReviewItem[] = [
  {
    id: "rev-001",
    userEmail: "user123@test.com",
    userName: "user123",
    createdAt: "22/06/2026",
    rating: 5,
    reviewText: COMMON_REVIEW_TEXT,
    thumbnails: SAMPLE_STEAM_IMAGES,
    status: "Draft",
    price: 45000,
    gameTitle: "Black Myth: Wukong",
  },
  {
    id: "rev-002",
    userEmail: "user123@test.com",
    userName: "user123",
    createdAt: "22/06/2026",
    rating: 5,
    reviewText: COMMON_REVIEW_TEXT,
    thumbnails: SAMPLE_STEAM_IMAGES,
    status: "Draft",
    price: 65000,
    gameTitle: "Cyberpunk 2077",
  },
  {
    id: "rev-003",
    userEmail: "user123@test.com",
    userName: "user123",
    createdAt: "22/06/2026",
    rating: 5,
    reviewText: COMMON_REVIEW_TEXT,
    thumbnails: SAMPLE_STEAM_IMAGES,
    status: "Draft",
    price: 85000,
    gameTitle: "Elden Ring",
  },
  {
    id: "rev-004",
    userEmail: "cihuyy67@test.com",
    userName: "Cihuyy6767",
    createdAt: "21/06/2026",
    rating: 5,
    reviewText:
      '“Pengiriman akun kilat banget, ga nyampe 5 menit langsung bisa login dan main! Pokoknya recommended banget buat yang mau nyobain game AAA tanpa keluar jutaan rupiah.”',
    thumbnails: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    ],
    status: "Posted",
    price: 50000,
    gameTitle: "Grand Theft Auto V",
  },
  {
    id: "rev-005",
    userEmail: "gamerpro99@test.com",
    userName: "GamerPro99",
    createdAt: "20/06/2026",
    rating: 4,
    reviewText:
      '“Pelayanan customer service ramah dan fast response. Ada sedikit kendala saat login tapi langsung dibantu sampe beres. Top tier service!”',
    thumbnails: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
    ],
    status: "Posted",
    price: 120000,
    gameTitle: "Red Dead Redemption 2",
  },
  {
    id: "rev-006",
    userEmail: "budi_gaming@gmail.com",
    userName: "Budi Santoso",
    createdAt: "19/06/2026",
    rating: 5,
    reviewText: COMMON_REVIEW_TEXT,
    thumbnails: SAMPLE_STEAM_IMAGES,
    status: "Draft",
    price: 35000,
    gameTitle: "Black Myth: Wukong",
  },
  {
    id: "rev-007",
    userEmail: "andi.wijaya@outlook.com",
    userName: "Andi Wijaya",
    createdAt: "18/06/2026",
    rating: 3,
    reviewText:
      '“Akun berfungsi dengan baik, namun proses verifikasi butuh waktu sedikit lebih lama dari biasanya. Overall tetap memuaskan.”',
    thumbnails: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    ],
    status: "Archive",
    price: 150000,
    gameTitle: "Cyberpunk 2077",
  },
  {
    id: "rev-008",
    userEmail: "dina_player@yahoo.com",
    userName: "Dina Player",
    createdAt: "17/06/2026",
    rating: 5,
    reviewText:
      '“Sangat membantu untuk gamers dengan budget terbatas. Game original lancar jaya dan save data tersimpan aman.”',
    thumbnails: SAMPLE_STEAM_IMAGES,
    status: "Posted",
    price: 45000,
    gameTitle: "Elden Ring",
  },
  {
    id: "rev-009",
    userEmail: "user456@test.com",
    userName: "user456",
    createdAt: "16/06/2026",
    rating: 5,
    reviewText: COMMON_REVIEW_TEXT,
    thumbnails: SAMPLE_STEAM_IMAGES,
    status: "Draft",
    price: 90000,
    gameTitle: "Black Myth: Wukong",
  },
];
