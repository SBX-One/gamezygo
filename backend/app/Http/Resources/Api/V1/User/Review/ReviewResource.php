<?php

namespace App\Http\Resources\Api\V1\User\Review;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'     => $this->id,
            'user'   => [
                'avatar_url' => $this->user?->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->user?->name ?? 'User'),
                'name'       => $this->user?->name ?? 'Anonymous',
            ],
            'review' => $this->review,
            'rating' => (int) $this->rating,
            'status' => $this->status,
            'images' => $this->relationLoaded('images')
                ? $this->images->map(function ($image) {
                    return [
                        'file_url' => $image->file_path,
                    ];
                })
                : [],
        ];
    }
}
