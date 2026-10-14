<?php

namespace App\Repositories\Api\V1\User\Profile;

use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Profile\ProfileRepositoryInterface;
use Illuminate\Support\Collection;

class ProfileRepository implements ProfileRepositoryInterface
{
  /**
   * Get user rankings across different periods (weekly, monthly, all_time).
   *
   * @param User $user
   * @return array
   */
  public function getUserRankings(User $user): array
  {
    $points = (int) $user->total_points;

    $allTimeRank = User::where('status', 'active')
      ->where('total_points', '>', $points)
      ->count() + 1;

    $weeklyRank = User::where('status', 'active')
      ->where('total_points', '>', $points)
      ->where('updated_at', '>=', now()->startOfWeek())
      ->count() + 1;

    $monthlyRank = User::where('status', 'active')
      ->where('total_points', '>', $points)
      ->where('updated_at', '>=', now()->startOfMonth())
      ->count() + 1;

    return [
      'weekly'   => $weeklyRank,
      'monthly'  => $monthlyRank,
      'all_time' => $allTimeRank,
    ];
  }

  /**
   * Get recent transactions for the user (limited to 3).
   *
   * @param User $user
   * @param int $limit
   * @return Collection
   */
  public function getRecentTransactions(User $user, int $limit = 3): Collection
  {
    return $user->orders()
      ->withCount('items')
      ->orderByDesc('id')
      ->take($limit)
      ->get();
  }

  /**
   * Get total number of games owned by the user.
   *
   * @param User $user
   * @return int
   */
  public function getTotalGamesOwned(User $user): int
  {
    return $user->ownedGames()->count();
  }

  /**
   * Update user profile attributes.
   *
   * @param User $user
   * @param array $data
   * @return User
   */
  public function updateProfile(User $user, array $data): User
  {
    $user->update($data);

    return $user->fresh();
  }
}
