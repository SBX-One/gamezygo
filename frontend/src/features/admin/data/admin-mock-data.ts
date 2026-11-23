import type {
  AdminMetricData,
  AdminProductPerformance,
  AdminTransaction,
  AdminGameRequest,
  AdminTimeframeOption,
} from "../types/admin.types";

export const ADMIN_TIMEFRAMES: AdminTimeframeOption[] = [
  { label: "Hari Ini", value: "today" },
  { label: "Kemarin", value: "yesterday" },
  { label: "Minggu ini", value: "this_week" },
  { label: "Bulan ini", value: "this_month" },
  { label: "Tahun ini", value: "this_year" },
];


export const MOCK_ADMIN_HERO_STAT: AdminMetricData = {
  id: "total-pendapatan",
  title: "TOTAL PENDAPATAN",
  value: "IDR 350,000",
  subtitle: "PENDAPATAN DARI 56 TRANSAKSI",
  badge: {
    text: "50%",
    trend: "up",
  },
};

export const MOCK_ADMIN_STAT_CARDS: AdminMetricData[] = [
  {
    id: "total-order",
    title: "TOTAL ORDER",
    value: "55 Order",
    subtitle: "5 ORDER BARU HARI INI",
  },
  {
    id: "user-active",
    title: "USER ACTIVE",
    value: "55 User",
    subtitle: "DARI TOTAL 12,487 USERS",
  },
  {
    id: "active-subs",
    title: "ACTIVE SUBS",
    value: "105 Akun",
    subtitle: "SUBSCRIPTION AKTIF",
  },
];

export const EMPTY_ADMIN_HERO_STAT: AdminMetricData = {
  id: "total-pendapatan",
  title: "TOTAL PENDAPATAN",
  value: "IDR 0",
  subtitle: "PENDAPATAN DARI 56 TRANSAKSI",
  badge: undefined,
};

export const EMPTY_ADMIN_STAT_CARDS: AdminMetricData[] = [
  {
    id: "total-order",
    title: "TOTAL ORDER",
    value: "0 Order",
    subtitle: "0 Order",
  },
  {
    id: "user-active",
    title: "USER ACTIVE",
    value: "0 User",
    subtitle: "DARI TOTAL 0 USERS",
  },
  {
    id: "active-subs",
    title: "ACTIVE SUBS",
    value: "0 Akun",
    subtitle: "SUBSCRIPTION AKTIF",
  },
];

export const MOCK_ADMIN_CHART_DATA: AdminProductPerformance[] = [
  {
    id: "prod-1",
    name: "Assassin's Creed :...",
    fullName: "Assassin's Creed Valhalla",
    revenue: 850,
  },
  {
    id: "prod-2",
    name: "Assassin's Creed :...",
    fullName: "Assassin's Creed Mirage",
    revenue: 600,
  },
  {
    id: "prod-3",
    name: "Assassin's Creed :...",
    fullName: "Assassin's Creed Odyssey",
    revenue: 600,
  },
  {
    id: "prod-4",
    name: "Assassin's Creed :...",
    fullName: "Assassin's Creed Origins",
    revenue: 450,
  },
  {
    id: "prod-5",
    name: "Assassin's Creed :...",
    fullName: "Assassin's Creed Shadows",
    revenue: 600,
  },
  {
    id: "prod-6",
    name: "Assassin's Creed :...",
    fullName: "Assassin's Creed Syndicate",
    revenue: 600,
  },
];

export const MOCK_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  {
    id: "tx-1",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-2",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-3",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-4",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-5",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-6",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-7",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "tx-8",
    customerEmail: "user123@test.com",
    productName: "Beholder : Conductor",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
];

export const MOCK_ADMIN_GAME_REQUESTS: AdminGameRequest[] = [
  {
    id: "req-1",
    title: "Beholder : Conductor",
    requesterCount: 22,
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    steamUrl: "https://store.steampowered.com/app/475550",
  },
  {
    id: "req-2",
    title: "Beholder : Conductor",
    requesterCount: 22,
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    steamUrl: "https://store.steampowered.com/app/475550",
  },
  {
    id: "req-3",
    title: "Beholder : Conductor",
    requesterCount: 22,
    imageSrc: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/475550/library_600x900_2x.jpg",
    steamUrl: "https://store.steampowered.com/app/475550",
  },
];
