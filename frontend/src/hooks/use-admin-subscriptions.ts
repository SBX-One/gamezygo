import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminSubscriptionService,
  type AdminSubscriptionQueryParams,
} from "@/services/admin-subscription.service";
import type { SubscriptionPlan } from "@/features/admin/types/admin-subscription.types";
import type { SectionProduct } from "@/features/admin/types/admin-section.types";
import { toast } from "@/stores/use-toast-store";

export const ADMIN_SUBSCRIPTION_KEYS = {
  all: ["admin", "subscriptions"] as const,
  list: (params?: AdminSubscriptionQueryParams) =>
    [...ADMIN_SUBSCRIPTION_KEYS.all, "list", params] as const,
  availableGames: () =>
    [...ADMIN_SUBSCRIPTION_KEYS.all, "available-games"] as const,
};

export function useAdminSubscriptions(params?: AdminSubscriptionQueryParams) {
  const query = useQuery({
    queryKey: ADMIN_SUBSCRIPTION_KEYS.list(params),
    queryFn: () => adminSubscriptionService.getSubscriptions(params),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawData = query.data;

  return {
    ...query,
    plans: rawData?.plans || [],
    gameStats: rawData?.game_stats || { totalGames: 0, totalValue: "IDR 0" },
    games: rawData?.games || [],
    subscribers: rawData?.subscribers || [],
    meta: rawData?.meta,
  };
}

export function useAdminAvailableSubscriptionGames() {
  return useQuery({
    queryKey: ADMIN_SUBSCRIPTION_KEYS.availableGames(),
    queryFn: () => adminSubscriptionService.getAvailableGames(),
    staleTime: 60 * 1000,
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: {
        title?: string;
        price?: string | number;
        duration?: string;
        period_months?: number;
        benefits?: string[];
      };
    }) => adminSubscriptionService.updatePlan(id, data),
    onSuccess: (updatedPlan: SubscriptionPlan) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SUBSCRIPTION_KEYS.all,
      });
      toast.success(
        `Paket "${updatedPlan.title}" berhasil diperbarui ke database!`,
        "Berhasil Disimpan"
      );
    },
    onError: (err: unknown) => {
      console.error("Gagal memperbarui paket:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memperbarui paket langganan. Silakan coba kembali.";
      toast.error(msg);
    },
  });
}

export function useUpdateSubscriptionGames() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameIds: Array<string | number>) =>
      adminSubscriptionService.updateGames(gameIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SUBSCRIPTION_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "catalog"],
      });
      toast.success(
        `Daftar game paket berhasil diperbarui (${data.games.length} game terdaftar).`,
        "Berhasil Disimpan"
      );
    },
    onError: (err: unknown) => {
      console.error("Gagal memperbarui game paket:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memperbarui daftar game langganan.";
      toast.error(msg);
    },
  });
}

