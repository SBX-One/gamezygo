<?php

namespace App\Repositories\Api\V1\User\Announcement;

use App\Models\Announcement;
use App\Repositories\Contracts\Api\V1\User\Announcement\AnnouncementRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementRepository implements AnnouncementRepositoryInterface
{
    /**
     * Get published announcement banners ordered by sort_order.
     *
     * @return Collection
     */
    public function getPublishedAnnouncements(): Collection
    {
        return Announcement::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();
    }
}
