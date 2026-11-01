<?php

namespace App\Services\Api\V1\User\SubscriptionPlan;

use App\Repositories\Contracts\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionPlanService
{
    public function __construct(
        protected SubscriptionPlanRepositoryInterface $subscriptionPlanRepository
    ) {
    }

    /**
     * Fetch active subscription plans with features.
     *
     * @return Collection
     */
    public function getActivePlans(): Collection
    {
        return $this->subscriptionPlanRepository->getActivePlans();
    }
}
