<?php

namespace App\Http\Resources\Api\V1\User\Order;

use App\Models\Product;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_code,
            'status' => $this->status,
            'subtotal_price' => (int) $this->subtotal_price,
            'discount_amount' => (int) ($this->discount_amount ?? 0),
            'total_price' => (int) $this->total_price,
            'expires_at' => $this->expired_at ? $this->expired_at->toIso8601String() : null,
            'order_items' => $this->items->map(function ($item) {
                $purchasable = $item->purchasable;
                $isProduct = $purchasable instanceof Product;
                $isSubscription = $purchasable instanceof SubscriptionPlan;

                return [
                    'id' => $item->id,
                    'item_type' => $isProduct ? 'product' : ($isSubscription ? 'subscription' : 'item'),
                    'product' => $isProduct ? [
                        'id' => $purchasable->id,
                        'name' => $purchasable->name,
                        'thumbnail' => $purchasable->thumbnail,
                    ] : null,
                    'subscription_plan' => $isSubscription ? [
                        'id' => $purchasable->id,
                        'name' => $purchasable->name,
                        'duration_days' => (int) $purchasable->duration_days,
                        'price' => (int) $purchasable->price,
                    ] : null,
                    'price' => (int) $item->price,
                ];
            })->values(),
            'payment' => $this->payment ? [
                'id' => $this->payment->id,
                'payment_method' => $this->payment->payment_method,
                'gateway_reference' => $this->payment->gateway_reference,
                'amount' => (int) $this->payment->amount,
                'status' => $this->payment->status,
                'paid_at' => $this->payment->paid_at?->toIso8601String(),
            ] : null,
        ];
    }
}
