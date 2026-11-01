<?php

namespace App\Repositories\Contracts\Api\V1\User\SubscriptionPlan;

use Illuminate\Database\Eloquent\Collection;

interface SubscriptionPlanRepositoryInterface
{
    /**
     * Get active subscription plans with features.
     *
     * @return Collection
     */
    public function getActivePlans(): Collection;
}
