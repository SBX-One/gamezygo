export interface AdminCommunityItem {
  id: string;
  name: string;
  pageLink: string;
  tag: string;
  imageUrl: string;
  orderNumber: number;
  createdAt?: string;
}

export type CommunityPlatformTag = "All" | "Whatsapp" | "Telegram" | "Discord";
