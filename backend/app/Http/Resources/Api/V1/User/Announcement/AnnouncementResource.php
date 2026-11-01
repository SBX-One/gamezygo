<?php

namespace App\Http\Resources\Api\V1\User\Announcement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'banner_file_url' => $this->banner_file_url,
            'link'            => $this->link,
            'is_publish'      => (bool) $this->is_published,
            'order_number'    => (int) $this->sort_order,
        ];
    }
}
