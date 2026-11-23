<?php

namespace App\Http\Resources\Api\V1\User\SubscriptionPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SubscriptionPlanCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Subscription plans retrieved successfully',
            'data' => SubscriptionPlanResource::collection($this->collection),
        ];
    }
}
