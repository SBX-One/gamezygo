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
 * Endpoint (user.php): GET /api/v1/leaderboards?period=all-time|monthly|weekly
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod = "all-time"
): Promise<ApiResponse<LeaderboardItem[]>> {
  try {
    return await apiGet<ApiResponse<LeaderboardItem[]>>(
      `/leaderboards?period=${period}`
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
 * Queries both /user/profile/leaderboard and /user/profile so DB points & rankings stay in sync.
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
    const [lbResult, profileResult] = await Promise.allSettled([
      apiGet<{
        data?: {
          rank?: number;
          point?: number;
          points?: number;
          total_points?: number;
        };
      }>("/user/profile/leaderboard"),
      apiGet<{
        data?: {
          name?: string;
          avatar_url?: string;
          points?: number;
          total_points?: number;
          rankings?: {
            monthly?: number;
            weekly?: number;
            all_time?: number;
          };
        };
      }>("/user/profile"),
    ]);

    const lbData =
      lbResult.status === "fulfilled" ? lbResult.value?.data : undefined;
    const profileData =
      profileResult.status === "fulfilled"
        ? profileResult.value?.data
        : undefined;

    const resolvedPoints = Number(
      profileData?.total_points ??
        profileData?.points ??
        lbData?.point ??
        lbData?.points ??
        lbData?.total_points ??
        0
    );

    const resolvedRank = Number(
      lbData?.rank ??
        profileData?.rankings?.monthly ??
        profileData?.rankings?.all_time ??
        0
    );

    return {
      success: true,
      message: "User rank retrieved",
      data: {
        rank: resolvedRank,
        point: resolvedPoints,
        rankings: profileData?.rankings,
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
