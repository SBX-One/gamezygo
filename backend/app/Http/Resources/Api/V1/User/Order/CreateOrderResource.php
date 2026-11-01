<?php

namespace App\Http\Resources\Api\V1\User\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreateOrderResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id'              => $this->id,
      'order_number'    => $this->order_code,
      'status'          => $this->status,
      'subtotal_price'  => (int) $this->subtotal_price,
      'discount_amount' => (int) ($this->discount_amount ?? 0),
      'total_price'     => (int) $this->total_price,
      'expires_at'      => $this->expired_at ? $this->expired_at->toIso8601String() : null,
    ];
  }
}
