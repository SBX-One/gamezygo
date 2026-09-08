export type OrderStatus = "Pending" | "Berhasil" | "Gagal";

export interface OrderHistoryItem {
  id: string;
  gameTitle: string;
  purchaseDate: string;
  paymentMethod: string;
  status: OrderStatus;
  price: number;
  formattedPrice: string;
  transactionId: string;
}

export interface HistoryStats {
  totalPayment: string;
  totalPoints: string;
  totalGames: string;
}

export interface HistoryFilterState {
  status: OrderStatus[];
  paymentMethods: string[];
  priceRange: [number, number];
  sortBy: string;
}
