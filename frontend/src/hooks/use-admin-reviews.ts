import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminReviewService,
  type AdminReviewQueryParams,
} from "@/services/admin-review.service";

export const ADMIN_REVIEWS_KEYS = {
  all: ["admin-reviews"] as const,
  list: (params?: AdminReviewQueryParams) =>
    [...ADMIN_REVIEWS_KEYS.all, "list", params] as const,
  detail: (id: string | number) =>
    [...ADMIN_REVIEWS_KEYS.all, "detail", String(id)] as const,
};

export function useAdminReviews(params?: AdminReviewQueryParams) {
  return useQuery({
    queryKey: ADMIN_REVIEWS_KEYS.list(params),
    queryFn: () => adminReviewService.getReviews(params),
    staleTime: 30 * 1000,
  });
}

export function useAdminReviewDetail(id?: string | number | null) {
  return useQuery({
    queryKey: ADMIN_REVIEWS_KEYS.detail(id ?? ""),
    queryFn: () => adminReviewService.getReviewDetail(id!),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useUpdateAdminReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string | number;
      status: "pending" | "approved" | "rejected" | "archived";
    }) => adminReviewService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useReplyAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      message,
    }: {
      id: string | number;
      message: string;
    }) => adminReviewService.replyReview(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => adminReviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useBulkDeleteAdminReviews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: Array<string | number>) =>
      adminReviewService.bulkDeleteReviews(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

