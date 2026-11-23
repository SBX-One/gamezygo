<?php

namespace App\Http\Resources\Api\V1\User\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $effectivePrice = $this->discount_price > 0 && $this->discount_price < $this->price
          ? (int) $this->discount_price
          : (int) $this->price;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail,
            'price' => (int) $this->price,
            'discount_price' => $effectivePrice,
            'discount' => (int) $this->discount,
        ];
    }
}
