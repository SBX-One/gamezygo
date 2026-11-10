<?php

namespace App\Http\Resources\Api\V1\Admin\CustomSection;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCustomSectionCreatedResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id'             => $this->id,
      'name'           => $this->title,
      'sort_order'     => (int) $this->order_number,
      'total_products' => 0,
      'products'       => [],
    ];
  }
}

