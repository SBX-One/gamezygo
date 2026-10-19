export type ReviewStatus = "Posted" | "Draft" | "Archive";

export interface AdminReviewItem {
  id: string;
  userEmail: string;
  userName?: string;
  createdAt: string; // e.g. "22/06/2026"
  rating: number; // 1 to 5
  reviewText: string;
  thumbnails: string[];
  status: ReviewStatus;
  price?: number; // e.g. 45000, 120000, 200000
  gameTitle?: string;
  reply?: string;
  repliedAt?: string;
}

export interface AdminReviewFilterState {
  search: string;
  star: number | null; // null for all, or 1 to 5
  statuses: ReviewStatus[]; // e.g. ["Posted", "Draft", "Archive"]
  priceRange: [number, number]; // [0, 200000]
  sortBy: "terbaru" | "name_asc";
}
