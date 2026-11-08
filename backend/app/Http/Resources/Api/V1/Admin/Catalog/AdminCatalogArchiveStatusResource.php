<?php

namespace App\Http\Resources\Api\V1\Admin\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCatalogArchiveStatusResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $isArchived = $this->status === 'archive' || !empty($this->archived_at);

    return [
      'id'          => $this->id,
      'name'        => $this->name,
      'status'      => (string) $this->status,
      'is_archived' => (bool) $isArchived,
      'archived_at' => $this->archived_at ? $this->archived_at->toIso8601String() : null,
    ];
  }
}
