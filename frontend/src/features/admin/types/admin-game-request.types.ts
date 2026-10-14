export type GameRequestStatus = "requested" | "accepted" | "declined";

export type GameRequestTab = "requested" | "accepted" | "declined";

export interface AdminGameRequestItem {
  id: string;
  name: string;
  requestCount: number;
  firstRequest: string;
  steamUrl: string;
  isPinned: boolean;
  status: GameRequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameRequestFilterState {
  activeTab: GameRequestTab;
  searchQuery?: string;
  currentPage: number;
}
