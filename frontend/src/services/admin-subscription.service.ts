import { apiClient } from "@/lib/api-client";
import type {
  SubscriptionPlan,
  SubscriberAccount,
  SubscriptionGameStats,
} from "@/features/admin/types/admin-subscription.types";
import type { SectionProduct } from "@/features/admin/types/admin-section.types";

export interface AdminSubscriptionQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export interface AdminSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    plans: SubscriptionPlan[];
    game_stats: SubscriptionGameStats;
    games: SectionProduct[];
    subscribers: SubscriberAccount[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface AdminAvailableGameItem extends SectionProduct {
  is_subscription_supported?: boolean;
}

export interface AdminAvailableGamesResponse {
  success: boolean;
  message: string;
  data: AdminAvailableGameItem[];
}

export const adminSubscriptionService = {
  /**
   * Fetch all subscription dashboard data (plans, stats, games, subscribers)
   */
  async getSubscriptions(
    params?: AdminSubscriptionQueryParams
  ): Promise<AdminSubscriptionResponse["data"]> {
    const response = await apiClient.get<AdminSubscriptionResponse>(
      "/admin/subscriptions",
      { params }
    );
    return response.data.data;
  },

  /**
   * Update a subscription plan
   */
  async updatePlan(
    id: string | number,
    data: {
      title?: string;
      price?: string | number;
      duration?: string;
      period_months?: number;
      benefits?: string[];
    }
  ): Promise<SubscriptionPlan> {
    const response = await apiClient.put<{ success: boolean; data: SubscriptionPlan }>(
      `/admin/subscriptions/plans/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Sync games supported in the subscription bundle
   */
  async updateGames(
    gameIds: Array<string | number>
  ): Promise<{ games: SectionProduct[]; game_stats: SubscriptionGameStats }> {
    const response = await apiClient.put<{
      success: boolean;
      data: { games: SectionProduct[]; game_stats: SubscriptionGameStats };
    }>("/admin/subscriptions/games", {
      game_ids: gameIds,
    });
    return response.data.data;
  },

  /**
   * Fetch all available catalog games for the selection pool in the modal
   */
  async getAvailableGames(): Promise<AdminAvailableGameItem[]> {
    const response = await apiClient.get<AdminAvailableGamesResponse>(
      "/admin/subscriptions/available-games"
    );
    return response.data.data;
  },
};

