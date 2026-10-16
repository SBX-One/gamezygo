<?php

namespace App\Http\Resources\Api\V1\User\GameRequest;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameRequestResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id'         => $this->id,
      'name'       => $this->name,
      'steam_url'  => $this->steam_url,
      'status'     => $this->status,
      'note'       => $this->note,
      'admin_note' => $this->admin_note,
      'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
      'updated_at' => $this->updated_at ? $this->updated_at->toIso8601String() : null,
    ];
  }
}
