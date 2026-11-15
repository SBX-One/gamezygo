<?php

namespace App\Services\Api\V1\User\Community;

use App\Models\Community;
use App\Repositories\Contracts\Api\V1\User\Community\CommunityRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CommunityService
{
  public function __construct(
    protected CommunityRepositoryInterface $communityRepository
  ) {}

  /**
   * Get active communities.
   *
   * @param array<string, mixed> $filters
   * @return LengthAwarePaginator|Collection
   */
  public function getActiveCommunities(array $filters = []): LengthAwarePaginator|Collection
  {
    return $this->communityRepository->getActiveCommunities($filters);
  }

  /**
   * Get single active community by ID.
   *
   * @param int $id
   * @return Community|null
   */
  public function getActiveCommunityById(int $id): ?Community
  {
    return $this->communityRepository->getActiveCommunityById($id);
  }

  /**
   * Get active community tags.
   *
   * @return Collection
   */
  public function getCommunityTags(): Collection
  {
    return $this->communityRepository->getActiveTags();
  }
}
