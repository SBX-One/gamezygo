import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchGameRequests,
  createGameRequest,
  deleteGameRequest,
  voteGameRequest,
  unvoteGameRequest,
  type GameRequestQueryParams,
  type CreateGameRequestPayload,
} from "@/services/requests.service";

export const REQUEST_KEYS = {
  all: ["game-requests"] as const,
  list: (params?: GameRequestQueryParams) =>
    [...REQUEST_KEYS.all, "list", params] as const,
  infinite: (params?: Omit<GameRequestQueryParams, "page">) =>
    [...REQUEST_KEYS.all, "infinite", params] as const,
};

/**
 * Hook to fetch game requests
 */
export function useGameRequests(params?: GameRequestQueryParams) {
  return useQuery({
    queryKey: REQUEST_KEYS.list(params),
    queryFn: () => fetchGameRequests(params),
  });
}

/**
 * Hook to fetch game requests with infinite scroll
 */
export function useInfiniteGameRequests(
  params?: Omit<GameRequestQueryParams, "page">
) {
  return useInfiniteQuery({
    queryKey: REQUEST_KEYS.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchGameRequests({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage?.meta?.current_page ?? 1;
      const last = lastPage?.meta?.last_page ?? 1;
      return current < last ? current + 1 : undefined;
    },
  });
}

/**
 * Hook to submit a new game request
 */
export function useCreateGameRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGameRequestPayload) => createGameRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
    },
  });
}

/**
 * Hook to delete a game request
 */
export function useDeleteGameRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => deleteGameRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
    },
  });
}

/**
 * Hook to upvote a game request
 */
export function useVoteGameRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => voteGameRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
    },
  });
}

/**
 * Hook to cancel upvote / unvote a game request
 */
export function useUnvoteGameRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => unvoteGameRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
    },
  });
}

