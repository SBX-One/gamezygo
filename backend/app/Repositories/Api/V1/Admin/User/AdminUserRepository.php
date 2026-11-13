<?php

namespace App\Repositories\Api\V1\Admin\User;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\UserDevice;
use App\Models\UserPointHistory;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\Admin\User\AdminUserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AdminUserRepository implements AdminUserRepositoryInterface
{
  /**
   * Get filtered and paginated users list.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUsers(array $filters): array
  {
    $query = User::query()->with([
      'subscriptions' => function ($q) {
        $q->with('subscriptionPlan')->where('status', 'active')->orderBy('expired_at', 'desc');
      },
    ]);

    // Filter by Subscription Plan ID
    if (!empty($filters['subscription_plan_id'])) {
      $planId = (int) $filters['subscription_plan_id'];
      $query->whereHas('subscriptions', function ($q) use ($planId) {
        $q->where('subscription_plan_id', $planId)
          ->where('status', 'active');
      });
    }

    // Filter by Status
    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    // Filter by Login Type
    if (!empty($filters['login_type'])) {
      if ($filters['login_type'] === 'google') {
        $query->whereNotNull('google_id');
      } elseif ($filters['login_type'] === 'email') {
        $query->whereNull('google_id');
      }
    }

    // Filter by Points Range
    if (isset($filters['min_points'])) {
      $min = (int) $filters['min_points'];
      $query->where(function ($q) use ($min) {
        $q->where('points', '>=', $min)
          ->orWhere('total_points', '>=', $min);
      });
    }

    if (isset($filters['max_points'])) {
      $max = (int) $filters['max_points'];
      $query->where(function ($q) use ($max) {
        $q->where('points', '<=', $max)
          ->orWhere('total_points', '<=', $max);
      });
    }

    // Filter by Search
    if (!empty($filters['search'])) {
      $pattern = '%' . strtolower(trim((string) $filters['search'])) . '%';
      $query->where(function ($q) use ($pattern) {
        $q->whereRaw('LOWER(name) LIKE ?', [$pattern])
          ->orWhereRaw('LOWER(COALESCE(username, name)) LIKE ?', [$pattern])
          ->orWhereRaw('LOWER(email) LIKE ?', [$pattern])
          ->orWhereRaw('LOWER(COALESCE(customer_id, \'\')) LIKE ?', [$pattern]);
      });
    }

    // Sorting
    $sortBy = strtolower((string) ($filters['sort_by'] ?? 'latest'));
    if ($sortBy === 'oldest') {
      $query->orderBy('created_at', 'asc')->orderBy('id', 'asc');
    } elseif (in_array($sortBy, ['points_desc', 'highest_points'])) {
      $query->orderBy('points', 'desc')->orderBy('total_points', 'desc')->orderBy('id', 'desc');
    } elseif (in_array($sortBy, ['points_asc', 'lowest_points'])) {
      $query->orderBy('points', 'asc')->orderBy('total_points', 'asc')->orderBy('id', 'asc');
    } elseif (in_array($sortBy, ['username_asc', 'name_asc', 'a-z'])) {
      $query->orderBy('name', 'asc');
    } elseif (in_array($sortBy, ['username_desc', 'name_desc', 'z-a'])) {
      $query->orderBy('name', 'desc');
    } else {
      // default: latest
      $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
    }

    $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

    $paginator = $query->paginate($perPage, ['*'], 'page', $page);

    $mappedUsers = $paginator->getCollection()->map(function (User $user) {
      $activeSub = $user->subscriptions->first();

      $subData = null;
      if ($activeSub) {
        $subData = [
          'id'         => $activeSub->subscription_plan_id,
          'name'       => $activeSub->subscriptionPlan?->name ?? 'Subscription Plan',
          'expired_at' => $activeSub->expired_at?->toISOString(),
        ];
      }

      return [
        'id'           => $user->id,
        'customer_id'  => $user->customer_id,
        'username'     => $user->username,
        'email'        => $user->email,
        'login_type'   => $user->login_type,
        'points'       => $user->points,
        'subscription' => $subData,
        'status'       => $user->status,
        'created_at'   => $user->created_at?->toISOString(),
      ];
    })->values()->all();

    $meta = [
      'current_page' => $paginator->currentPage(),
      'from'         => $paginator->firstItem() ?? 1,
      'last_page'    => $paginator->lastPage(),
      'per_page'     => $paginator->perPage(),
      'to'           => $paginator->lastItem() ?? $paginator->count(),
      'total'        => $paginator->total(),
    ];

    return [
      'total_users' => $paginator->total(),
      'users'       => $mappedUsers,
      'meta'        => $meta,
    ];
  }

  /**
   * Get single user detailed profile and statistics.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getUserById(int $id): array
  {
    $user = User::with([
      'subscriptions' => function ($q) {
        $q->with('subscriptionPlan')->where('status', 'active')->orderBy('expired_at', 'desc');
      },
      'devices',
      'ownedGames',
      'orders.payment',
    ])->findOrFail($id);

    $activeSub = $user->subscriptions->first();
    $subData = null;

    if ($activeSub && $activeSub->expired_at) {
      $diffDays = max(0, (int) now()->diffInDays($activeSub->expired_at, false));
      $diffMonths = max(0, (int) now()->diffInMonths($activeSub->expired_at, false));

      if ($diffMonths > 1) {
        $durationLabel = "{$diffMonths} months";
      } elseif ($diffMonths === 1) {
        $durationLabel = '1 month';
      } elseif ($diffDays > 1) {
        $durationLabel = "{$diffDays} days";
      } else {
        $durationLabel = "{$diffDays} day";
      }

      $subData = [
        'id'                       => $activeSub->subscription_plan_id,
        'name'                     => $activeSub->subscriptionPlan?->name ?? 'Subscription Plan',
        'status'                   => $activeSub->status,
        'started_at'               => $activeSub->started_at?->toISOString(),
        'expired_at'               => $activeSub->expired_at?->toISOString(),
        'remaining_days'           => $diffDays,
        'remaining_duration_label' => $durationLabel,
      ];
    }

    $lifetimeValue = (int) $user->orders()
      ->whereIn('status', ['paid', 'settled', 'success'])
      ->sum('total_price');

    if ($lifetimeValue === 0) {
      $lifetimeValue = (int) $user->orders()->sum('total_price');
    }

    $statistics = [
      'lifetime_value'     => $lifetimeValue,
      'current_points'     => $user->points,
      'total_devices'      => (int) $user->devices()->count(),
      'total_products'     => (int) $user->ownedGames()->count(),
      'total_transactions' => (int) $user->orders()->count(),
    ];

    return [
      'id'          => $user->id,
      'customer_id' => $user->customer_id,
      'username'    => $user->username,
      'email'       => $user->email,
      'avatar_url'  => $user->avatar_url ?? 'https://placehold.co/150',
      'login_type'  => $user->login_type,
      'status'      => $user->status,
      'statistics'  => $statistics,
      'subscription'=> $subData,
      'created_at'  => $user->created_at?->toISOString(),
      'updated_at'  => $user->updated_at?->toISOString(),
    ];
  }

  /**
   * Update user points and/or adjust subscription duration.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function updateUser(int $id, array $data): array
  {
    $user = User::with([
      'subscriptions' => function ($q) {
        $q->with('subscriptionPlan')->where('status', 'active')->orderBy('expired_at', 'desc');
      },
    ])->findOrFail($id);

    // Points update
    if (isset($data['points'])) {
      $oldPoints = $user->points;
      $newPoints = (int) $data['points'];
      $diff = $newPoints - $oldPoints;

      $user->points = $newPoints;
      $user->total_points = $newPoints;

      if ($diff !== 0) {
        UserPointHistory::create([
          'user_id'        => $user->id,
          'type'           => 'adjustment',
          'points'         => abs($diff),
          'balance_before' => $oldPoints,
          'balance_after'  => $newPoints,
          'description'    => 'Manual adjustment by admin',
        ]);
      }
    }

    $user->save();

    // Subscription Duration Adjustment
    $activeSub = $user->subscriptions->first();
    if (isset($data['subscription_duration_adjustment']) && $activeSub) {
      $adjustment = (int) $data['subscription_duration_adjustment'];
      $currentExpiry = $activeSub->expired_at ? Carbon::parse($activeSub->expired_at) : now();
      $activeSub->expired_at = $currentExpiry->addMonths($adjustment);
      $activeSub->save();
    }

    $subResponse = null;
    if ($activeSub) {
      $subResponse = [
        'id'         => $activeSub->subscription_plan_id,
        'name'       => $activeSub->subscriptionPlan?->name ?? 'Subscription Plan',
        'started_at' => $activeSub->started_at?->toISOString(),
        'expired_at' => $activeSub->expired_at?->toISOString(),
        'status'     => $activeSub->status,
      ];
    }

    return [
      'id'           => $user->id,
      'customer_id'  => $user->customer_id,
      'username'     => $user->username,
      'points'       => $user->points,
      'subscription' => $subResponse,
      'updated_at'   => $user->updated_at?->toISOString(),
    ];
  }

  /**
   * Update user status.
   *
   * @param int $id
   * @param string $status
   * @return array<string, mixed>
   */
  public function updateStatus(int $id, string $status): array
  {
    $user = User::findOrFail($id);
    $user->update(['status' => $status]);

    return [
      'id'          => $user->id,
      'customer_id' => $user->customer_id,
      'status'      => $user->status,
    ];
  }

  /**
   * Suspend a user with reason and expiry date.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function suspendUser(int $id, array $data): array
  {
    $user = User::findOrFail($id);

    $user->status = 'suspended';
    $user->suspend_reason = $data['reason'] ?? null;
    $user->suspended_at = now();
    $user->suspended_until = isset($data['suspended_until']) ? Carbon::parse($data['suspended_until']) : null;
    $user->save();

    return [
      'id'              => $user->id,
      'status'          => $user->status,
      'suspend_reason'  => $user->suspend_reason,
      'suspended_at'    => $user->suspended_at?->toISOString(),
      'suspended_until' => $user->suspended_until?->toISOString(),
    ];
  }

  /**
   * Remove suspension from a user.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function unsuspendUser(int $id): array
  {
    $user = User::findOrFail($id);

    $user->status = 'active';
    $user->suspend_reason = null;
    $user->suspended_at = null;
    $user->suspended_until = null;
    $user->save();

    return [
      'id'              => $user->id,
      'status'          => $user->status,
      'suspended_at'    => null,
      'suspended_until' => null,
    ];
  }

  /**
   * Delete a user account.
   *
   * @param int $id
   * @return void
   */
  public function deleteUser(int $id): void
  {
    $user = User::findOrFail($id);
    $user->devices()->delete();
    $user->pointHistories()->delete();
    $user->ownedGames()->detach();
    $user->delete();
  }

  /**
   * Get user login devices.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getUserDevices(int $id): array
  {
    $user = User::findOrFail($id);
    $devices = $user->devices()->orderBy('id', 'asc')->get();

    $items = $devices->map(function (UserDevice $device) {
      return [
        'id'         => $device->id,
        'ip_address' => $device->ip_address,
        'device'     => $device->device,
        'browser'    => $device->browser,
        'login_at'   => $device->login_at ? $device->login_at->toISOString() : $device->created_at?->toISOString(),
      ];
    })->values()->all();

    return [
      'total_devices' => count($items),
      'devices'       => $items,
    ];
  }

  /**
   * Get paginated products owned by user.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUserProducts(int $id, array $filters = []): array
  {
    $user = User::findOrFail($id);

    $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

    $paginator = $user->ownedGames()
      ->with('files')
      ->paginate($perPage, ['*'], 'page', $page);

    $userOrders = Order::where('user_id', $user->id)->with('items')->get();

    $items = $paginator->getCollection()->map(function (Product $product) use ($userOrders) {
      $firstFile = $product->files->first();
      $imageUrl = $firstFile
        ? (filter_var($firstFile->file_path, FILTER_VALIDATE_URL)
          ? $firstFile->file_path
          : Storage::disk('public')->url($firstFile->file_path))
        : 'https://placehold.co/600x400';

      // Find transaction if available
      $matchingOrder = null;
      foreach ($userOrders as $order) {
        $hasItem = $order->items->contains(function (OrderItem $item) use ($product) {
          return $item->purchasable_type === Product::class && (int) $item->purchasable_id === (int) $product->id;
        });
        if ($hasItem) {
          $matchingOrder = $order;
          break;
        }
      }

      $transactionId = $matchingOrder ? $matchingOrder->order_code : sprintf('H27T012603381U2-%d', $product->id);
      $transactionDate = $matchingOrder && $matchingOrder->created_at
        ? $matchingOrder->created_at->toISOString()
        : ($product->pivot?->created_at ? $product->pivot->created_at->toISOString() : now()->toISOString());

      return [
        'id'               => $product->id,
        'name'             => $product->name,
        'image_url'        => $imageUrl,
        'transaction_id'   => $transactionId,
        'transaction_date' => $transactionDate,
      ];
    })->values()->all();

    $meta = [
      'current_page' => $paginator->currentPage(),
      'from'         => $paginator->firstItem() ?? 1,
      'last_page'    => $paginator->lastPage(),
      'per_page'     => $paginator->perPage(),
      'to'           => $paginator->lastItem() ?? $paginator->count(),
      'total'        => $paginator->total(),
    ];

    return [
      'total_products' => $paginator->total(),
      'products'       => $items,
      'meta'           => $meta,
    ];
  }

  /**
   * Get paginated transactions made by user.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUserTransactions(int $id, array $filters = []): array
  {
    $user = User::findOrFail($id);

    $query = Order::where('user_id', $user->id)->with(['items.purchasable', 'payment']);

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    $sortBy = strtolower((string) ($filters['sort_by'] ?? 'latest'));
    if ($sortBy === 'oldest') {
      $query->orderBy('created_at', 'asc')->orderBy('id', 'asc');
    } else {
      $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
    }

    $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

    $paginator = $query->paginate($perPage, ['*'], 'page', $page);

    $items = $paginator->getCollection()->map(function (Order $order) {
      $firstItem = $order->items->first();
      $productName = $firstItem && $firstItem->purchasable ? $firstItem->purchasable->name : 'Product Order';
      $paymentMethod = $order->payment?->payment_method ?? 'BCA';

      return [
        'transaction_id' => $order->order_code,
        'product_name'   => $productName,
        'payment_method' => $paymentMethod,
        'total'          => (int) $order->total_price,
        'date'           => $order->created_at?->toISOString(),
        'status'         => $order->status,
      ];
    })->values()->all();

    $meta = [
      'current_page' => $paginator->currentPage(),
      'from'         => $paginator->firstItem() ?? 1,
      'last_page'    => $paginator->lastPage(),
      'per_page'     => $paginator->perPage(),
      'to'           => $paginator->lastItem() ?? $paginator->count(),
      'total'        => $paginator->total(),
    ];

    return [
      'total_transactions' => $paginator->total(),
      'transactions'       => $items,
      'meta'               => $meta,
    ];
  }

  /**
   * Get paginated point histories of user.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUserPointsHistory(int $id, array $filters = []): array
  {
    $user = User::findOrFail($id);

    $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

    $paginator = $user->pointHistories()->paginate($perPage, ['*'], 'page', $page);

    $items = $paginator->getCollection()->map(function (UserPointHistory $history) {
      return [
        'id'             => $history->id,
        'type'           => $history->type,
        'points'         => (int) $history->points,
        'balance_before' => (int) $history->balance_before,
        'balance_after'  => (int) $history->balance_after,
        'description'    => $history->description,
        'created_at'     => $history->created_at?->toISOString(),
      ];
    })->values()->all();

    $meta = [
      'current_page' => $paginator->currentPage(),
      'from'         => $paginator->firstItem() ?? 1,
      'last_page'    => $paginator->lastPage(),
      'per_page'     => $paginator->perPage(),
      'to'           => $paginator->lastItem() ?? $paginator->count(),
      'total'        => $paginator->total(),
    ];

    return [
      'current_points' => $user->points,
      'histories'      => $items,
      'meta'           => $meta,
    ];
  }
}

