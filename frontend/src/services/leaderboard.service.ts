import { apiGet } from "@/lib/api-client";
import { useAuthStore } from "@/stores/use-auth-store";
import type {
  ApiResponse,
  LeaderboardItem,
  UserLeaderboardRank,
} from "@/types";

export type LeaderboardPeriod = "all-time" | "monthly" | "weekly";

/**
 * Fetch leaderboard rankings
 * Endpoint: GET /api/v1/user/leaderboards?period=all-time|monthly|weekly
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod = "all-time"
): Promise<ApiResponse<LeaderboardItem[]>> {
  const periodParam = period === "all-time" ? "monthly" : period;
  try {
    return await apiGet<ApiResponse<LeaderboardItem[]>>(
      `/user/leaderboards?period=${periodParam}`
    );
  } catch {
    return {
      success: true,
      message: "Fallback leaderboard",
      data: [],
    };
  }
}

/**
 * Fetch current user rank and points
 * Fetches from user profile if authenticated; returns fallback for guest.
 */
export async function fetchUserLeaderboardRank(): Promise<
  ApiResponse<UserLeaderboardRank>
> {
  const token = useAuthStore.getState().token;
  if (!token) {
    return {
      success: true,
      message: "Guest user",
      data: {
        rank: 0,
        point: 0,
      },
    };
  }

  try {
    const res = await apiGet<{
      data?: {
        name?: string;
        avatar_url?: string;
        total_points?: number;
        rankings?: {
          monthly?: number;
          weekly?: number;
          all_time?: number;
        };
      };
    }>("/user/profile");

    const profileData = res.data;
    return {
      success: true,
      message: "User rank retrieved",
      data: {
        rank: profileData?.rankings?.monthly || 1,
        point: profileData?.total_points || 0,
      },
    };
  } catch {
    return {
      success: true,
      message: "Default user rank",
      data: {
        rank: 0,
        point: 0,
      },
    };
  }
}
