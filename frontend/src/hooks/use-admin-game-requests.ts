import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGameRequestService,
  type AdminGameRequestQueryParams,
} from "@/services/admin-game-request.service";
import type {
  AdminGameRequestItem,
  GameRequestStatus,
} from "@/features/admin/types/admin-game-request.types";

export const ADMIN_GAME_REQUESTS_KEYS = {
  all: ["admin-game-requests"] as const,
  list: (params?: AdminGameRequestQueryParams) =>
    [...ADMIN_GAME_REQUESTS_KEYS.all, "list", params] as const,
  counts: () => [...ADMIN_GAME_REQUESTS_KEYS.all, "counts"] as const,
};

export function useAdminGameRequests(params?: AdminGameRequestQueryParams) {
  const query = useQuery({
    queryKey: ADMIN_GAME_REQUESTS_KEYS.list(params),
    queryFn: () => adminGameRequestService.getGameRequests(params),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const countsQuery = useQuery({
    queryKey: ADMIN_GAME_REQUESTS_KEYS.counts(),
    queryFn: () => adminGameRequestService.getCounts(),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const pinnedItems: AdminGameRequestItem[] = React.useMemo(
    () => query.data?.pinnedItems ?? [],
    [query.data?.pinnedItems]
  );

  const unpinnedItems: AdminGameRequestItem[] = React.useMemo(
    () => query.data?.unpinnedItems ?? [],
    [query.data?.unpinnedItems]
  );

  const allItems: AdminGameRequestItem[] = React.useMemo(
    () => [...pinnedItems, ...unpinnedItems],
    [pinnedItems, unpinnedItems]
  );

  return {
    ...query,
    items: allItems,
    pinnedItems,
    unpinnedItems,
    counts: countsQuery.data ?? {
      requested: 0,
      accepted: 0,
      declined: 0,
    },
    meta: query.data?.meta,
    totalPages: Math.max(1, query.data?.meta?.last_page ?? 1),
    totalCount: query.data?.totalRequests ?? allItems.length,
  };
}

export function useUpdateGameRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string | number;
      status: GameRequestStatus;
      adminNote?: string;
    }) => adminGameRequestService.updateStatus(id, status),
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
      status: GameRequestStatus;
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
    }: {
      id: string | number;
      isPinned?: boolean;
    }) => adminGameRequestService.togglePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_REQUESTS_KEYS.all,
      });
    },
  });
}
