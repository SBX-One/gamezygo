<?php

namespace App\Repositories\Api\V1\User\SubscriptionPlan;

use App\Models\SubscriptionPlan;
use App\Repositories\Contracts\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionPlanRepository implements SubscriptionPlanRepositoryInterface
{
    /**
     * Get active subscription plans with features.
     *
     * @return Collection
     */
    public function getActivePlans(): Collection
    {
        return SubscriptionPlan::query()
            ->where('is_active', true)
            ->with(['features' => function ($query) {
                $query->orderBy('sort_number');
            }])
            ->orderBy('price')
            ->get();
    }
}
