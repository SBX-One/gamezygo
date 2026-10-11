import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  LeaderboardItem,
  UserLeaderboardRank,
} from "@/types";

export type LeaderboardPeriod = "all-time" | "monthly" | "weekly";

/**
 * Fetch leaderboard rankings
 * Endpoint: GET /api/v1/user/leaderboards/?period=all-time|monthly|weekly
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod = "all-time"
): Promise<ApiResponse<LeaderboardItem[]>> {
  const periodParam = period === "all-time" ? "" : period;
  return apiGet<ApiResponse<LeaderboardItem[]>>(
    `/user/leaderboards/?period=${periodParam}`
  );
}

/**
 * Fetch current user rank and points
 * Endpoint: GET /api/v1/user/profile/leaderboard
 */
export async function fetchUserLeaderboardRank(): Promise<
  ApiResponse<UserLeaderboardRank>
> {
  return apiGet<ApiResponse<UserLeaderboardRank>>("/user/profile/leaderboard");
}
