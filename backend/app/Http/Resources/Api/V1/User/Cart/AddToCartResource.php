<?php

namespace App\Http\Resources\Api\V1\User\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddToCartResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $cartItem = $this['cart_item'] ?? $this->resource['cart_item'] ?? $this->resource;
    $product = $this['product'] ?? $this->resource['product'] ?? $cartItem->product ?? null;

    $price = (int) ($product?->price ?? 0);
    $discountPrice = (int) ($product && $product->discount_price > 0 && $product->discount_price < $product->price
      ? $product->discount_price
      : $price);
    $discount = (int) ($product?->discount ?? 0);

    return [
      'id'             => $cartItem->id ?? 1,
      'product_id'     => $product?->id ?? (int) $cartItem->product_id,
      'name'           => $product?->name ?? '',
      'slug'           => $product?->slug ?? '',
      'thumbnail'      => $product?->thumbnail,
      'price'          => $price,
      'discount_price' => $discountPrice,
      'discount'       => $discount,
      'quantity'       => 1,
    ];
  }
}
