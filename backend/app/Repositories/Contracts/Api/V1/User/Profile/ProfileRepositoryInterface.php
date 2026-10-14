<?php

namespace App\Repositories\Contracts\Api\V1\User\Profile;

use App\Models\User;
use Illuminate\Support\Collection;

interface ProfileRepositoryInterface
{
  /**
   * Get user rankings across different periods (weekly, monthly, all_time).
   *
   * @param User $user
   * @return array
   */
  public function getUserRankings(User $user): array;

  /**
   * Get recent transactions for the user (limited to 3).
   *
   * @param User $user
   * @param int $limit
   * @return Collection
   */
  public function getRecentTransactions(User $user, int $limit = 3): Collection;

  /**
   * Get total number of games owned by the user.
   *
   * @param User $user
   * @return int
   */
  public function getTotalGamesOwned(User $user): int;

  /**
   * Update user profile attributes.
   *
   * @param User $user
   * @param array $data
   * @return User
   */
  public function updateProfile(User $user, array $data): User;
}
