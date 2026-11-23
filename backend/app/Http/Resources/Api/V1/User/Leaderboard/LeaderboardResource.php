<?php

namespace App\Http\Resources\Api\V1\User\Leaderboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'rank' => $this->resource['rank'] ?? 0,
            'id' => $this->resource['id'],
            'name' => $this->resource['name'],
            'point' => (int) ($this->resource['point'] ?? 0),
        ];
    }
}
