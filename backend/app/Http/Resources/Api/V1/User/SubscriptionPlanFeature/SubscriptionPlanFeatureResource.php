<?php

namespace App\Http\Resources\Api\V1\User\SubscriptionPlanFeature;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanFeatureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'feature'      => $this->feature,
            'order_number' => $this->sort_number,
        ];
    }
}
