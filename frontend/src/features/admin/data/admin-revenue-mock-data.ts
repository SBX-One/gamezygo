import type {
  RevenueChartPoint,
  IncomeSpreadSegment,
  RevenueProductItem,
  BundleStatisticData,
  ActiveVoucherItem,
} from "../types/admin-revenue.types";

export const MOCK_REVENUE_CHART_DATA: RevenueChartPoint[] = [
  { day: "Senin", revenue: 0 },
  { day: "Selasa", revenue: 450 },
  { day: "Rabu", revenue: 580 },
  { day: "Kamis", revenue: 520 },
  { day: "Jumat", revenue: 860 },
  { day: "Sabtu", revenue: 980 },
  { day: "Minggu", revenue: 880 },
];

export const MOCK_INCOME_SPREAD_PRODUCT_TYPE: IncomeSpreadSegment[] = [
  { id: "paket", label: "Paket", percentage: 80, color: "#FF5364" },
  { id: "game-satuan", label: "Game Satuan", percentage: 80, color: "#3B1F25" },
];

export const MOCK_INCOME_SPREAD_PRODUCTS: IncomeSpreadSegment[] = [
  { id: "gta5", label: "Grand Theft Auto V", percentage: 45, color: "#FF5364" },
  { id: "rdr2", label: "Red Dead Redemption 2", percentage: 35, color: "#9E3D48" },
  { id: "elden", label: "Elden Ring", percentage: 20, color: "#5A232B" },
];

export const MOCK_REVENUE_PRODUCTS: RevenueProductItem[] = [
  {
    id: "prod-1",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-2",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-3",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-4",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-5",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-6",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-7",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-8",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
  {
    id: "prod-9",
    name: "Beholder : Conductor",
    totalSell: "12.000",
    totalRevenue: "Rp 480.000",
    date: "22/07/2026 16:39:40",
    status: "pending",
  },
];

export const MOCK_BUNDLE_STATISTIC: BundleStatisticData = {
  percentageIncrease: 90,
  amountIncreaseText: "NAIK IDR 56.000 DARI BULAN LALU",
  lastMonthAmount: "IDR 350.000",
  thisMonthAmount: "IDR 350.000",
  totalActiveSubs: "200 Users",
  totalSubsLastMonth: "456 Users",
};

export const EMPTY_BUNDLE_STATISTIC: BundleStatisticData = {
  percentageIncrease: 0,
  amountIncreaseText: "NAIK IDR 0 DARI BULAN LALU",
  lastMonthAmount: "IDR 0",
  thisMonthAmount: "IDR 0",
  totalActiveSubs: "0 Users",
  totalSubsLastMonth: "0 Users",
};

export const MOCK_ACTIVE_VOUCHERS: ActiveVoucherItem[] = [
  { id: "vouch-1", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
  { id: "vouch-2", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
  { id: "vouch-3", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
  { id: "vouch-4", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
  { id: "vouch-5", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
  { id: "vouch-6", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
  { id: "vouch-7", code: "SUMMER26", totalUse: 56, minusRevenue: "Rp 480.000" },
];
