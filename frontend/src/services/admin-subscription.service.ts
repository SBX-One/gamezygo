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
    const response = await apiClient.get<any>(
      "/admin/subscriptions",
      { params }
    );
    const raw = response.data?.data || response.data || {};

    // If backend returned official new structure: { plans, subscription_games }
    if (raw.subscription_games || raw.plans) {
      let subsList: any[] = [];
      let subsMeta = { current_page: 1, last_page: 1, per_page: 10, total: 0 };
      try {
        const subsRes = await apiClient.get<any>("/admin/subscriptions/active-subs", { params });
        const subsData = subsRes.data?.data || {};
        subsList = (subsData.subscribers || []).map((s: any) => ({
          id: String(s.id || "").padStart(4, "0"),
          db_id: s.id,
          name: s.user_name || s.name || s.user?.name || "User",
          email: s.user_email || s.email || s.user?.email || "user@mail.com",
          plan_name: s.plan_name || s.subscription_plan?.name || "Standard",
          accountCreated: s.account_created || s.started_at || "-",
          subsEnd: s.subs_end || s.expired_at || "-",
          status: s.status || "active",
        }));
        if (subsData.meta) subsMeta = subsData.meta;
      } catch {}

      let gamesList = raw.subscription_games?.games || [];
      try {
        const prodsRes = await apiClient.get<any>("/admin/subscriptions/products");
        const prodsData = prodsRes.data?.data;
        if (Array.isArray(prodsData) && prodsData.length > 0) {
          gamesList = prodsData;
        }
      } catch {}

      const formattedGames: SectionProduct[] = gamesList.map((g: any) => ({
        id: String(g.id),
        title: g.name || g.title,
        imageSrc: g.image_url || g.imageSrc || g.thumbnail || "",
        categories: Array.isArray(g.categories)
          ? g.categories.map((c: any) => (typeof c === "string" ? c : c.name))
          : [],
        price: Number(g.price) || 0,
      }));

      const totalValueRaw = raw.subscription_games?.total_value || 0;
      const totalGamesCount = raw.subscription_games?.total ?? formattedGames.length;

      const formattedPlans: SubscriptionPlan[] = (raw.plans || []).map((p: any) => {
        const months = p.duration_months || 1;
        const cleanPrice = Number(p.price) || 0;
        return {
          id: String(p.id),
          title: p.name || p.title,
          duration: `${months} BULAN`,
          price: `IDR ${cleanPrice.toLocaleString("id-ID")}`,
          period: "/ Month",
          benefits: (p.benefits || []).map((b: any) => (typeof b === "string" ? b : b.description || b.feature)),
        };
      });

      return {
        plans: formattedPlans,
        game_stats: {
          totalGames: totalGamesCount,
          totalValue: `IDR ${totalValueRaw.toLocaleString("id-ID")}`,
        },
        games: formattedGames,
        subscribers: subsList,
        meta: subsMeta,
      };
    }

    return raw;
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
    const numericId = typeof id === "string" ? parseInt(id.replace(/\D/g, ""), 10) || id : id;
    const cleanPrice = typeof data.price === "string" ? parseInt(data.price.replace(/\D/g, ""), 10) || 0 : data.price;
    const durationMonths = data.period_months || (typeof data.duration === "string" ? parseInt(data.duration.replace(/\D/g, ""), 10) || 1 : 1);

    try {
      await apiClient.put(`/admin/subscriptions/${numericId}`, {
        name: data.title,
        price: cleanPrice,
        duration_months: durationMonths,
      });

      if (data.benefits && data.benefits.length > 0) {
        await apiClient.put(`/admin/subscriptions/${numericId}/features`, {
          benefits: data.benefits,
        });
      }
    } catch {
      await apiClient.put(`/admin/subscriptions/plans/${id}`, data);
    }

    return {
      id: String(id),
      title: data.title || "",
      duration: `${durationMonths} BULAN`,
      price: `IDR ${(cleanPrice || 0).toLocaleString("id-ID")}`,
      period: "/ Month",
      benefits: data.benefits || [],
    };
  },

  /**
   * Sync games supported in the subscription bundle
   */
  async updateGames(
    gameIds: Array<string | number>
  ): Promise<{ games: SectionProduct[]; game_stats: SubscriptionGameStats }> {
    const numericIds = gameIds.map((id) => (typeof id === "string" ? parseInt(id, 10) || id : id));
    try {
      await apiClient.post("/admin/subscriptions/products", {
        product_ids: numericIds,
      });
    } catch {
      await apiClient.put("/admin/subscriptions/games", {
        game_ids: gameIds,
      });
    }
    return {
      games: [],
      game_stats: { totalGames: numericIds.length, totalValue: "IDR 0" },
    };
  },

  /**
   * Fetch all available catalog games for the selection pool in the modal
   */
  async getAvailableGames(): Promise<AdminAvailableGameItem[]> {
    try {
      const response = await apiClient.get<any>("/admin/custom-sections/all-products");
      const list = response.data?.data || [];
      return list.map((p: any) => ({
        id: String(p.id),
        title: p.name || p.title,
        imageSrc: p.image_url || p.imageSrc || p.thumbnail || "",
        categories: Array.isArray(p.categories) ? p.categories.map((c: any) => (typeof c === "string" ? c : c.name)) : [],
        price: Number(p.price) || 0,
      }));
    } catch {
      const response = await apiClient.get<any>("/admin/subscriptions/available-games");
      return response.data?.data || [];
    }
  },
};

