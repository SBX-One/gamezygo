import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/reviews.service";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  list: () => [...REVIEW_KEYS.all, "list"] as const,
};

/**
 * Hook to fetch approved customer reviews
 */
export function useReviews() {
  return useQuery({
    queryKey: REVIEW_KEYS.list(),
    queryFn: () => fetchReviews(),
  });
}

/**
 * Hook to submit a new review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createReview(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}

/**
 * Hook to update a review
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      formData,
    }: {
      reviewId: number | string;
      formData: FormData;
    }) => updateReview(reviewId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number | string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}
