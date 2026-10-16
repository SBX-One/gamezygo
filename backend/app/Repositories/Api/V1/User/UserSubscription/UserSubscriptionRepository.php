<?php

namespace App\Repositories\Api\V1\User\UserSubscription;

use App\Models\Product;
use App\Models\User;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\User\UserSubscription\UserSubscriptionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserSubscriptionRepository implements UserSubscriptionRepositoryInterface
{
  /**
   * Get the active subscription for the given user.
   *
   * @param User $user
   * @return UserSubscription|null
   */
  public function getActiveSubscription(User $user): ?UserSubscription
  {
    return $user->subscriptions()
      ->where('status', 'active')
      ->where('expired_at', '>', now())
      ->with([
        'subscriptionPlan.features' => function ($q) {
          $q->orderBy('sort_number');
        },
      ])
      ->orderByDesc('expired_at')
      ->orderByDesc('id')
      ->first();
  }

  /**
   * Get paginated products included in the subscription catalog.
   *
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getSubscriptionProducts(array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    $query = Product::query()
      ->where('is_subscription_supported', true)
      ->with([
        'genreCategories',
        'productLauncherCategory',
        'files',
      ])
      ->withAvg(['reviews' => function ($q) {
        $q->where('status', 'approved');
      }], 'rating');

    if (!empty($filters['search'])) {
      $search = trim((string) $filters['search']);
      $query->where(function ($q) use ($search) {
        $q->whereRaw('LOWER(products.name) LIKE ?', ['%' . strtolower($search) . '%'])
          ->orWhereRaw('LOWER(products.slug) LIKE ?', ['%' . strtolower($search) . '%']);
      });
    }

    if (!empty($filters['genre_categories'])) {
      $genres = (array) $filters['genre_categories'];
      if (is_string($filters['genre_categories'])) {
        $genres = explode(',', $filters['genre_categories']);
      }
      $genres = array_filter(array_map('trim', $genres));

      if (!empty($genres)) {
        $genresLower = array_map('strtolower', $genres);
        $query->whereHas('genreCategories', function ($gQuery) use ($genres, $genresLower) {
          $gQuery->whereIn('genre_categories.slug', $genres)
            ->orWhereIn('genre_categories.name', $genres)
            ->orWhereIn(DB::raw('LOWER(genre_categories.slug)'), $genresLower)
            ->orWhereIn(DB::raw('LOWER(genre_categories.name)'), $genresLower);
        });
      }
    }

    $page = isset($filters['page']) ? (int) $filters['page'] : null;

    return $query->orderBy('products.id', 'asc')
      ->paginate(perPage: $perPage, page: $page);
  }
}
