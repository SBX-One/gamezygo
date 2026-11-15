<?php

namespace App\Http\Resources\Api\V1\User\Community;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunityTagResource extends JsonResource
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
      'id'   => $this->id,
      'name' => $this->name,
      'slug' => $this->slug,
    ];
  }
}
