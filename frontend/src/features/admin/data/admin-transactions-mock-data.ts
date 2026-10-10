import type {
  TransactionItem,
  TransactionMetricsData,
} from "../types/admin-transactions.types";

export const MOCK_TRANSACTION_METRICS: TransactionMetricsData = {
  todayTransactions: 56,
  todayProfit: "IDR 350,000",
  todayPercentage: "50%",

  thisWeekTransactions: 206,
  thisWeekProfit: "IDR 2,050,000",
  thisWeekPercentage: "50%",

  thisMonthTransactions: 1206,
  thisMonthProfit: "IDR 12,050,000",
  thisMonthPercentage: "50%",
};

export const EMPTY_TRANSACTION_METRICS: TransactionMetricsData = {
  todayTransactions: 0,
  todayProfit: "IDR 0",
  todayPercentage: "0%",

  thisWeekTransactions: 0,
  thisWeekProfit: "IDR 0",
  thisWeekPercentage: "0%",

  thisMonthTransactions: 0,
  thisMonthProfit: "IDR 0",
  thisMonthPercentage: "0%",
};

export const MOCK_TRANSACTIONS_LIST: TransactionItem[] = [
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
  {
    id: "H27TG1G26G3N1...",
    customerEmail: "user123@test.com",
    productId: "H27TG1G26G3N1...",
    productName: "Beholder : Conduc...",
    amount: "Rp 480.000",
    date: "22/07/2026 16:39:...",
    status: "pending",
  },
];
