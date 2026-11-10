<?php

namespace App\Repositories\Api\V1\Admin\Subscription;

use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPlanFeature;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\Admin\Subscription\AdminSubscriptionRepositoryInterface;

class AdminSubscriptionRepository implements AdminSubscriptionRepositoryInterface
{
  /**
   * Get subscription dashboard overview.
   *
   * @return array<string, mixed>
   */
  public function getDashboard(): array
  {
    $plans = SubscriptionPlan::with([
      'features' => function ($q) {
        $q->orderBy('sort_number', 'asc');
      },
    ])
      ->orderBy('id', 'asc')
      ->get();

    $plansData = $plans->map(function ($plan) {
      $durationMonths = (int) ($plan->duration_months ?: max(1, (int) round($plan->duration_days / 30)));

      return [
        'id'              => $plan->id,
        'name'            => $plan->name,
        'price'           => (int) $plan->price,
        'duration_months' => $durationMonths,
        'benefits'        => $plan->features->map(function ($f) {
          return [
            'id'          => $f->id,
            'description' => $f->feature,
            'sort_order'  => (int) $f->sort_number,
          ];
        })->values()->all(),
      ];
    })->values()->all();

    $gamesQuery = Product::query()
      ->where('is_subscription_supported', true)
      ->where('status', '!=', 'archive');

    $totalGames = $gamesQuery->count();
    $totalValue = (int) $gamesQuery->sum('price');

    $sampleGames = (clone $gamesQuery)
      ->with('genreCategories')
      ->orderBy('id', 'asc')
      ->limit(10)
      ->get();

    $gamesData = $sampleGames->map(function ($product) {
      return [
        'id'         => $product->id,
        'name'       => $product->name,
        'image_url'  => $product->thumbnail ?? 'https://placehold.co/300x450',
        'categories' => $product->genreCategories->pluck('name')->values()->all(),
      ];
    })->values()->all();

    return [
      'plans'              => $plansData,
      'subscription_games' => [
        'total'       => $totalGames,
        'total_value' => $totalValue,
        'games'       => $gamesData,
      ],
    ];
  }

  /**
   * Get paginated active subscribers list.
   *
   * @param int $page
   * @param int $perPage
   * @return array<string, mixed>
   */
  public function getActiveSubscribers(int $page = 1, int $perPage = 10): array
  {
    $query = UserSubscription::query()
      ->with(['user', 'subscriptionPlan'])
      ->where('status', 'active');

    $totalActive = $query->count();

    $paginator = $query->orderBy('id', 'asc')->paginate($perPage, ['*'], 'page', $page);

    $users = $paginator->getCollection()->map(function ($sub) {
      $userIdFormatted = sprintf('%04d', $sub->user_id);

      return [
        'id'         => $sub->id,
        'user_id'    => $userIdFormatted,
        'email'      => $sub->user?->email ?? '-',
        'plan'       => [
          'id'   => $sub->subscriptionPlan?->id ?? 0,
          'name' => $sub->subscriptionPlan?->name ?? '-',
        ],
        'status'     => (string) $sub->status,
        'created_at' => $sub->created_at ? $sub->created_at->toIso8601String() : null,
        'expires_at' => $sub->expired_at ? $sub->expired_at->toIso8601String() : null,
      ];
    })->values()->all();

    return [
      'total_active' => $totalActive,
      'users'        => $users,
      'pagination'   => [
        'current_page' => $paginator->currentPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'last_page'    => $paginator->lastPage(),
      ],
    ];
  }

  /**
   * Update subscription plan details.
   *
   * @param int $planId
   * @param array<string, mixed> $data
   * @return SubscriptionPlan
   */
  public function updatePlan(int $planId, array $data): SubscriptionPlan
  {
    $plan = SubscriptionPlan::findOrFail($planId);

    if (isset($data['name'])) {
      $plan->name = trim((string) $data['name']);
    }

    if (isset($data['price'])) {
      $plan->price = (int) $data['price'];
    }

    if (isset($data['duration_months'])) {
      $months = (int) $data['duration_months'];
      $plan->duration_months = $months;
      $plan->duration_days = $months * 30;
    } elseif (isset($data['duration_days'])) {
      $days = (int) $data['duration_days'];
      $plan->duration_days = $days;
      $plan->duration_months = max(1, (int) round($days / 30));
    }

    $plan->save();

    return $plan;
  }

  /**
   * Get features / benefits of a subscription plan.
   *
   * @param int $planId
   * @return array<int, array<string, mixed>>
   */
  public function getPlanFeatures(int $planId): array
  {
    $plan = SubscriptionPlan::findOrFail($planId);

    $features = $plan->features()
      ->orderBy('sort_number', 'asc')
      ->get();

    return $features->map(function ($f) {
      return [
        'id'          => $f->id,
        'description' => $f->feature,
        'sort_order'  => (int) $f->sort_number,
      ];
    })->values()->all();
  }

  /**
   * Synchronize / update benefits of a subscription plan.
   *
   * @param int $planId
   * @param array<int, array<string, mixed>> $benefits
   * @return array<string, mixed>
   */
  public function syncPlanFeatures(int $planId, array $benefits): array
  {
    $plan = SubscriptionPlan::findOrFail($planId);

    $keptIds = [];
    $updatedBenefits = [];

    foreach ($benefits as $index => $b) {
      $sortOrder = $index + 1;
      $desc = trim((string) $b['description']);

      if (!empty($b['id'])) {
        $feature = SubscriptionPlanFeature::where('subscription_plan_id', $plan->id)
          ->find($b['id']);

        if ($feature) {
          $feature->update([
            'feature'     => $desc,
            'sort_number' => $sortOrder,
          ]);

          $keptIds[] = $feature->id;
          $updatedBenefits[] = [
            'id'          => $feature->id,
            'description' => $feature->feature,
            'sort_order'  => $sortOrder,
          ];
          continue;
        }
      }

      $newFeature = $plan->features()->create([
        'feature'     => $desc,
        'sort_number' => $sortOrder,
      ]);

      $keptIds[] = $newFeature->id;
      $updatedBenefits[] = [
        'id'          => $newFeature->id,
        'description' => $newFeature->feature,
        'sort_order'  => $sortOrder,
      ];
    }

    SubscriptionPlanFeature::where('subscription_plan_id', $plan->id)
      ->whereNotIn('id', $keptIds)
      ->delete();

    return [
      'plan_id'  => $plan->id,
      'benefits' => $updatedBenefits,
    ];
  }

  /**
   * Delete a single benefit from a subscription plan.
   *
   * @param int $planId
   * @param int $featureId
   * @return array<string, mixed>
   */
  public function deletePlanFeature(int $planId, int $featureId): array
  {
    $feature = SubscriptionPlanFeature::where('subscription_plan_id', $planId)
      ->findOrFail($featureId);

    $feature->delete();

    $total = SubscriptionPlanFeature::where('subscription_plan_id', $planId)->count();

    return [
      'subscription_plan_id' => (int) $planId,
      'deleted_benefit_id'   => (int) $featureId,
      'total_benefits'       => (int) $total,
    ];
  }

  /**
   * Get filtered subscription games.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getSubscriptionProducts(array $filters): array
  {
    $query = Product::query()
      ->with('genreCategories')
      ->where('is_subscription_supported', true)
      ->where('status', '!=', 'archive');

    $totalGames = (clone $query)->count();
    $totalValue = (int) (clone $query)->sum('price');

    // Filter by active status
    if (isset($filters['is_active'])) {
      $isActive = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
      if ($isActive === true) {
        $query->whereNotIn('status', ['archive', 'draft']);
      } elseif ($isActive === false) {
        $query->whereIn('status', ['draft', 'archive']);
      }
    }

    // Filter by category IDs
    if (!empty($filters['category_ids']) && is_array($filters['category_ids'])) {
      $categoryIds = array_map('intval', $filters['category_ids']);
      $query->whereHas('genreCategories', function ($q) use ($categoryIds) {
        $q->whereIn('genre_categories.id', $categoryIds);
      });
    }

    // Filter by price
    if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
      $query->where('price', '>=', (int) $filters['min_price']);
    }

    if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
      $query->where('price', '<=', (int) $filters['max_price']);
    }

    // Keyword search
    if (!empty($filters['search'])) {
      $searchPattern = '%' . strtolower(trim((string) $filters['search'])) . '%';
      $query->where(function ($q) use ($searchPattern) {
        $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(description) LIKE ?', [$searchPattern]);
      });
    }

    // Sort order
    $sortBy = $filters['sort_by'] ?? 'latest';
    match ($sortBy) {
      'oldest'     => $query->orderBy('id', 'asc'),
      'price_low'  => $query->orderBy('price', 'asc'),
      'price_high' => $query->orderBy('price', 'desc'),
      'name_asc'   => $query->orderBy('name', 'asc'),
      'name_desc'  => $query->orderBy('name', 'desc'),
      default      => $query->orderBy('id', 'desc'),
    };

    $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

    $paginator = $query->paginate($perPage, ['*'], 'page', $page);

    $games = $paginator->getCollection()->map(function ($product) {
      $price = $product->discount_price > 0 ? (int) $product->discount_price : (int) $product->price;

      return [
        'id'         => $product->id,
        'name'       => $product->name,
        'image_url'  => $product->thumbnail ?? 'https://placehold.co/300x450',
        'price'      => $price,
        'categories' => $product->genreCategories->map(function ($cat) {
          return [
            'id'   => $cat->id,
            'name' => $cat->name,
          ];
        })->values()->all(),
      ];
    })->values()->all();

    return [
      'total_games' => $totalGames,
      'total_value' => $totalValue,
      'games'       => $games,
      'pagination'  => [
        'current_page' => $paginator->currentPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'last_page'    => $paginator->lastPage(),
      ],
    ];
  }

  /**
   * Add products to subscription catalog.
   *
   * @param array<int> $productIds
   * @return array<string, mixed>
   */
  public function addSubscriptionProducts(array $productIds): array
  {
    Product::whereIn('id', $productIds)->update([
      'is_subscription_supported' => true,
    ]);

    $totalGames = Product::where('is_subscription_supported', true)
      ->where('status', '!=', 'archive')
      ->count();

    $addedGames = Product::whereIn('id', $productIds)
      ->get(['id', 'name'])
      ->map(function ($product) {
        return [
          'id'   => $product->id,
          'name' => $product->name,
        ];
      })
      ->values()
      ->all();

    return [
      'total_games' => $totalGames,
      'added_games' => $addedGames,
    ];
  }

  /**
   * Remove product(s) from subscription catalog.
   *
   * @param int|null $productId
   * @param array<int> $productIds
   * @return array<string, mixed>
   */
  public function removeSubscriptionProduct(?int $productId, array $productIds = []): array
  {
    $ids = $productIds;
    if ($productId) {
      $ids[] = $productId;
    }
    $ids = array_values(array_unique(array_filter($ids)));

    if (!empty($ids)) {
      Product::whereIn('id', $ids)->update([
        'is_subscription_supported' => false,
      ]);
    }

    $totalGames = Product::where('is_subscription_supported', true)
      ->where('status', '!=', 'archive')
      ->count();

    return [
      'product_id'  => (int) ($productId ?? ($ids[0] ?? 0)),
      'total_games' => $totalGames,
    ];
  }
}

