import { useQuery } from "@tanstack/react-query";
import {
  fetchLeaderboard,
  fetchUserLeaderboardRank,
  type LeaderboardPeriod,
} from "@/services/leaderboard.service";

export const LEADERBOARD_KEYS = {
  all: ["leaderboard"] as const,
  list: (period: LeaderboardPeriod) =>
    [...LEADERBOARD_KEYS.all, "list", period] as const,
  rank: () => [...LEADERBOARD_KEYS.all, "user-rank"] as const,
};

/**
 * Hook to fetch leaderboard rankings
 */
export function useLeaderboard(period: LeaderboardPeriod = "all-time") {
  return useQuery({
    queryKey: LEADERBOARD_KEYS.list(period),
    queryFn: () => fetchLeaderboard(period),
  });
}

/**
 * Hook to fetch user's personal rank & points
 */
export function useUserLeaderboardRank() {
  return useQuery({
    queryKey: LEADERBOARD_KEYS.rank(),
    queryFn: () => fetchUserLeaderboardRank(),
  });
}
