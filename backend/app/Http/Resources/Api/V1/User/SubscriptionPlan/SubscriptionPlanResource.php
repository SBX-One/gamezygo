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
            'price'                      => $this->price,
            'duration'                   => $this->duration_days,
            'is_active'                  => (bool) $this->is_active,
            'subscription_plan_features' => SubscriptionPlanFeatureResource::collection(
                $this->whenLoaded('features')
            ),
        ];
    }
}
