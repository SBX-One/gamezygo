import type {
  ProductHeroData,
  ProductMetricsData,
  ProductRevenueChartPoint,
  ProductOrderItem,
} from "../types/admin-product-performance.types";

export const MOCK_PRODUCT_HERO_DATA: ProductHeroData = {
  id: "prod-beholder-conductor",
  title: "Beholder : Conductor",
  genres: ["Action", "Adventure"],
  totalSold: 999,
  coverImage:
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2825530/library_600x900_2x.jpg",
};

export const MOCK_PRODUCT_METRICS: ProductMetricsData = {
  revenue: "IDR 500,000",
  revenueChange: "50%",
  revenueSubtitle: "FROM 8 DAYS AGO",

  rankInTables: "#92",
  rankSubtitle: "RANK 92 FROM 100",

  lastSold24h: "92 Sold",
  lastSoldChange: "50%",
  lastSoldSubtitle: "FROM 8 DAYS AGO",
};

export const MOCK_PRODUCT_REVENUE_CHART_DATA: ProductRevenueChartPoint[] = [
  { day: "Senin", revenue: 80 },
  { day: "Selasa", revenue: 380 },
  { day: "Rabu", revenue: 350 },
  { day: "Kamis", revenue: 720 },
  { day: "Jumat", revenue: 950 },
  { day: "Sabtu", revenue: 730 },
  { day: "Minggu", revenue: 760 },
];

export const MOCK_PRODUCT_ORDERS: ProductOrderItem[] = [
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
  {
    orderId: "H27TG1G26G3N18U2-67",
    customerEmail: "user123@test.com",
    status: "pending",
    price: "Rp 480.000",
    date: "22/07/2026 16:39:40",
  },
];
