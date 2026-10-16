<?php

namespace App\Http\Resources\Api\V1\User\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $items = $this['items'] ?? $this->resource['items'] ?? [];
    $totalPrices = (int) ($this['total_prices'] ?? $this['total_price'] ?? $this->resource['total_prices'] ?? $this->resource['total_price'] ?? 0);

    return [
      'total_prices' => $totalPrices,
      'items'        => CartItemResource::collection($items),
    ];
  }
}
