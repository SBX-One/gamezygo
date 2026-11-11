import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAnnouncementService,
  type AdminAnnouncementSavePayload,
  type AdminAnnouncementUpdatePayload,
} from "@/services/admin-announcement.service";
import { COMMON_KEYS } from "@/hooks/use-common";
import type { AdminAnnouncementItem } from "@/features/admin/types/admin-announcement.types";
import { resolveImageUrl } from "@/utils/image-url";

export const ADMIN_ANNOUNCEMENTS_KEYS = {
  all: ["admin-announcements"] as const,
  list: () => [...ADMIN_ANNOUNCEMENTS_KEYS.all, "list"] as const,
};

function resolveBannerImage(url?: string | null): string {
  const trimmed = url?.trim() || "";
  if (!trimmed) return "/assets/png/Banner.png";
  if (trimmed.startsWith("/assets/")) return trimmed;
  return resolveImageUrl(trimmed, "/assets/png/Banner.png");
}

function formatLastEdit(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function useAdminAnnouncements() {
  const query = useQuery({
    queryKey: ADMIN_ANNOUNCEMENTS_KEYS.list(),
    queryFn: () => adminAnnouncementService.getAnnouncements(),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const rawItems = query.data;

  const announcements: AdminAnnouncementItem[] = React.useMemo(() => {
    if (!rawItems) return [];

    return rawItems.map((item) => ({
      id: String(item.id),
      pageLink: item.link || "",
      imageUrl: resolveBannerImage(item.banner_file_url),
      isPublished: Boolean(item.is_published),
      orderNumber: Number(item.order_number ?? 0),
      lastEdit: formatLastEdit(item.updated_at),
    }));
  }, [rawItems]);

  return {
    ...query,
    announcements,
  };
}

export function useCreateAdminAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminAnnouncementSavePayload) =>
      adminAnnouncementService.createAnnouncement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.announcements });
    },
  });
}

export function useUpdateAdminAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: AdminAnnouncementUpdatePayload;
    }) => adminAnnouncementService.updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.announcements });
    },
  });
}

export function useSortAdminAnnouncements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: Array<number | string>) =>
      adminAnnouncementService.sortAnnouncements(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.announcements });
    },
  });
}

export function useDeleteAdminAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      adminAnnouncementService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMON_KEYS.announcements });
    },
  });
}

