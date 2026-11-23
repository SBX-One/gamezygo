import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  fetchReviews,
  fetchUserReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/reviews.service";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  list: () => [...REVIEW_KEYS.all, "list"] as const,
  infinite: () => [...REVIEW_KEYS.all, "infinite"] as const,
  userList: () => [...REVIEW_KEYS.all, "user-list"] as const,
};

/**
 * Hook to fetch approved customer reviews (Public/Guest)
 */
export function useReviews() {
  return useQuery({
    queryKey: REVIEW_KEYS.list(),
    queryFn: () => fetchReviews(),
  });
}

/**
 * Hook to fetch approved customer reviews with infinite scroll
 */
export function useInfiniteReviews() {
  return useInfiniteQuery({
    queryKey: REVIEW_KEYS.infinite(),
    queryFn: ({ pageParam = 1 }) => fetchReviews({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage?.meta?.current_page ?? 1;
      const last = lastPage?.meta?.last_page ?? 1;
      return current < last ? current + 1 : undefined;
    },
  });
}

/**
 * Hook to fetch authenticated user's reviews
 */
export function useUserReviews(enabled: boolean = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: REVIEW_KEYS.userList(),
    queryFn: () => fetchUserReviews(),
    enabled: isAuthenticated && enabled,
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
