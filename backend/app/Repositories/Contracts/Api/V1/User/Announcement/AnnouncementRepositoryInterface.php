<?php

namespace App\Repositories\Contracts\Api\V1\User\Announcement;

use Illuminate\Database\Eloquent\Collection;

interface AnnouncementRepositoryInterface
{
    /**
     * Get published announcement banners ordered by sort_order.
     */
    public function getPublishedAnnouncements(): Collection;
}
