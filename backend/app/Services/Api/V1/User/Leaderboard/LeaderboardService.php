<?php

namespace App\Services\Api\V1\User\Leaderboard;

use App\Repositories\Contracts\Api\V1\User\Leaderboard\LeaderboardRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeaderboardService
{
    public function __construct(
        protected LeaderboardRepositoryInterface $leaderboardRepository
    ) {
    }

    /**
     * Fetch paginated leaderboard by period (monthly, weekly, lifetime).
     *
     * @param string $period
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getLeaderboard(string $period = 'monthly', int $perPage = 10): LengthAwarePaginator
    {
        return $this->leaderboardRepository->getLeaderboard($period, $perPage);
    }
}
