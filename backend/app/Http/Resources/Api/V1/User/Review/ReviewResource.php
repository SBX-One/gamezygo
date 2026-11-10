<?php

namespace App\Http\Resources\Api\V1\User\Review;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
      'images' => $this->images->map(function ($image) {
        $url = filter_var($image->file_path, FILTER_VALIDATE_URL)
          ? $image->file_path
          : Storage::disk('public')->url($image->file_path);

        return [
          'id'       => $image->id,
          'url'      => $url,
          'file_url' => $url,
        ];
      })->values(),
    ];
  }
}
