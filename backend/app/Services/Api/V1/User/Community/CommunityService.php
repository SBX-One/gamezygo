<?php

namespace App\Services\Api\V1\User\Community;

use App\Models\Community;
use App\Repositories\Contracts\Api\V1\User\Community\CommunityRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CommunityService
{
  public function __construct(
    protected CommunityRepositoryInterface $communityRepository,
    protected RedisCacheService $cacheService
  ) {}

  /**
   * Get active communities.
   *
   * @param array<string, mixed> $filters
   * @return LengthAwarePaginator|Collection
   */
  public function getActiveCommunities(array $filters = []): LengthAwarePaginator|Collection
  {
    $page = request()->get('page', 1);
    $cacheKey = 'communities:active:list:' . md5(json_encode($filters) . ":page:{$page}");

    return $this->cacheService->remember(
      $cacheKey,
      RedisCacheService::TTL_LONG,
      fn () => $this->communityRepository->getActiveCommunities($filters),
      [RedisCacheService::TAG_COMMUNITIES]
    );
  }

  /**
   * Get single active community by ID.
   *
   * @param int $id
   * @return Community|null
   */
  public function getActiveCommunityById(int $id): ?Community
  {
    $cacheKey = "communities:detail:{$id}";

    return $this->cacheService->remember(
      $cacheKey,
      RedisCacheService::TTL_LONG,
      fn () => $this->communityRepository->getActiveCommunityById($id),
      [RedisCacheService::TAG_COMMUNITIES]
    );
  }

  /**
   * Get active community tags.
   *
   * @return Collection
   */
  public function getCommunityTags(): Collection
  {
    return $this->cacheService->remember(
      'communities:tags',
      RedisCacheService::TTL_EXTENDED,
      fn () => $this->communityRepository->getActiveTags(),
      [RedisCacheService::TAG_COMMUNITIES]
    );
  }
}
