<?php

namespace App\Repositories\Contracts\Api\V1\User\UserSubscription;

use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserSubscriptionRepositoryInterface
{
  /**
   * Get the active subscription for the given user.
   *
   * @param User $user
   * @return UserSubscription|null
   */
  public function getActiveSubscription(User $user): ?UserSubscription;

  /**
   * Get paginated products included in the subscription catalog.
   *
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getSubscriptionProducts(array $filters = [], int $perPage = 20): LengthAwarePaginator;
}
