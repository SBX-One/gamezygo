import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCommunityService,
  type AdminCommunitySavePayload,
  type AdminCommunityUpdatePayload,
} from "@/services/admin-community.service";
import { COMMON_KEYS } from "@/hooks/use-common";
import type { AdminCommunityItem } from "@/features/admin/types/admin-community.types";
import { resolveImageUrl } from "@/utils/image-url";

export const ADMIN_COMMUNITIES_KEYS = {
  all: ["admin-communities"] as const,
  list: () => [...ADMIN_COMMUNITIES_KEYS.all, "list"] as const,
  tags: () => [...ADMIN_COMMUNITIES_KEYS.all, "tags"] as const,
};

const DEFAULT_COMMUNITY_COVER =
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg";

function resolveCommunityImage(url?: string | null): string {
  const trimmed = url?.trim() || "";
  if (!trimmed) return "";
  if (trimmed.startsWith("/assets/")) return trimmed;
  return resolveImageUrl(trimmed, DEFAULT_COMMUNITY_COVER);
}

export function useAdminCommunities() {
  const query = useQuery({
    queryKey: ADMIN_COMMUNITIES_KEYS.list(),
    queryFn: () => adminCommunityService.getCommunities(),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawItems = query.data;

  const communities: AdminCommunityItem[] = React.useMemo(() => {
    if (!rawItems) return [];

    return rawItems.map((item) => {
      const tagNames = Array.isArray(item.tags)
        ? item.tags.map((t) => t.name).filter(Boolean)
        : [];
      const tagJoined = tagNames.length > 0 ? tagNames.join(", ") : item.tag || "";

      return {
        id: String(item.id),
        name: item.name,
        pageLink: item.link || "",
        tag: tagJoined,
        tags: tagNames,
        imageUrl: resolveCommunityImage(item.banner_file_url),
        orderNumber: Number(item.order_number ?? 0),
        isActive: item.is_active !== false,
        createdAt: item.created_at || undefined,
      };
    });
  }, [rawItems]);

  return {
    ...query,
    communities,
  };
}

export function useAdminCommunityTags() {
  return useQuery({
    queryKey: ADMIN_COMMUNITIES_KEYS.tags(),
    queryFn: () => adminCommunityService.getTags(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useCreateAdminCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminCommunitySavePayload) =>
      adminCommunityService.createCommunity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITIES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.communities });
    },
  });
}

export function useUpdateAdminCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: AdminCommunityUpdatePayload;
    }) => adminCommunityService.updateCommunity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITIES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.communities });
    },
  });
}

export function useSortAdminCommunities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: Array<number | string>) =>
      adminCommunityService.sortCommunities(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITIES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.communities });
    },
  });
}

export function useDeleteAdminCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      adminCommunityService.deleteCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITIES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.communities });
    },
  });
}

