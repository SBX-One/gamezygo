<?php

namespace App\Services\Api\V1\User\UserSubscription;

use App\Models\User;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\User\UserSubscription\UserSubscriptionRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserSubscriptionService
{
    public function __construct(
        protected UserSubscriptionRepositoryInterface $subscriptionRepository,
        protected RedisCacheService $cacheService
    ) {}

    /**
     * Get the active subscription for the given user.
     */
    public function getUserSubscription(User $user): ?UserSubscription
    {
        $cacheKey = "user:subscription:{$user->id}";

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_SHORT,
            fn () => $this->subscriptionRepository->getActiveSubscription($user),
            [RedisCacheService::userTag($user->id)]
        );
    }

    /**
     * Get paginated products included in subscription with optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getSubscriptionProducts(array $filters = []): LengthAwarePaginator
    {
        $perPage = (int) ($filters['per_page'] ?? 20);
        $page = request()->get('page', 1);
        $cacheKey = 'subscriptions:products:list:'.md5(json_encode($filters).":per_page:{$perPage}:page:{$page}");

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_MEDIUM,
            fn () => $this->subscriptionRepository->getSubscriptionProducts($filters, $perPage),
            [RedisCacheService::TAG_SUBSCRIPTIONS, RedisCacheService::TAG_PRODUCTS]
        );
    }
}
