import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  LeaderboardItem,
  UserLeaderboardRank,
} from "@/types";

export type LeaderboardPeriod = "all-time" | "monthly" | "weekly";

/**
 * Fetch leaderboard rankings
 * Endpoint: GET /api/v1/user/leaderboard/?period=all-time|monthly|weekly
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod = "all-time"
): Promise<ApiResponse<LeaderboardItem[]>> {
  return apiGet<ApiResponse<LeaderboardItem[]>>(
    `/user/leaderboard/?period=${period}`
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
