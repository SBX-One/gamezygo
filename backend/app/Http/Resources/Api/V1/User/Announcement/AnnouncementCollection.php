<?php

namespace App\Http\Resources\Api\V1\User\Announcement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AnnouncementCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Announcements retrieved successfully',
            'data' => AnnouncementResource::collection($this->collection),
        ];
    }
}
