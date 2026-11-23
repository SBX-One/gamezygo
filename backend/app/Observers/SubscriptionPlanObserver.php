<?php

namespace App\Observers;

use App\Models\SubscriptionPlan;
use App\Services\Cache\RedisCacheService;

class SubscriptionPlanObserver
{
  public function __construct(
    protected RedisCacheService $cacheService
  ) {}

  public function saved(SubscriptionPlan $plan): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_SUBSCRIPTIONS);
  }

  public function deleted(SubscriptionPlan $plan): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_SUBSCRIPTIONS);
  }
}
