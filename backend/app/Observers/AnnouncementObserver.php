<?php

namespace App\Observers;

use App\Models\Announcement;
use App\Services\Cache\RedisCacheService;

class AnnouncementObserver
{
  public function __construct(
    protected RedisCacheService $cacheService
  ) {}

  public function saved(Announcement $announcement): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_ANNOUNCEMENTS);
  }

  public function deleted(Announcement $announcement): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_ANNOUNCEMENTS);
  }
}
