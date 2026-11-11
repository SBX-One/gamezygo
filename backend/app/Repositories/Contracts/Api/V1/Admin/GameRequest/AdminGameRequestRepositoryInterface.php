<?php

namespace App\Repositories\Contracts\Api\V1\Admin\GameRequest;

interface AdminGameRequestRepositoryInterface
{
  /**
   * Get list of pinned and requested games with pagination and filters.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getGameRequests(array $filters): array;

  /**
   * Get single game request detail by ID.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getGameRequestById(int $id): array;

  /**
   * Toggle pin status for a game request.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function togglePin(int $id): array;

  /**
   * Bulk update status for multiple game requests.
   *
   * @param array<int> $requestIds
   * @param string $status
   * @return array<string, mixed>
   */
  public function updateStatus(array $requestIds, string $status): array;
}

