<?php

namespace App\Http\Resources\Api\V1\User\Community;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunityResource extends JsonResource
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
      'id'              => $this->id,
      'name'            => $this->name,
      'banner_file_url' => $this->banner_file_url,
      'link'            => $this->link,
      'is_active'       => (bool) $this->is_active,
      'order_number'    => (int) $this->order_number,
      'tags'            => CommunityTagResource::collection($this->whenLoaded('tags')),
      'created_at'      => $this->created_at?->toISOString(),
      'updated_at'      => $this->updated_at?->toISOString(),
    ];
  }
}
