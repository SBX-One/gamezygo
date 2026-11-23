export interface SubscriptionPlan {
  id: string;
  title: string;
  duration: string;
  price: string;
  period: string;
  benefits: string[];
}

export interface SubscriberAccount {
  id: string;
  email: string;
  accountCreated: string;
  subsEnd: string;
  status: "active" | "expired" | "pending";
}

export interface SubscriptionGameStats {
  totalGames: number;
  totalValue: string;
}
