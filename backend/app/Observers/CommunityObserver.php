<?php

namespace App\Observers;

use App\Models\Community;
use App\Services\Cache\RedisCacheService;

class CommunityObserver
{
    public function __construct(
        protected RedisCacheService $cacheService
    ) {}

    public function saved(Community $community): void
    {
        $this->cacheService->flushTags(RedisCacheService::TAG_COMMUNITIES);
    }

    public function deleted(Community $community): void
    {
        $this->cacheService->flushTags(RedisCacheService::TAG_COMMUNITIES);
    }
}
