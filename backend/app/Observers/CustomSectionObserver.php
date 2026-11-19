<?php

namespace App\Observers;

use App\Models\CustomSection;
use App\Services\Cache\RedisCacheService;

class CustomSectionObserver
{
  public function __construct(
    protected RedisCacheService $cacheService
  ) {}

  public function saved(CustomSection $section): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_CUSTOM_SECTIONS);
  }

  public function deleted(CustomSection $section): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_CUSTOM_SECTIONS);
  }
}
