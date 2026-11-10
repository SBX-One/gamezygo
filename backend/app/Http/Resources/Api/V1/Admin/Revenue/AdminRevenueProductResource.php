<?php

namespace App\Http\Resources\Api\V1\Admin\Revenue;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminRevenueProductResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'product'    => $this->resource['product'],
      'total_sold' => $this->resource['total_sold'],
      'revenue'    => $this->resource['revenue'],
      'rank'       => $this->resource['rank'],
      'last_sold'  => $this->resource['last_sold'],
    ];
  }
}

