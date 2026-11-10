import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGameRequestService,
  type AdminGameRequestQueryParams,
  type AdminGameRequestsResponse,
} from "@/services/admin-game-request.service";
import type { AdminGameRequestItem } from "@/features/admin/types/admin-game-request.types";

export const ADMIN_GAME_REQUESTS_KEYS = {
  all: ["admin-game-requests"] as const,
  list: (params?: AdminGameRequestQueryParams) =>
    [...ADMIN_GAME_REQUESTS_KEYS.all, "list", params] as const,
};

export function useAdminGameRequests(params?: AdminGameRequestQueryParams) {
  const query = useQuery({
    queryKey: ADMIN_GAME_REQUESTS_KEYS.list(params),
    queryFn: () => adminGameRequestService.getGameRequests(params),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawData: AdminGameRequestsResponse["data"] | undefined = query.data;

  const allItems: AdminGameRequestItem[] = React.useMemo(() => {
    if (!rawData?.requests) return [];

    return rawData.requests.map((item) => ({
      id: String(item.id),
      name: item.name,
      requestCount: item.request_count,
      firstRequest: item.first_request,
      steamUrl: item.steam_url,
      isPinned: Boolean(item.is_pinned),
      status: item.status,
      createdAt: item.created_at || undefined,
      updatedAt: item.updated_at || undefined,
    }));
  }, [rawData?.requests]);

  const pinnedItems = React.useMemo(() => {
    return allItems.filter((item) => item.isPinned);
  }, [allItems]);

  const unpinnedItems = React.useMemo(() => {
    return allItems.filter((item) => !item.isPinned);
  }, [allItems]);

  return {
    ...query,
    items: allItems,
    pinnedItems,
    unpinnedItems,
    counts: rawData?.counts ?? {
      requested: 0,
      accepted: 0,
      declined: 0,
    },
    meta: rawData?.meta,
    totalPages: rawData?.meta?.last_page ?? 1,
    totalCount: rawData?.meta?.total ?? allItems.length,
  };
}

export function useUpdateGameRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string | number;
      status: "accepted" | "declined" | "requested";
      adminNote?: string;
    }) => adminGameRequestService.updateStatus(id, status, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_REQUESTS_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

export function useBatchUpdateGameRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: Array<string | number>;
      status: "accepted" | "declined" | "requested";
    }) => adminGameRequestService.batchUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_REQUESTS_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

export function useToggleGameRequestPin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isPinned,
    }: {
      id: string | number;
      isPinned?: boolean;
    }) => adminGameRequestService.togglePin(id, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_REQUESTS_KEYS.all,
      });
    },
  });
}

export function useDeleteGameRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      adminGameRequestService.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_REQUESTS_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

