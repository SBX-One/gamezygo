<?php

namespace App\Observers;

use App\Models\Review;
use App\Services\Cache\RedisCacheService;

class ReviewObserver
{
    public function __construct(
        protected RedisCacheService $cacheService
    ) {}

    public function saved(Review $review): void
    {
        $this->cacheService->flushTags([
            RedisCacheService::TAG_REVIEWS,
            RedisCacheService::TAG_PRODUCTS,
        ]);
    }

    public function deleted(Review $review): void
    {
        $this->cacheService->flushTags([
            RedisCacheService::TAG_REVIEWS,
            RedisCacheService::TAG_PRODUCTS,
        ]);
    }
}
