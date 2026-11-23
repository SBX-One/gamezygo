<?php

namespace App\Http\Resources\Api\V1\User\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderVoucherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_code,
            'voucher_id' => $this->voucher_id ? (int) $this->voucher_id : null,
            'subtotal_price' => (int) $this->subtotal_price,
            'discount_amount' => (int) ($this->discount_amount ?? 0),
            'total_price' => (int) $this->total_price,
        ];
    }
}
