<?php

namespace App\Repositories\Contracts\Api\V1\User\Leaderboard;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LeaderboardRepositoryInterface
{
    /**
     * Get paginated leaderboard based on period filter (monthly, weekly, lifetime).
     *
     * @param string $period
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getLeaderboard(string $period = 'monthly', int $perPage = 10): LengthAwarePaginator;
}
