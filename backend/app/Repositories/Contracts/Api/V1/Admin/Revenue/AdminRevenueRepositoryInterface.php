<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Revenue;

interface AdminRevenueRepositoryInterface
{
  /**
   * Get revenue dashboard data.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getRevenueDashboard(array $filters = []): array;

  /**
   * Get revenue metrics for a specific product.
   *
   * @param int $productId
   * @return array<string, mixed>
   */
  public function getProductRevenue(int $productId): array;
}

