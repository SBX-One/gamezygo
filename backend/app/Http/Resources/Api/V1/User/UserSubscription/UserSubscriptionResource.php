<?php

namespace App\Http\Resources\Api\V1\User\UserSubscription;

use App\Http\Resources\Api\V1\User\SubscriptionPlan\SubscriptionPlanResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserSubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $expiresAt = $this->expires_at ?? $this->expired_at;

        return [
            'id' => $this->id,
            'subscription_plan_id' => $this->subscription_plan_id,
            'order_item_id' => $this->order_item_id,
            'status' => $this->status,
            'started_at' => $this->started_at ? $this->started_at->toIso8601String() : null,
            'expires_at' => $expiresAt ? $expiresAt->toIso8601String() : null,
            'subscription_plan' => new SubscriptionPlanResource(
                $this->relationLoaded('subscriptionPlan')
                  ? $this->subscriptionPlan
                  : $this->subscriptionPlan()->with('features')->first()
            ),
        ];
    }
}
