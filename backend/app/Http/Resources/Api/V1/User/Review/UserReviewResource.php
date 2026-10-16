<?php

namespace App\Http\Resources\Api\V1\User\Review;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserReviewResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param Request $request
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id'            => $this->id,
      'product_id'    => $this->product_id,
      'order_item_id' => $this->order_item_id,
      'rating'        => (int) $this->rating,
      'review'        => $this->review,
      'status'        => $this->status,
      'images'        => $this->images->map(function ($image) {
        $url = filter_var($image->file_path, FILTER_VALIDATE_URL)
          ? $image->file_path
          : Storage::disk('public')->url($image->file_path);

        return [
          'id'  => $image->id,
          'url' => $url,
        ];
      })->values(),
      'created_at'    => $this->created_at ? $this->created_at->toIso8601String() : null,
    ];
  }
}
