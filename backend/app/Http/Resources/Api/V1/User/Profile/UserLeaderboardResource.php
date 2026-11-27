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
        $point = (int) ($this->resource['point'] ?? $this->resource['points'] ?? 0);

        return [
            'rank' => (int) ($this->resource['rank'] ?? 1),
            'point' => $point,
            'points' => $point,
        ];
    }
}
