<?php

namespace App\Services\Api\V1\User\Leaderboard;

use App\Repositories\Contracts\Api\V1\User\Leaderboard\LeaderboardRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeaderboardService
{
    public function __construct(
        protected LeaderboardRepositoryInterface $leaderboardRepository,
        protected RedisCacheService $cacheService
    ) {}

    /**
     * Fetch paginated leaderboard by period (monthly, weekly, lifetime).
     */
    public function getLeaderboard(string $period = 'monthly', int $perPage = 10): LengthAwarePaginator
    {
        $page = request()->get('page', 1);
        $cacheKey = "leaderboard:{$period}:{$perPage}:page:{$page}";

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_SHORT,
            fn () => $this->leaderboardRepository->getLeaderboard($period, $perPage),
            [RedisCacheService::TAG_LEADERBOARD]
        );
    }
}
