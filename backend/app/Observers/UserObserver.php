<?php

namespace App\Observers;

use App\Models\User;
use App\Services\Cache\RedisCacheService;

class UserObserver
{
    public function __construct(
        protected RedisCacheService $cacheService
    ) {}

    public function saved(User $user): void
    {
        $this->cacheService->flushTags([
            RedisCacheService::userTag($user->id),
            RedisCacheService::TAG_LEADERBOARD,
        ]);
    }

    public function deleted(User $user): void
    {
        $this->cacheService->flushTags([
            RedisCacheService::userTag($user->id),
            RedisCacheService::TAG_LEADERBOARD,
        ]);
    }
}
