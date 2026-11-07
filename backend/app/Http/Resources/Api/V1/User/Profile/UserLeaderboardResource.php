<?php

namespace App\Http\Resources\Api\V1\User\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserLeaderboardResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'rank'  => (int) ($this->resource['rank'] ?? 1),
      'point' => (int) ($this->resource['point'] ?? 0),
    ];
  }
}
