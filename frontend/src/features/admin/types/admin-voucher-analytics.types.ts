export interface VoucherAnalyticsSummary {
  voucherCode: string;
  discountPercentage: number;
  totalUsage: number;
  totalBurn: string;
}

export interface VoucherTargetGameItem {
  id: string;
  title: string;
  coverImage: string;
  discountBadge: string;
  originalPrice: string;
  discountedPrice: string;
}

export interface VoucherTargetUserItem {
  id: string;
  email: string;
}

export interface VoucherRevenueChartPoint {
  day: string;
  revenue: number;
}

export interface VoucherOrderItem {
  id: string;
  orderId: string;
  customerEmail: string;
  status: "pending" | "completed" | "failed";
  price: string;
  date: string;
}

export interface VoucherAnalyticsData {
  summary: VoucherAnalyticsSummary;
  targetGames: VoucherTargetGameItem[];
  targetUsers: VoucherTargetUserItem[];
  revenueChart: VoucherRevenueChartPoint[];
  orders: VoucherOrderItem[];
}
