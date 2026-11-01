<?php

namespace App\Http\Resources\Api\V1\User\SubscriptionPlan;

use App\Http\Resources\Api\V1\User\SubscriptionPlanFeature\SubscriptionPlanFeatureResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                         => $this->id,
            'name'                       => $this->name,
            'price'                      => (int) $this->price,
            'duration_days'              => (int) $this->duration_days,
            'max_concurrent_access'      => (int) ($this->max_concurrent_access ?? 1),
            'is_active'                  => (bool) $this->is_active,
            'subscription_plan_features' => SubscriptionPlanFeatureResource::collection(
                $this->relationLoaded('features')
                    ? $this->features
                    : ($this->relationLoaded('subscriptionPlanFeatures')
                        ? $this->subscriptionPlanFeatures
                        : $this->features()->orderBy('sort_number')->get())
            ),
        ];
    }
}
