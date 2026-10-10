export interface TransactionItem {
  id: string;
  customerEmail: string;
  productId: string;
  productName: string;
  amount: string;
  date: string;
  status: "pending" | "completed" | "failed";
}

export interface TransactionMetricsData {
  todayTransactions: number;
  todayProfit: string;
  todayPercentage: string;

  thisWeekTransactions: number;
  thisWeekProfit: string;
  thisWeekPercentage: string;

  thisMonthTransactions: number;
  thisMonthProfit: string;
  thisMonthPercentage: string;
}
