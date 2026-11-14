<?php

namespace App\Repositories\Contracts\Api\V1\User\Community;

use App\Models\Community;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CommunityRepositoryInterface
{
  /**
   * Get active communities with optional filters and pagination.
   *
   * @param array<string, mixed> $filters
   * @return LengthAwarePaginator|Collection
   */
  public function getActiveCommunities(array $filters = []): LengthAwarePaginator|Collection;

  /**
   * Get single active community by ID.
   *
   * @param int $id
   * @return Community|null
   */
  public function getActiveCommunityById(int $id): ?Community;

  /**
   * Get available community tags.
   *
   * @return Collection
   */
  public function getActiveTags(): Collection;
}
