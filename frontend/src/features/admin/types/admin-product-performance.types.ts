export interface ProductHeroData {
  id: string;
  title: string;
  genres: string[];
  totalSold: number;
  coverImage: string;
}

export interface ProductMetricsData {
  revenue: string;
  revenueChange: string;
  revenueSubtitle: string;

  rankInTables: string;
  rankSubtitle: string;

  lastSold24h: string;
  lastSoldChange: string;
  lastSoldSubtitle: string;
}

export interface ProductRevenueChartPoint {
  day: string;
  revenue: number;
}

export interface ProductOrderItem {
  orderId: string;
  customerEmail: string;
  status: "pending" | "completed" | "failed";
  price: string;
  date: string;
}
