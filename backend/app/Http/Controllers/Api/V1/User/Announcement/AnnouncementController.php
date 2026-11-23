<?php

namespace App\Http\Controllers\Api\V1\User\Announcement;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Announcement\AnnouncementCollection;
use App\Services\Api\V1\User\Announcement\AnnouncementService;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function __construct(
        protected AnnouncementService $announcementService
    ) {}

    public function index(Request $request): AnnouncementCollection
    {
        $announcements = $this->announcementService->getPublishedAnnouncements();

        return new AnnouncementCollection($announcements);
    }
}
