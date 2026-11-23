<?php

namespace App\Repositories\Api\V1\User\Leaderboard;

use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Leaderboard\LeaderboardRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeaderboardRepository implements LeaderboardRepositoryInterface
{
    /**
     * Get paginated leaderboard based on period filter (monthly, weekly, lifetime).
     */
    public function getLeaderboard(string $period = 'monthly', int $perPage = 10): LengthAwarePaginator
    {
        $paginator = User::query()
            ->where('status', 'active')
            ->select('id', 'name', 'total_points')
            ->orderByDesc('total_points')
            ->paginate($perPage);

        $startRank = ($paginator->currentPage() - 1) * $paginator->perPage() + 1;

        $items = collect($paginator->items())->map(function ($user, $index) use ($startRank) {
            return [
                'rank' => $startRank + $index,
                'id' => $user->id,
                'name' => $user->name,
                'point' => (int) $user->total_points,
            ];
        });

        $paginator->setCollection($items);

        return $paginator;
    }
}
