<?php

namespace App\Services\Api\V1\User\UserSubscription;

use App\Models\User;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\User\UserSubscription\UserSubscriptionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserSubscriptionService
{
  public function __construct(
    protected UserSubscriptionRepositoryInterface $subscriptionRepository
  ) {
  }

  /**
   * Get the active subscription for the given user.
   *
   * @param User $user
   * @return UserSubscription|null
   */
  public function getUserSubscription(User $user): ?UserSubscription
  {
    return $this->subscriptionRepository->getActiveSubscription($user);
  }

  /**
   * Get paginated products included in subscription with optional filters.
   *
   * @param array<string, mixed> $filters
   * @return LengthAwarePaginator
   */
  public function getSubscriptionProducts(array $filters = []): LengthAwarePaginator
  {
    $perPage = (int) ($filters['per_page'] ?? 20);

    return $this->subscriptionRepository->getSubscriptionProducts($filters, $perPage);
  }
}
