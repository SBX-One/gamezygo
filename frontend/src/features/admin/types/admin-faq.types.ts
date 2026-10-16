export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isExpanded?: boolean;
  lastEdit?: string;
}

export type FaqCategory = "Landing Page" | "Subscription" | "Katalog Game" | "Checkout";

export interface AdminFaqState {
  items: AdminFaqItem[];
  activeCategory: string;
}
