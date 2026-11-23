export interface AdminCommunityItem {
  id: string;
  name: string;
  pageLink: string;
  tag: string;
  tags: string[];
  imageUrl: string;
  orderNumber: number;
  isActive: boolean;
  createdAt?: string;
}

export type CommunityPlatformTag = string;
