import type {
  VoucherAnalyticsData,
  VoucherAnalyticsSummary,
  VoucherTargetGameItem,
  VoucherTargetUserItem,
  VoucherRevenueChartPoint,
  VoucherOrderItem,
} from "../types/admin-voucher-analytics.types";

export const MOCK_VOUCHER_ANALYTICS_SUMMARY: VoucherAnalyticsSummary = {
  voucherCode: "SUMMER26",
  discountPercentage: 50,
  totalUsage: 92,
  totalBurn: "IDR 155,000",
};

export const MOCK_VOUCHER_TARGET_GAMES: VoucherTargetGameItem[] = [
  {
    id: "gta-1",
    title: "Grand Theft Auto V",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    discountBadge: "-30%",
    originalPrice: "Rp 439.000,00",
    discountedPrice: "Rp 219.500",
  },
  {
    id: "gta-2",
    title: "Grand Theft Auto V",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    discountBadge: "-30%",
    originalPrice: "Rp 439.000,00",
    discountedPrice: "Rp 219.500",
  },
  {
    id: "gta-3",
    title: "Grand Theft Auto V",
    coverImage:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    discountBadge: "-30%",
    originalPrice: "Rp 439.000,00",
    discountedPrice: "Rp 219.500",
  },
];

export const MOCK_VOUCHER_TARGET_USERS: VoucherTargetUserItem[] = [
  {
    id: "user-1",
    email: "user123@test.com",
  },
  {
    id: "user-2",
    email: "user123@test.com",
  },
  {
    id: "user-3",
    email: "user123@test.com",
  },
];

export const MOCK_VOUCHER_REVENUE_CHART_DATA: VoucherRevenueChartPoint[] = [
  { day: "Senin", revenue: 100 },
  { day: "Selasa", revenue: 650 },
  { day: "Rabu", revenue: 520 },
  { day: "Kamis", revenue: 860 },
  { day: "Jumat", revenue: 1020 },
  { day: "Sabtu", revenue: 830 },
  { day: "Minggu", revenue: 600 },
];

export const MOCK_VOUCHER_ORDERS: VoucherOrderItem[] = [
  {
    id: "order-1",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-2",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-3",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-4",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-5",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-6",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-7",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-8",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    id: "order-9",
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
];

export const MOCK_VOUCHER_ANALYTICS_DATA: VoucherAnalyticsData = {
  summary: MOCK_VOUCHER_ANALYTICS_SUMMARY,
  targetGames: MOCK_VOUCHER_TARGET_GAMES,
  targetUsers: MOCK_VOUCHER_TARGET_USERS,
  revenueChart: MOCK_VOUCHER_REVENUE_CHART_DATA,
  orders: MOCK_VOUCHER_ORDERS,
};

/**
 * Empty state dataset matching Images 3 and 4
 */
export const MOCK_VOUCHER_ANALYTICS_EMPTY_DATA: VoucherAnalyticsData = {
  summary: {
    voucherCode: "SUMMER26",
    discountPercentage: 0,
    totalUsage: 0,
    totalBurn: "IDR 0",
  },
  targetGames: [],
  targetUsers: [],
  revenueChart: [],
  orders: [],
};
