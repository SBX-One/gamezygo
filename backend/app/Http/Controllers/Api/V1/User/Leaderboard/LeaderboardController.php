<?php

namespace App\Http\Controllers\Api\V1\User\Leaderboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Leaderboard\LeaderboardCollection;
use App\Services\Api\V1\User\Leaderboard\LeaderboardService;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function __construct(
        protected LeaderboardService $leaderboardService
    ) {
    }

    public function index(Request $request): LeaderboardCollection
    {
        $period  = $request->get('period', 'monthly');
        $perPage = (int) $request->get('per_page', 10);

        $leaderboard = $this->leaderboardService->getLeaderboard($period, $perPage);

        return new LeaderboardCollection($leaderboard);
    }
}
