<?php

namespace App\Http\Resources\Api\V1\Admin\Blog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminBlogUpdatedResource extends JsonResource
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
      'title'           => $this->title,
      'slug'            => $this->slug,
      'banner_file_url' => $this->banner_file_url ?? 'https://placehold.co/800x450',
      'status'          => (string) $this->status,
      'updated_at'      => $this->updated_at ? $this->updated_at->toIso8601String() : null,
    ];
  }
}

