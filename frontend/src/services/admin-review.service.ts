import { apiClient } from "@/lib/api-client";
import type {
  AdminReviewItem,
  ReviewStatus,
} from "@/features/admin/types/admin-review.types";

export interface BackendReviewRow {
  id: number | string;
  rating?: number;
  review?: string;
  status?: "pending" | "approved" | "rejected" | "archived" | string;
  order_item_id?: number | string | null;
  user?: {
    id?: number | string;
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  product?: {
    id?: number | string;
    name?: string;
    slug?: string;
    thumbnail?: string;
    price?: number;
  } | null;
  images?: Array<{ id: number | string; url: string }>;
  replies?: Array<{
    id: number | string;
    author_name?: string;
    author_type?: string;
    message?: string;
    created_at?: string;
  }>;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminReviewQueryParams {
  search?: string;
  rating?: number | number[];
  star?: number | number[];
  status?: "pending" | "approved" | "rejected" | "archived";
  product_id?: number | string;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface AdminReviewListResult {
  summary: {
    totalReviews: number;
    averageRating: number;
    breakdown: Record<number, number>;
  };
  reviews: AdminReviewItem[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

function formatReviewDate(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function mapBackendStatusToUi(status?: string | null): ReviewStatus {
  const s = String(status || "").toLowerCase();
  if (s === "approved") return "Posted";
  if (s === "archived") return "Archive";
  return "Draft";
}

export function mapUiStatusToBackend(
  status: ReviewStatus
): "pending" | "approved" | "archived" {
  if (status === "Posted") return "approved";
  if (status === "Archive") return "archived";
  return "pending";
}

export function mapBackendReviewToItem(row: BackendReviewRow): AdminReviewItem {
  const latestReply = row.replies && row.replies.length > 0 ? row.replies[0] : null;

  return {
    id: String(row.id),
    userEmail: row.user?.email || "user@gamezygo.com",
    userName: row.user?.name,
    createdAt: formatReviewDate(row.created_at),
    rating: Number(row.rating ?? 5),
    reviewText: String(row.review ?? ""),
    thumbnails: Array.isArray(row.images) ? row.images.map((img) => img.url) : [],
    status: mapBackendStatusToUi(row.status),
    price: row.product?.price ? Number(row.product.price) : undefined,
    gameTitle: row.product?.name,
    reply: latestReply?.message,
    repliedAt: latestReply?.created_at ? formatReviewDate(latestReply.created_at) : undefined,
  };
}

export const adminReviewService = {
  /**
   * Fetch reviews with filtering, pagination, and rating breakdown.
   */
  async getReviews(params?: AdminReviewQueryParams): Promise<AdminReviewListResult> {
    const response = await apiClient.get<{
      data?: {
        summary?: {
          total_reviews?: number;
          average_rating?: number;
          breakdown?: Record<string | number, number>;
        };
        reviews?: BackendReviewRow[];
        meta?: {
          current_page?: number;
          last_page?: number;
          per_page?: number;
          total?: number;
        };
      };
    }>("/admin/reviews", {
      params: {
        search: params?.search || undefined,
        star: params?.star ?? params?.rating,
        status: params?.status,
        product_id: params?.product_id,
        sort_by: params?.sort_by || "latest",
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 20,
      },
    });

    const data = response.data?.data;
    const rawReviews = Array.isArray(data?.reviews) ? data.reviews : [];
    const reviews = rawReviews.map(mapBackendReviewToItem);

    const breakdownRaw = data?.summary?.breakdown ?? {};
    const breakdown: Record<number, number> = {
      5: Number(breakdownRaw[5] ?? 0),
      4: Number(breakdownRaw[4] ?? 0),
      3: Number(breakdownRaw[3] ?? 0),
      2: Number(breakdownRaw[2] ?? 0),
      1: Number(breakdownRaw[1] ?? 0),
    };

    return {
      summary: {
        totalReviews: Number(data?.summary?.total_reviews ?? reviews.length),
        averageRating: Number(data?.summary?.average_rating ?? 5),
        breakdown,
      },
      reviews,
      meta: {
        currentPage: Number(data?.meta?.current_page ?? 1),
        lastPage: Number(data?.meta?.last_page ?? 1),
        perPage: Number(data?.meta?.per_page ?? params?.per_page ?? 20),
        total: Number(data?.meta?.total ?? reviews.length),
      },
    };
  },

  /**
   * Get single review detail by ID.
   */
  async getReviewDetail(id: string | number): Promise<AdminReviewItem> {
    const response = await apiClient.get<{ data?: BackendReviewRow }>(
      `/admin/reviews/${id}`
    );
    return mapBackendReviewToItem(response.data?.data ?? { id });
  },

  /**
   * Update review status.
   */
  async updateStatus(
    id: string | number,
    status: "pending" | "approved" | "rejected" | "archived"
  ): Promise<AdminReviewItem> {
    const response = await apiClient.patch<{ data?: BackendReviewRow }>(
      `/admin/reviews/${id}/status`,
      { status }
    );
    return mapBackendReviewToItem(response.data?.data ?? { id, status });
  },

  /**
   * Reply to a review.
   */
  async replyReview(
    id: string | number,
    message: string
  ): Promise<{ id: number | string; message: string }> {
    const response = await apiClient.post<{
      data?: { id: number | string; message: string };
    }>(`/admin/reviews/${id}/reply`, { message });
    return response.data?.data ?? { id, message };
  },

  /**
   * Delete a single review.
   */
  async deleteReview(id: string | number): Promise<void> {
    await apiClient.delete(`/admin/reviews/${id}`);
  },

  /**
   * Bulk delete reviews by IDs.
   */
  async bulkDeleteReviews(ids: Array<string | number>): Promise<number> {
    const numericIds = ids
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    const response = await apiClient.delete<{
      data?: { deleted_count?: number };
    }>("/admin/reviews", {
      data: { review_ids: numericIds },
    });
    return Number(response.data?.data?.deleted_count ?? ids.length);
  },
};

