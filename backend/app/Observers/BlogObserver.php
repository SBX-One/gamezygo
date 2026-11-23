<?php

namespace App\Observers;

use App\Models\Blog;
use App\Services\Cache\RedisCacheService;

class BlogObserver
{
  public function __construct(
    protected RedisCacheService $cacheService
  ) {}

  public function saved(Blog $blog): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_BLOGS);
  }

  public function deleted(Blog $blog): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_BLOGS);
  }
}
