<?php

namespace App\Services\Api\V1\User\SubscriptionPlan;

use App\Repositories\Contracts\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionPlanService
{
    public function __construct(
        protected SubscriptionPlanRepositoryInterface $subscriptionPlanRepository,
        protected RedisCacheService $cacheService
    ) {
    }

    /**
     * Fetch active subscription plans with features.
     *
     * @return Collection
     */
    public function getActivePlans(): Collection
    {
        return $this->cacheService->remember(
            'subscription_plans:active',
            RedisCacheService::TTL_EXTENDED,
            fn () => $this->subscriptionPlanRepository->getActivePlans(),
            [RedisCacheService::TAG_SUBSCRIPTIONS]
        );
    }
}
