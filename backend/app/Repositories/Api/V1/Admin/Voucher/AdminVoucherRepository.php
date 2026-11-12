<?php

namespace App\Repositories\Api\V1\Admin\Voucher;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Voucher;
use App\Repositories\Contracts\Api\V1\Admin\Voucher\AdminVoucherRepositoryInterface;
use Carbon\Carbon;

class AdminVoucherRepository implements AdminVoucherRepositoryInterface
{
  /**
   * Get paginated vouchers with filters and meta.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getVouchers(array $filters): array
  {
    $query = Voucher::query();

    // 1. Search
    if (!empty($filters['search'])) {
      $term = trim($filters['search']);
      $query->where(function ($q) use ($term) {
        $q->where('name', 'like', "%{$term}%")
          ->orWhere('code', 'like', "%{$term}%");
      });
    }

    // 2. Discount Type
    if (!empty($filters['discount_type'])) {
      if (in_array($filters['discount_type'], ['percent', 'percentage'])) {
        $query->whereIn('discount_type', ['percent', 'percentage']);
      } else {
        $query->where('discount_type', 'fixed');
      }
    }

    // 3. Status filter
    if (!empty($filters['status']) && $filters['status'] !== 'all') {
      $status = strtolower($filters['status']);
      $now = now();

      if ($status === 'active') {
        $query->where('is_active', true)
          ->where(function ($q) use ($now) {
            $q->whereNull('started_at')->orWhere('started_at', '<=', $now);
          })
          ->where(function ($q) use ($now) {
            $q->whereNull('expired_at')->orWhere('expired_at', '>=', $now);
          })
          ->where(function ($q) {
            $q->where('slot', '<=', 0)->orWhereRaw('total_usage < slot');
          });
      } elseif ($status === 'scheduled') {
        $query->where('is_active', true)
          ->whereNotNull('started_at')
          ->where('started_at', '>', $now);
      } elseif ($status === 'expired') {
        $query->whereNotNull('expired_at')
          ->where('expired_at', '<', $now);
      } elseif ($status === 'exhausted') {
        $query->where('slot', '>', 0)
          ->whereRaw('total_usage >= slot');
      } elseif ($status === 'inactive') {
        $query->where('is_active', false);
      } elseif ($status === 'draft') {
        $query->where('status', 'draft');
      }
    }

    // 4. Sorting
    $sortBy = $filters['sort_by'] ?? 'latest';
    if ($sortBy === 'oldest') {
      $query->orderBy('created_at');
    } elseif ($sortBy === 'most_used') {
      $query->orderByDesc('total_usage')->orderByDesc('created_at');
    } elseif ($sortBy === 'highest_discount') {
      $query->orderByDesc('discount_amount')->orderByDesc('created_at');
    } else {
      $query->orderByDesc('created_at');
    }

    $perPage = (int) ($filters['per_page'] ?? 10);
    $page = (int) ($filters['page'] ?? 1);

    $paginator = $query->paginate($perPage, ['*'], 'page', $page);

    $vouchers = collect($paginator->items())->map(function (Voucher $v) {
      return [
        'id'             => $v->id,
        'name'           => $v->name,
        'code'           => $v->code,
        'discount_type'  => $v->normalized_discount_type,
        'discount_value' => $v->discount_val,
        'discount_label' => $v->discount_label,
        'total_usage'    => (int) $v->total_usage,
        'slot'           => (int) $v->slot,
        'status'         => $v->calculateStatus(),
        'is_active'      => (bool) $v->is_active,
        'started_at'     => $v->started_at?->toISOString(),
        'expired_at'     => $v->expired_at?->toISOString(),
      ];
    })->values()->all();

    return [
      'total_vouchers' => $paginator->total(),
      'vouchers'       => $vouchers,
      'meta'           => [
        'current_page' => $paginator->currentPage(),
        'from'         => $paginator->firstItem(),
        'last_page'    => $paginator->lastPage(),
        'per_page'     => $paginator->perPage(),
        'to'           => $paginator->lastItem(),
        'total'        => $paginator->total(),
      ],
    ];
  }

  /**
   * Create a new voucher.
   *
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function createVoucher(array $data): array
  {
    $discountVal = (int) ($data['discount_value'] ?? $data['discount_amount'] ?? 0);
    $discountType = in_array($data['discount_type'] ?? '', ['percent', 'percentage']) ? 'percentage' : 'fixed';

    $voucher = new Voucher();
    $voucher->name = $data['name'];
    $voucher->code = strtoupper($data['code']);
    $voucher->discount_type = $discountType;
    $voucher->discount_amount = $discountVal;
    $voucher->discount_value = $discountVal;
    $voucher->max_discount = (int) ($data['max_discount'] ?? 0);
    $voucher->min_purchase = (int) ($data['min_purchase'] ?? 0);
    $voucher->applies_to = $data['applies_to'] ?? 'all';
    $voucher->target_type = $data['target_type'] ?? 'all_users';
    $voucher->product_scope = $data['product_scope'] ?? 'all_products';
    $voucher->slot = (int) ($data['slot'] ?? 0);
    $voucher->usage_limit_per_user = (int) ($data['usage_limit_per_user'] ?? 1);
    $voucher->total_usage = 0;
    $voucher->started_at = !empty($data['started_at']) ? Carbon::parse($data['started_at']) : null;
    $voucher->expired_at = !empty($data['expired_at']) ? Carbon::parse($data['expired_at']) : null;
    $voucher->is_active = isset($data['is_active']) ? (bool) $data['is_active'] : true;
    $voucher->status = $data['status'] ?? 'active';
    $voucher->save();

    if (!empty($data['product_ids'])) {
      $voucher->products()->sync($data['product_ids']);
    }

    if (!empty($data['user_ids'])) {
      $voucher->users()->sync($data['user_ids']);
    }

    return [
      'id'                    => $voucher->id,
      'name'                  => $voucher->name,
      'code'                  => $voucher->code,
      'discount_type'         => $voucher->normalized_discount_type,
      'discount_value'        => $voucher->discount_val,
      'max_discount'          => (int) $voucher->max_discount,
      'min_purchase'          => (int) $voucher->min_purchase,
      'applies_to'            => $voucher->applies_to,
      'target_type'           => $voucher->target_type,
      'product_scope'         => $voucher->product_scope,
      'total_target_products' => $voucher->products()->count(),
      'total_target_users'    => $voucher->users()->count(),
      'slot'                  => (int) $voucher->slot,
      'usage_limit_per_user'  => (int) $voucher->usage_limit_per_user,
      'total_usage'           => (int) $voucher->total_usage,
      'status'                => $voucher->calculateStatus(),
      'is_active'             => (bool) $voucher->is_active,
      'started_at'            => $voucher->started_at?->toISOString(),
      'expired_at'            => $voucher->expired_at?->toISOString(),
      'created_at'            => $voucher->created_at?->toISOString(),
    ];
  }

  /**
   * Get single voucher detail with products and users.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getVoucherById(int $id): array
  {
    $voucher = Voucher::with(['products.files', 'users'])->findOrFail($id);

    $products = $voucher->products->map(function ($p) {
      $cover = $p->files?->firstWhere('file_type', 'cover');
      return [
        'id'        => $p->id,
        'name'      => $p->name,
        'image_url' => $cover?->file_url ?? $p->thumbnail ?? 'https://placehold.co/100x150',
        'price'     => (int) ($p->discount_price > 0 ? $p->discount_price : $p->price),
      ];
    })->values()->all();

    $users = $voucher->users->map(function ($u) {
      return [
        'id'           => $u->id,
        'email'        => $u->email,
        'total_points' => (int) ($u->total_points ?? 0),
      ];
    })->values()->all();

    return [
      'id'                   => $voucher->id,
      'name'                 => $voucher->name,
      'code'                 => $voucher->code,
      'discount_type'        => $voucher->normalized_discount_type,
      'discount_value'       => $voucher->discount_val,
      'max_discount'         => (int) $voucher->max_discount,
      'min_purchase'         => (int) $voucher->min_purchase,
      'applies_to'           => $voucher->applies_to,
      'target_type'          => $voucher->target_type,
      'product_scope'        => $voucher->product_scope,
      'products'             => $products,
      'users'                => $users,
      'slot'                 => (int) $voucher->slot,
      'usage_limit_per_user' => (int) $voucher->usage_limit_per_user,
      'total_usage'          => (int) $voucher->total_usage,
      'started_at'           => $voucher->started_at?->toISOString(),
      'expired_at'           => $voucher->expired_at?->toISOString(),
      'status'               => $voucher->calculateStatus(),
      'is_active'            => (bool) $voucher->is_active,
      'created_at'           => $voucher->created_at?->toISOString(),
      'updated_at'           => $voucher->updated_at?->toISOString(),
    ];
  }

  /**
   * Update voucher by ID.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function updateVoucher(int $id, array $data): array
  {
    $voucher = Voucher::findOrFail($id);

    if (isset($data['name'])) {
      $voucher->name = $data['name'];
    }
    if (isset($data['code'])) {
      $voucher->code = strtoupper($data['code']);
    }
    if (isset($data['discount_type'])) {
      $voucher->discount_type = in_array($data['discount_type'], ['percent', 'percentage']) ? 'percentage' : 'fixed';
    }
    if (isset($data['discount_value'])) {
      $val = (int) $data['discount_value'];
      $voucher->discount_amount = $val;
      $voucher->discount_value = $val;
    }
    if (isset($data['max_discount'])) {
      $voucher->max_discount = (int) $data['max_discount'];
    }
    if (isset($data['min_purchase'])) {
      $voucher->min_purchase = (int) $data['min_purchase'];
    }
    if (isset($data['slot'])) {
      $voucher->slot = (int) $data['slot'];
    }
    if (isset($data['usage_limit_per_user'])) {
      $voucher->usage_limit_per_user = (int) $data['usage_limit_per_user'];
    }
    if (isset($data['started_at'])) {
      $voucher->started_at = Carbon::parse($data['started_at']);
    }
    if (isset($data['expired_at'])) {
      $voucher->expired_at = Carbon::parse($data['expired_at']);
    }
    if (isset($data['applies_to'])) {
      $voucher->applies_to = $data['applies_to'];
    }
    if (isset($data['target_type'])) {
      $voucher->target_type = $data['target_type'];
    }
    if (isset($data['product_scope'])) {
      $voucher->product_scope = $data['product_scope'];
    }
    if (isset($data['is_active'])) {
      $voucher->is_active = (bool) $data['is_active'];
    }
    if (isset($data['status'])) {
      $voucher->status = $data['status'];
    }

    $voucher->save();

    if (isset($data['product_ids'])) {
      $voucher->products()->sync($data['product_ids']);
    }
    if (isset($data['user_ids'])) {
      $voucher->users()->sync($data['user_ids']);
    }

    return [
      'id'             => $voucher->id,
      'name'           => $voucher->name,
      'code'           => $voucher->code,
      'discount_type'  => $voucher->normalized_discount_type,
      'discount_value' => $voucher->discount_val,
      'max_discount'   => (int) $voucher->max_discount,
      'min_purchase'   => (int) $voucher->min_purchase,
      'slot'           => (int) $voucher->slot,
      'total_usage'    => (int) $voucher->total_usage,
      'expired_at'     => $voucher->expired_at?->toISOString(),
      'updated_at'     => $voucher->updated_at?->toISOString(),
    ];
  }

  /**
   * Update voucher active status.
   *
   * @param int $id
   * @param bool $isActive
   * @return array<string, mixed>
   */
  public function updateStatus(int $id, bool $isActive): array
  {
    $voucher = Voucher::findOrFail($id);
    $voucher->is_active = $isActive;
    $voucher->status = $isActive ? 'active' : 'inactive';
    $voucher->save();

    return [
      'id'        => $voucher->id,
      'code'      => $voucher->code,
      'is_active' => (bool) $voucher->is_active,
      'status'    => $voucher->calculateStatus(),
    ];
  }

  /**
   * Bulk delete vouchers by IDs.
   *
   * @param array<int> $ids
   * @return array<string, mixed>
   */
  public function deleteVouchers(array $ids): array
  {
    $deletedCount = Voucher::whereIn('id', $ids)->delete();

    return [
      'deleted_count' => (int) $deletedCount,
      'deleted_ids'   => array_map('intval', array_values($ids)),
    ];
  }

  /**
   * Get voucher analytics and chart.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getAnalytics(int $id, array $filters): array
  {
    $voucher = Voucher::with(['products.files', 'users'])->findOrFail($id);

    // 1. Statistics
    $ordersCount = Order::where('voucher_id', $voucher->id)->whereIn('status', ['paid', 'settled'])->count();
    $totalUsage = max((int) $voucher->total_usage, $ordersCount);
    $totalBurn = (int) Order::where('voucher_id', $voucher->id)->whereIn('status', ['paid', 'settled'])->sum('discount_amount');

    // 2. Target Games with discounted calculations
    $targetGames = $voucher->products->map(function ($p) use ($voucher) {
      $originalPrice = (int) $p->price;
      $discountVal = $voucher->discount_val;
      $maxDiscount = (int) $voucher->max_discount;

      if ($voucher->normalized_discount_type === 'percent') {
        $discountAmount = (int) round(($originalPrice * $discountVal) / 100);
        if ($maxDiscount > 0 && $discountAmount > $maxDiscount) {
          $discountAmount = $maxDiscount;
        }
        $discountedPrice = max(0, $originalPrice - $discountAmount);
        $discountPercentage = $discountVal;
      } else {
        $discountAmount = $discountVal;
        $discountedPrice = max(0, $originalPrice - $discountAmount);
        $discountPercentage = $originalPrice > 0 ? (int) round(($discountAmount / $originalPrice) * 100) : 0;
      }

      $cover = $p->files?->firstWhere('file_type', 'cover');

      return [
        'id'                  => $p->id,
        'name'                => $p->name,
        'image_url'           => $cover?->file_url ?? $p->thumbnail ?? 'https://placehold.co/100x150',
        'original_price'      => $originalPrice,
        'discounted_price'    => $discountedPrice,
        'discount_percentage' => $discountPercentage,
      ];
    })->values()->all();

    // 3. Target Users
    $targetUsers = $voucher->users->map(function ($u) {
      return [
        'id'    => $u->id,
        'email' => $u->email,
      ];
    })->values()->all();

    // 4. Revenue chart
    $period = $filters['period'] ?? 'weekly';
    $chartData = [];

    if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
      $start = Carbon::parse($filters['start_date'])->startOfDay();
      $end = Carbon::parse($filters['end_date'])->endOfDay();
    } else {
      $start = now()->subDays(6)->startOfDay();
      $end = now()->endOfDay();
    }

    $ordersByDate = Order::where('voucher_id', $voucher->id)
      ->whereIn('status', ['paid', 'settled'])
      ->whereBetween('created_at', [$start, $end])
      ->selectRaw('DATE(created_at) as date, SUM(total_price) as revenue')
      ->groupBy('date')
      ->pluck('revenue', 'date')
      ->all();

    $cursor = $start->copy();
    while ($cursor->lte($end)) {
      $dateStr = $cursor->format('Y-m-d');
      $chartData[] = [
        'date'    => $dateStr,
        'revenue' => (int) ($ordersByDate[$dateStr] ?? 0),
      ];
      $cursor->addDay();
    }

    return [
      'voucher' => [
        'id'             => $voucher->id,
        'name'           => $voucher->name,
        'code'           => $voucher->code,
        'discount_type'  => $voucher->normalized_discount_type,
        'discount_value' => $voucher->discount_val,
        'status'         => $voucher->calculateStatus(),
      ],
      'statistics' => [
        'total_usage' => $totalUsage,
        'total_burn'  => $totalBurn,
      ],
      'target_games'  => $targetGames,
      'target_users'  => $targetUsers,
      'revenue_chart' => [
        'period' => $period,
        'data'   => $chartData,
      ],
    ];
  }

  /**
   * Get voucher usage orders history with pagination.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUsages(int $id, array $filters): array
  {
    $voucher = Voucher::findOrFail($id);

    $query = Order::with('user')->where('voucher_id', $voucher->id);

    if (!empty($filters['status']) && $filters['status'] !== 'all') {
      $query->where('status', $filters['status']);
    }

    $perPage = (int) ($filters['per_page'] ?? 10);
    $page = (int) ($filters['page'] ?? 1);

    $paginator = $query->orderByDesc('created_at')->paginate($perPage, ['*'], 'page', $page);

    $usages = collect($paginator->items())->map(function (Order $order) {
      return [
        'id'              => $order->id,
        'order_code'      => $order->order_code,
        'customer_email'  => $order->user?->email ?? 'unknown',
        'status'          => $order->status,
        'subtotal'        => (int) $order->subtotal_price,
        'discount_amount' => (int) $order->discount_amount,
        'total'           => (int) $order->total_price,
        'used_at'         => ($order->paid_at ?? $order->created_at)?->toISOString(),
      ];
    })->values()->all();

    return [
      'usages' => $usages,
      'meta'   => [
        'current_page' => $paginator->currentPage(),
        'from'         => $paginator->firstItem(),
        'last_page'    => $paginator->lastPage(),
        'per_page'     => $paginator->perPage(),
        'to'           => $paginator->lastItem(),
        'total'        => $paginator->total(),
      ],
    ];
  }

  /**
   * Search and get eligible products for voucher targeting.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getEligibleProducts(array $filters): array
  {
    $query = Product::with(['genreCategories', 'files']);

    if (!empty($filters['search'])) {
      $search = trim($filters['search']);
      $query->where('name', 'like', "%{$search}%");
    }

    $perPage = (int) ($filters['per_page'] ?? 10);
    $page = (int) ($filters['page'] ?? 1);

    $paginator = $query->orderBy('name')->paginate($perPage, ['*'], 'page', $page);

    $products = collect($paginator->items())->map(function (Product $p) {
      $cover = $p->files?->firstWhere('file_type', 'cover');
      return [
        'id'         => $p->id,
        'name'       => $p->name,
        'image_url'  => $cover?->file_url ?? $p->thumbnail ?? 'https://placehold.co/100x150',
        'price'      => (int) ($p->discount_price > 0 ? $p->discount_price : $p->price),
        'categories' => $p->genreCategories->pluck('name')->values()->all(),
      ];
    })->values()->all();

    return [
      'products' => $products,
      'meta'     => [
        'current_page' => $paginator->currentPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'last_page'    => $paginator->lastPage(),
        'from'         => $paginator->firstItem(),
        'to'           => $paginator->lastItem(),
      ],
    ];
  }

  /**
   * Search and get eligible users for voucher targeting.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getEligibleUsers(array $filters): array
  {
    $query = User::query();

    if (!empty($filters['search'])) {
      $search = trim($filters['search']);
      $query->where(function ($q) use ($search) {
        $q->where('email', 'like', "%{$search}%")
          ->orWhere('name', 'like', "%{$search}%");
      });
    }

    $perPage = (int) ($filters['per_page'] ?? 10);
    $page = (int) ($filters['page'] ?? 1);

    $paginator = $query->orderBy('id')->paginate($perPage, ['*'], 'page', $page);

    $users = collect($paginator->items())->map(function (User $u) {
      return [
        'id'           => $u->id,
        'email'        => $u->email,
        'total_points' => (int) ($u->total_points ?? 0),
      ];
    })->values()->all();

    return [
      'users' => $users,
      'meta'  => [
        'current_page' => $paginator->currentPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'last_page'    => $paginator->lastPage(),
        'from'         => $paginator->firstItem(),
        'to'           => $paginator->lastItem(),
      ],
    ];
  }

  /**
   * Export vouchers as CSV string.
   *
   * @param array<string, mixed> $filters
   * @return string
   */
  public function exportVouchersCsv(array $filters): string
  {
    $query = Voucher::query();

    if (!empty($filters['search'])) {
      $term = trim($filters['search']);
      $query->where(function ($q) use ($term) {
        $q->where('name', 'like', "%{$term}%")
          ->orWhere('code', 'like', "%{$term}%");
      });
    }

    if (!empty($filters['discount_type'])) {
      if (in_array($filters['discount_type'], ['percent', 'percentage'])) {
        $query->whereIn('discount_type', ['percent', 'percentage']);
      } else {
        $query->where('discount_type', 'fixed');
      }
    }

    $vouchers = $query->orderByDesc('created_at')->get();

    $handle = fopen('php://temp', 'r+');
    fputcsv($handle, [
      'ID',
      'Name',
      'Code',
      'Discount Type',
      'Discount Value',
      'Discount Label',
      'Total Usage',
      'Slot',
      'Status',
      'Is Active',
      'Started At',
      'Expired At',
      'Created At',
    ]);

    foreach ($vouchers as $v) {
      fputcsv($handle, [
        $v->id,
        $v->name,
        $v->code,
        $v->normalized_discount_type,
        $v->discount_val,
        $v->discount_label,
        $v->total_usage,
        $v->slot,
        $v->calculateStatus(),
        $v->is_active ? 'Yes' : 'No',
        $v->started_at?->toISOString() ?? '-',
        $v->expired_at?->toISOString() ?? '-',
        $v->created_at?->toISOString() ?? '-',
      ]);
    }

    rewind($handle);
    $csv = stream_get_contents($handle);
    fclose($handle);

    return (string) $csv;
  }

  /**
   * Export voucher usages as CSV string.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return string
   */
  public function exportUsagesCsv(int $id, array $filters): string
  {
    $voucher = Voucher::findOrFail($id);
    $query = Order::with('user')->where('voucher_id', $voucher->id);

    if (!empty($filters['status']) && $filters['status'] !== 'all') {
      $query->where('status', $filters['status']);
    }

    $orders = $query->orderByDesc('created_at')->get();

    $handle = fopen('php://temp', 'r+');
    fputcsv($handle, [
      'Order ID',
      'Order Code',
      'Customer Email',
      'Status',
      'Subtotal',
      'Discount Amount',
      'Total',
      'Used At',
    ]);

    foreach ($orders as $order) {
      fputcsv($handle, [
        $order->id,
        $order->order_code,
        $order->user?->email ?? 'unknown',
        $order->status,
        $order->subtotal_price,
        $order->discount_amount,
        $order->total_price,
        ($order->paid_at ?? $order->created_at)?->toISOString() ?? '-',
      ]);
    }

    rewind($handle);
    $csv = stream_get_contents($handle);
    fclose($handle);

    return (string) $csv;
  }

  /**
   * Add target products to voucher.
   *
   * @param int $voucherId
   * @param array<int> $productIds
   * @return array<string, mixed>
   */
  public function addProducts(int $voucherId, array $productIds): array
  {
    $voucher = Voucher::findOrFail($voucherId);
    $voucher->products()->syncWithoutDetaching($productIds);
    $voucher->product_scope = 'specific_products';
    $voucher->save();

    $addedProducts = Product::whereIn('id', $productIds)->get(['id', 'name']);

    return [
      'voucher_id'     => $voucher->id,
      'product_scope'  => $voucher->product_scope,
      'total_products' => $voucher->products()->count(),
      'added_products' => $addedProducts->map(function ($p) {
        return [
          'id'   => $p->id,
          'name' => $p->name,
        ];
      })->values()->all(),
    ];
  }

  /**
   * Remove target products from voucher.
   *
   * @param int $voucherId
   * @param array<int> $productIds
   * @return array<string, mixed>
   */
  public function removeProducts(int $voucherId, array $productIds): array
  {
    $voucher = Voucher::findOrFail($voucherId);
    $detached = $voucher->products()->detach($productIds);

    return [
      'voucher_id'          => $voucher->id,
      'removed_count'       => (int) $detached,
      'removed_product_ids' => array_map('intval', array_values($productIds)),
      'total_products'      => $voucher->products()->count(),
    ];
  }

  /**
   * Add target users to voucher.
   *
   * @param int $voucherId
   * @param array<int> $userIds
   * @return array<string, mixed>
   */
  public function addUsers(int $voucherId, array $userIds): array
  {
    $voucher = Voucher::findOrFail($voucherId);
    $voucher->users()->syncWithoutDetaching($userIds);
    $voucher->target_type = 'specific_users';
    $voucher->save();

    $addedUsers = User::whereIn('id', $userIds)->get(['id', 'email']);

    return [
      'voucher_id'  => $voucher->id,
      'target_type' => $voucher->target_type,
      'total_users' => $voucher->users()->count(),
      'added_users' => $addedUsers->map(function ($u) {
        return [
          'id'    => $u->id,
          'email' => $u->email,
        ];
      })->values()->all(),
    ];
  }

  /**
   * Remove target users from voucher.
   *
   * @param int $voucherId
   * @param array<int> $userIds
   * @return array<string, mixed>
   */
  public function removeUsers(int $voucherId, array $userIds): array
  {
    $voucher = Voucher::findOrFail($voucherId);
    $detached = $voucher->users()->detach($userIds);

    return [
      'voucher_id'       => $voucher->id,
      'removed_count'    => (int) $detached,
      'removed_user_ids' => array_map('intval', array_values($userIds)),
      'total_users'      => $voucher->users()->count(),
    ];
  }
}

