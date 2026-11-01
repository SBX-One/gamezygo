<?php

namespace App\Services\Api\V1\User\Announcement;

use App\Repositories\Contracts\Api\V1\User\Announcement\AnnouncementRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementService
{
    public function __construct(
        protected AnnouncementRepositoryInterface $announcementRepository
    ) {
    }

    /**
     * Fetch published announcements.
     *
     * @return Collection
     */
    public function getPublishedAnnouncements(): Collection
    {
        return $this->announcementRepository->getPublishedAnnouncements();
    }
}
