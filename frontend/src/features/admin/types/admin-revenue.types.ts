export interface RevenueChartPoint {
  day: string;
  revenue: number;
}

export interface IncomeSpreadSegment {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

export interface RevenueProductItem {
  id: string;
  name: string;
  totalSell: string;
  totalRevenue: string;
  date: string;
  status: "pending" | "completed";
}

export interface BundleStatisticData {
  percentageIncrease: number;
  amountIncreaseText: string;
  lastMonthAmount: string;
  thisMonthAmount: string;
  totalActiveSubs: string;
  totalSubsLastMonth: string;
}

export interface ActiveVoucherItem {
  id: string;
  code: string;
  totalUse: number;
  minusRevenue: string;
}
