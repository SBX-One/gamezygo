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
    const response = await apiClient.get<{ data?: Record<string, unknown> } & Record<string, unknown>>(
      "/admin/subscriptions",
      { params }
    );
    const raw = (response.data?.data ?? response.data ?? {}) as Record<string, unknown>;

    // If backend returned official new structure: { plans, subscription_games }
    if (raw.subscription_games || raw.plans) {
      let subsList: SubscriberAccount[] = [];
      let subsMeta = { current_page: 1, last_page: 1, per_page: 10, total: 0 };
      try {
        const subsRes = await apiClient.get<{ data?: Record<string, unknown> }>(
          "/admin/subscriptions/active-subs",
          { params }
        );
        const subsData = (subsRes.data?.data ?? {}) as Record<string, unknown>;
        const rawSubs = Array.isArray(subsData.users)
          ? (subsData.users as Record<string, unknown>[])
          : Array.isArray(subsData.subscribers)
          ? (subsData.subscribers as Record<string, unknown>[])
          : [];
        subsList = rawSubs.map((s) => {
          const userObj = (s.user ?? {}) as Record<string, unknown>;
          const planObj = (s.subscription_plan ?? {}) as Record<string, unknown>;
          return {
            id: String(s.id || "").padStart(4, "0"),
            db_id: Number(s.id) || undefined,
            name: String(s.user_name || s.name || userObj.name || "User"),
            email: String(s.user_email || s.email || userObj.email || "user@mail.com"),
            plan_name: String(s.plan_name || planObj.name || "Standard"),
            accountCreated: String(s.account_created || s.started_at || "-"),
            subsEnd: String(s.subs_end || s.expired_at || "-"),
            status: (s.status as SubscriberAccount["status"]) || "active",
          };
        });
        if (subsData.pagination) {
          subsMeta = subsData.pagination as typeof subsMeta;
        } else if (subsData.meta) {
          subsMeta = subsData.meta as typeof subsMeta;
        }
      } catch {}

      const rawSubGames = (raw.subscription_games ?? {}) as Record<string, unknown>;
      let gamesList = Array.isArray(rawSubGames.games)
        ? (rawSubGames.games as Record<string, unknown>[])
        : [];
      try {
        const prodsRes = await apiClient.get<{
          data?: { games?: Record<string, unknown>[] } | Record<string, unknown>[];
        }>("/admin/subscriptions/products");
        const prodsData = prodsRes.data?.data;
        if (!Array.isArray(prodsData) && Array.isArray(prodsData?.games)) {
          gamesList = prodsData.games;
        } else if (Array.isArray(prodsData) && prodsData.length > 0) {
          gamesList = prodsData;
        }
      } catch {}

      const formattedGames: SectionProduct[] = gamesList.map((g) => ({
        id: String(g.id),
        title: String(g.name || g.title || ""),
        imageSrc: String(g.image_url || g.imageSrc || g.thumbnail || ""),
        categories: Array.isArray(g.categories)
          ? g.categories.map((c: unknown) =>
              typeof c === "string" ? c : String((c as Record<string, unknown>).name ?? "")
            )
          : [],
        price: Number(g.price) || 0,
      }));

      const totalValueRaw = Number(rawSubGames.total_value || 0);
      const totalGamesCount = Number(rawSubGames.total ?? formattedGames.length);

      const rawPlans = Array.isArray(raw.plans) ? (raw.plans as Record<string, unknown>[]) : [];
      const formattedPlans: SubscriptionPlan[] = rawPlans.map((p) => {
        const months = Number(p.duration_months || 1);
        const cleanPrice = Number(p.price) || 0;
        const rawBenefits = Array.isArray(p.benefits) ? p.benefits : [];
        return {
          id: String(p.id),
          title: String(p.name || p.title || ""),
          duration: `${months} BULAN`,
          price: `IDR ${cleanPrice.toLocaleString("id-ID")}`,
          period: "/ Month",
          benefits: rawBenefits.map((b: unknown) =>
            typeof b === "string"
              ? b
              : String((b as Record<string, unknown>).description || (b as Record<string, unknown>).feature || "")
          ),
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

    return raw as unknown as AdminSubscriptionResponse["data"];
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
          benefits: data.benefits.map((b) => ({ description: b })),
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
    const numericIds = gameIds
      .map((id) => (typeof id === "string" ? parseInt(id, 10) : Number(id)))
      .filter((id) => Number.isFinite(id) && id > 0);
    try {
      const prodsRes = await apiClient.get<{ data?: { games?: Record<string, unknown>[] } }>(
        "/admin/subscriptions/products"
      );
      const currentGames = prodsRes.data?.data?.games;
      const currentIds: number[] = Array.isArray(currentGames)
        ? currentGames
            .map((g) => Number(g.id))
            .filter((id) => Number.isFinite(id) && id > 0)
        : [];

      const toAdd = numericIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !numericIds.includes(id));

      if (toAdd.length > 0) {
        await apiClient.post("/admin/subscriptions/products", {
          product_ids: toAdd,
        });
      }
      if (toRemove.length > 0) {
        await apiClient.delete("/admin/subscriptions/products", {
          data: { product_ids: toRemove },
        });
      }
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
      const response = await apiClient.get<{ data?: Record<string, unknown>[] }>(
        "/admin/custom-sections/all-products"
      );
      const list = response.data?.data || [];
      return list.map((p) => ({
        id: String(p.id),
        title: String(p.name || p.title || ""),
        imageSrc: String(p.image_url || p.imageSrc || p.thumbnail || ""),
        categories: Array.isArray(p.categories)
          ? p.categories.map((c: unknown) =>
              typeof c === "string" ? c : String((c as Record<string, unknown>).name ?? "")
            )
          : [],
        price: Number(p.price) || 0,
      }));
    } catch {
      const response = await apiClient.get<{ data?: AdminAvailableGameItem[] }>(
        "/admin/subscriptions/available-games"
      );
      return response.data?.data || [];
    }
  },
};

