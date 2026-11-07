<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Dashboard;

interface AdminDashboardRepositoryInterface
{
  /**
   * Resolve date ranges for the requested period.
   *
   * @param string $period
   * @return array{current: ?array, previous: ?array}
   */
  public function resolvePeriodRanges(string $period): array;

  /**
   * Calculate income statistics and percentage growth for the period.
   *
   * @param array|null $currentRange
   * @param array|null $previousRange
   * @return array{total: int, percentage: float, description: string}
   */
  public function getIncomeStats(?array $currentRange, ?array $previousRange): array;

  /**
   * Get orders statistics.
   *
   * @param array|null $currentRange
   * @return array{total: int, description: string}
   */
  public function getOrdersStats(?array $currentRange): array;

  /**
   * Get active users count and total users description.
   *
   * @return array{total: int, description: string}
   */
  public function getUserActiveStats(): array;

  /**
   * Get active subscriptions count.
   *
   * @return array{total: int, description: string}
   */
  public function getActiveSubsStats(): array;

  /**
   * Get top performing products by order count.
   *
   * @param array|null $currentRange
   * @param int $limit
   * @return array<int, array{name: string, total: int}>
   */
  public function getProductPerformance(?array $currentRange, int $limit = 6): array;

  /**
   * Get recent transactions.
   *
   * @param int $limit
   * @return array<int, array{customer_email: string, product_name: string, revenue: string, date: string, status: string}>
   */
  public function getRecentTransactions(int $limit = 6): array;

  /**
   * Get top requested games.
   *
   * @param int $limit
   * @return array<int, array{product_image_url: string, product_name: string, total_request: int, steam_url: string}>
   */
  public function getTopGameRequests(int $limit = 5): array;

  /**
   * Get revenue dashboard transaction metrics for today, week, and month alongside recent transactions.
   *
   * @param int $limit
   * @return array<string, mixed>
   */
  public function getRevenueDashboardData(int $limit = 10): array;
}

