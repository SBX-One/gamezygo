<?php

namespace App\Services\Api\V1\User\Announcement;

use App\Repositories\Contracts\Api\V1\User\Announcement\AnnouncementRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementService
{
    public function __construct(
        protected AnnouncementRepositoryInterface $announcementRepository,
        protected RedisCacheService $cacheService
    ) {}

    /**
     * Fetch published announcements.
     */
    public function getPublishedAnnouncements(): Collection
    {
        return $this->cacheService->remember(
            'announcements:published',
            RedisCacheService::TTL_LONG,
            fn () => $this->announcementRepository->getPublishedAnnouncements(),
            [RedisCacheService::TAG_ANNOUNCEMENTS]
        );
    }
}
