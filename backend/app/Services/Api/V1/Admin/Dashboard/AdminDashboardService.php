<?php

namespace App\Services\Api\V1\Admin\Dashboard;

use App\Repositories\Contracts\Api\V1\Admin\Dashboard\AdminDashboardRepositoryInterface;

class AdminDashboardService
{
    public function __construct(
        protected AdminDashboardRepositoryInterface $dashboardRepository
    ) {}

    /**
     * Aggregate and return full dashboard metrics.
     *
     * @return array<string, mixed>
     */
    public function getDashboardData(string $period = 'today'): array
    {
        $ranges = $this->dashboardRepository->resolvePeriodRanges($period);

        $currentRange = $ranges['current'];
        $previousRange = $ranges['previous'];

        $income = $this->dashboardRepository->getIncomeStats($currentRange, $previousRange);
        $orders = $this->dashboardRepository->getOrdersStats($currentRange);
        $userActive = $this->dashboardRepository->getUserActiveStats();
        $activeSubs = $this->dashboardRepository->getActiveSubsStats();
        $productPerformance = $this->dashboardRepository->getProductPerformance($currentRange);
        $recentTransactions = $this->dashboardRepository->getRecentTransactions(6);
        $gameRequests = $this->dashboardRepository->getTopGameRequests(5);

        return [
            'income' => $income,
            'orders' => $orders,
            'user_active' => $userActive,
            'active_subs' => $activeSubs,
            'product_performance' => $productPerformance,
            'recent_transactions' => $recentTransactions,
            'game_requests' => $gameRequests,
        ];
    }

    /**
     * Aggregate revenue dashboard transaction metrics for today, week, month, and recent transactions.
     *
     * @return array<string, mixed>
     */
    public function getRevenueTransactionsData(int $limit = 10): array
    {
        return $this->dashboardRepository->getRevenueDashboardData($limit);
    }
}
