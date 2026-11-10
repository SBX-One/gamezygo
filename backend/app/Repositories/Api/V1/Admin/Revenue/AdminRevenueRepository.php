<?php

namespace App\Repositories\Api\V1\Admin\Revenue;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\Voucher;
use App\Repositories\Contracts\Api\V1\Admin\Revenue\AdminRevenueRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminRevenueRepository implements AdminRevenueRepositoryInterface
{
  /**
   * Get revenue dashboard data.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getRevenueDashboard(array $filters = []): array
  {
    $rangeData = $this->resolveDateRanges($filters);
    $currentRange = $rangeData['current'];
    $previousRange = $rangeData['previous'];
    $diffDays = $rangeData['diff_days'];
    $periodName = $rangeData['period'];

    $totalRevenueStats = $this->getTotalRevenueStats($currentRange, $previousRange, $periodName);
    $aovStats = $this->getAverageOrderValueStats($currentRange, $previousRange, $diffDays, $totalRevenueStats['total'], $totalRevenueStats['transactions_count']);
    $totalOrdersStats = $this->getTotalOrdersStats($currentRange, $periodName);
    $voucherBurnStats = $this->getVoucherBurnStats($currentRange, $previousRange, $diffDays);
    $revenueChart = $this->getRevenueChart($currentRange, $periodName);
    $incomeSpread = $this->getIncomeSpread($currentRange, $periodName);
    $productsList = $this->getProductsList();
    $bundleStats = $this->getBundleStatistics();
    $vouchersList = $this->getVouchersList($currentRange);

    return [
      'total_revenue'       => [
        'total'       => $totalRevenueStats['total'],
        'percentage'  => $totalRevenueStats['percentage'],
        'description' => $totalRevenueStats['description'],
        'period'      => $totalRevenueStats['period'],
      ],
      'average_order_value' => $aovStats,
      'total_orders'        => $totalOrdersStats,
      'voucher_burn'        => $voucherBurnStats,
      'revenue_chart'       => $revenueChart,
      'income_spread'       => $incomeSpread,
      'products'            => $productsList,
      'bundle_statistics'   => $bundleStats,
      'vouchers'            => $vouchersList,
    ];
  }

  /**
   * Get revenue metrics for a specific product.
   *
   * @param int $productId
   * @return array<string, mixed>
   */
  public function getProductRevenue(int $productId): array
  {
    $product = Product::with(['genreCategories', 'files'])->findOrFail($productId);

    $now = now();
    $recent30Days = [$now->copy()->subDays(30)->startOfDay(), $now->copy()->endOfDay()];
    $prior30Days = [$now->copy()->subDays(60)->startOfDay(), $now->copy()->subDays(30)->startOfDay()];

    // Total sold & revenue across all paid orders
    $totalSold = OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->where('purchasable_id', $product->id)
      ->whereHas('order', fn($q) => $q->where('status', 'paid'))
      ->count();

    $totalRevenue = (int) OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->where('purchasable_id', $product->id)
      ->whereHas('order', fn($q) => $q->where('status', 'paid'))
      ->sum('price');

    // Revenue growth in 30 days
    $recentRevenue = (int) OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->where('purchasable_id', $product->id)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->whereBetween('created_at', $recent30Days))
      ->sum('price');

    $priorRevenue = (int) OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->where('purchasable_id', $product->id)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->whereBetween('created_at', $prior30Days))
      ->sum('price');

    $revenueGrowthPercentage = $priorRevenue > 0
      ? (int) round((($recentRevenue - $priorRevenue) / $priorRevenue) * 100)
      : ($recentRevenue > 0 ? 100 : 0);

    // Rank among all products
    $higherProductsCount = DB::table('order_items')
      ->where('purchasable_type', Product::class)
      ->whereIn('order_id', Order::query()->where('status', 'paid')->select('id'))
      ->select('purchasable_id', DB::raw('SUM(price) as rev'))
      ->groupBy('purchasable_id')
      ->having(DB::raw('SUM(price)'), '>', $totalRevenue)
      ->get()
      ->count();

    $rankNumber = $higherProductsCount + 1;

    // Recent sold in 30 days
    $recentSold = OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->where('purchasable_id', $product->id)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->whereBetween('created_at', $recent30Days))
      ->count();

    $priorSold = OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->where('purchasable_id', $product->id)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->whereBetween('created_at', $prior30Days))
      ->count();

    $soldGrowthPercentage = $priorSold > 0
      ? (int) round((($recentSold - $priorSold) / $priorSold) * 100)
      : ($recentSold > 0 ? 100 : 0);

    $formattedTotalRevenue = number_format($totalRevenue, 0, ',', '.');

    return [
      'product'    => [
        'id'         => $product->id,
        'name'       => $product->name,
        'thumbnail'  => $product->thumbnail ?? 'https://placehold.co/600x400',
        'categories' => $product->genreCategories->map(function ($cat) {
          return [
            'id'   => $cat->id,
            'name' => $cat->name,
            'slug' => $cat->slug,
          ];
        })->values()->all(),
      ],
      'total_sold' => $totalSold,
      'revenue'    => [
        'total'       => $totalRevenue,
        'percentage'  => $revenueGrowthPercentage,
        'description' => "KEUNTUNGAN IDR {$formattedTotalRevenue}",
      ],
      'rank'       => [
        'total'       => $rankNumber,
        'description' => "KEUNTUNGAN IDR {$formattedTotalRevenue}",
      ],
      'last_sold'  => [
        'total'       => $recentSold,
        'percentage'  => $soldGrowthPercentage,
        'description' => "KEUNTUNGAN IDR {$formattedTotalRevenue}",
      ],
    ];
  }

  /**
   * Resolve date ranges and period label from filters.
   *
   * @param array<string, mixed> $filters
   * @return array{current: ?array{0: Carbon, 1: Carbon}, previous: ?array{0: Carbon, 1: Carbon}, diff_days: int, period: string}
   */
  protected function resolveDateRanges(array $filters): array
  {
    $now = now();

    if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
      $start = Carbon::parse($filters['start_date'])->startOfDay();
      $end = Carbon::parse($filters['end_date'])->endOfDay();
      $diffDays = (int) $start->diffInDays($end) + 1;

      $current = [$start, $end];
      $previous = [$start->copy()->subDays($diffDays)->startOfDay(), $start->copy()->subDay()->endOfDay()];
      $period = $filters['period'] ?? 'weekly';

      return [
        'current'   => $current,
        'previous'  => $previous,
        'diff_days' => $diffDays,
        'period'    => $period,
      ];
    }

    $period = $filters['period'] ?? 'weekly';

    return match ($period) {
      'today' => [
        'current'   => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
        'previous'  => [$now->copy()->subDay()->startOfDay(), $now->copy()->subDay()->endOfDay()],
        'diff_days' => 1,
        'period'    => 'today',
      ],
      'yesterday' => [
        'current'   => [$now->copy()->subDay()->startOfDay(), $now->copy()->subDay()->endOfDay()],
        'previous'  => [$now->copy()->subDays(2)->startOfDay(), $now->copy()->subDays(2)->endOfDay()],
        'diff_days' => 1,
        'period'    => 'yesterday',
      ],
      'monthly', 'month', 'this_month' => [
        'current'   => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
        'previous'  => [$now->copy()->subMonth()->startOfMonth(), $now->copy()->subMonth()->endOfMonth()],
        'diff_days' => (int) $now->daysInMonth,
        'period'    => 'monthly',
      ],
      'yearly', 'year', 'this_year' => [
        'current'   => [$now->copy()->startOfYear(), $now->copy()->endOfYear()],
        'previous'  => [$now->copy()->subYear()->startOfYear(), $now->copy()->subYear()->endOfYear()],
        'diff_days' => 365,
        'period'    => 'yearly',
      ],
      'all_time', 'all' => [
        'current'   => null,
        'previous'  => null,
        'diff_days' => 30,
        'period'    => 'all_time',
      ],
      default => [
        'current'   => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
        'previous'  => [$now->copy()->subWeek()->startOfWeek(), $now->copy()->subWeek()->endOfWeek()],
        'diff_days' => 7,
        'period'    => 'weekly',
      ],
    };
  }

  /**
   * Get total revenue statistics.
   *
   * @param array|null $currentRange
   * @param array|null $previousRange
   * @param string $period
   * @return array{total: int, percentage: int, description: string, period: string, transactions_count: int}
   */
  protected function getTotalRevenueStats(?array $currentRange, ?array $previousRange, string $period): array
  {
    $currentQuery = Order::query()->where('status', 'paid');
    if ($currentRange) {
      $currentQuery->whereBetween('created_at', $currentRange);
    }

    $totalRevenue = (int) $currentQuery->sum('total_price');
    $transactionsCount = $currentQuery->count();

    $prevRevenue = 0;
    if ($previousRange) {
      $prevRevenue = (float) Order::query()
        ->where('status', 'paid')
        ->whereBetween('created_at', $previousRange)
        ->sum('total_price');
    }

    if ($prevRevenue > 0) {
      $percentage = (int) round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100);
    } else {
      $percentage = $totalRevenue > 0 ? 100 : 0;
    }

    return [
      'total'              => $totalRevenue,
      'percentage'         => $percentage,
      'description'        => "PENDAPATAN DARI {$transactionsCount} TRANSAKSI",
      'period'             => $period,
      'transactions_count' => $transactionsCount,
    ];
  }

  /**
   * Get average order value statistics.
   *
   * @param array|null $currentRange
   * @param array|null $previousRange
   * @param int $diffDays
   * @param int $currentTotalRevenue
   * @param int $currentTransactionsCount
   * @return array{total: int, percentage: int, description: string}
   */
  protected function getAverageOrderValueStats(?array $currentRange, ?array $previousRange, int $diffDays, int $currentTotalRevenue, int $currentTransactionsCount): array
  {
    $currentAov = $currentTransactionsCount > 0 ? (int) round($currentTotalRevenue / $currentTransactionsCount) : 0;

    $prevQuery = Order::query()->where('status', 'paid');
    if ($previousRange) {
      $prevQuery->whereBetween('created_at', $previousRange);
    }

    $prevRevenue = (float) $prevQuery->sum('total_price');
    $prevCount = $prevQuery->count();
    $prevAov = $prevCount > 0 ? (int) round($prevRevenue / $prevCount) : 0;

    if ($prevAov > 0) {
      $percentage = (int) round((($currentAov - $prevAov) / $prevAov) * 100);
    } else {
      $percentage = $currentAov > 0 ? 100 : 0;
    }

    return [
      'total'       => $currentAov,
      'percentage'  => $percentage,
      'description' => "FROM {$diffDays} DAYS AGO",
    ];
  }

  /**
   * Get total orders statistics.
   *
   * @param array|null $currentRange
   * @param string $period
   * @return array{total: int, description: string, period: string}
   */
  protected function getTotalOrdersStats(?array $currentRange, string $period): array
  {
    $totalOrders = Order::query()
      ->when($currentRange, fn($q) => $q->whereBetween('created_at', $currentRange))
      ->count();

    return [
      'total'       => $totalOrders,
      'description' => 'TOTAL ORDER',
      'period'      => $period,
    ];
  }

  /**
   * Get voucher burn statistics.
   *
   * @param array|null $currentRange
   * @param array|null $previousRange
   * @param int $diffDays
   * @return array{total: int, percentage: int, description: string}
   */
  protected function getVoucherBurnStats(?array $currentRange, ?array $previousRange, int $diffDays): array
  {
    $currentBurn = (int) Order::query()
      ->where('status', 'paid')
      ->when($currentRange, fn($q) => $q->whereBetween('created_at', $currentRange))
      ->sum('discount_amount');

    $prevBurn = 0;
    if ($previousRange) {
      $prevBurn = (float) Order::query()
        ->where('status', 'paid')
        ->whereBetween('created_at', $previousRange)
        ->sum('discount_amount');
    }

    if ($prevBurn > 0) {
      $percentage = (int) round((($currentBurn - $prevBurn) / $prevBurn) * 100);
    } else {
      $percentage = $currentBurn > 0 ? 100 : 0;
    }

    return [
      'total'       => $currentBurn,
      'percentage'  => $percentage,
      'description' => "FROM {$diffDays} DAYS AGO",
    ];
  }

  /**
   * Get weekly / day-by-day revenue chart.
   *
   * @param array|null $currentRange
   * @param string $period
   * @return array{period: string, data: array<int, array{day: string, revenue: int}>}
   */
  protected function getRevenueChart(?array $currentRange, string $period): array
  {
    $daysMap = [
      'Senin'  => 0,
      'Selasa' => 0,
      'Rabu'   => 0,
      'Kamis'  => 0,
      'Jumat'  => 0,
      'Sabtu'  => 0,
      'Minggu' => 0,
    ];

    $ordersQuery = Order::query()->where('status', 'paid');
    if ($currentRange) {
      $ordersQuery->whereBetween('created_at', $currentRange);
    }

    $orders = $ordersQuery->get(['total_price', 'created_at']);
    foreach ($orders as $order) {
      $dayName = match ($order->created_at->dayOfWeek) {
        1 => 'Senin',
        2 => 'Selasa',
        3 => 'Rabu',
        4 => 'Kamis',
        5 => 'Jumat',
        6 => 'Sabtu',
        default => 'Minggu',
      };
      $daysMap[$dayName] += (int) $order->total_price;
    }

    $chartData = [];
    foreach ($daysMap as $day => $rev) {
      $chartData[] = [
        'day'     => $day,
        'revenue' => $rev,
      ];
    }

    return [
      'period' => $period,
      'data'   => $chartData,
    ];
  }

  /**
   * Get income spread by product type and top products.
   *
   * @param array|null $currentRange
   * @param string $period
   * @return array<string, mixed>
   */
  protected function getIncomeSpread(?array $currentRange, string $period): array
  {
    $bundleTotal = (int) OrderItem::query()
      ->where('purchasable_type', SubscriptionPlan::class)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->when($currentRange, fn($sq) => $sq->whereBetween('created_at', $currentRange)))
      ->sum('price');

    $gameTotal = (int) OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->when($currentRange, fn($sq) => $sq->whereBetween('created_at', $currentRange)))
      ->sum('price');

    $totalSpread = $bundleTotal + $gameTotal;

    $bundlePercentage = $totalSpread > 0 ? (int) round(($bundleTotal / $totalSpread) * 100) : 0;
    $gamePercentage = $totalSpread > 0 ? (int) round(($gameTotal / $totalSpread) * 100) : 0;

    $topProductsQuery = OrderItem::query()
      ->where('purchasable_type', Product::class)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->when($currentRange, fn($sq) => $sq->whereBetween('created_at', $currentRange)))
      ->select('purchasable_id', DB::raw('SUM(price) as total_rev'))
      ->groupBy('purchasable_id')
      ->orderByDesc('total_rev')
      ->limit(5)
      ->with('purchasable')
      ->get();

    $products = [];
    foreach ($topProductsQuery as $row) {
      $productName = $row->purchasable?->name ?? "Product #{$row->purchasable_id}";
      $rev = (int) $row->total_rev;
      $percentage = $totalSpread > 0 ? (int) round(($rev / $totalSpread) * 100) : 0;

      $products[] = [
        'name'       => $productName,
        'total'      => $rev,
        'percentage' => $percentage,
      ];
    }

    return [
      'period'        => $period,
      'total'         => $totalSpread,
      'product_types' => [
        [
          'name'       => 'Paket',
          'total'      => $bundleTotal,
          'percentage' => $bundlePercentage,
        ],
        [
          'name'       => 'Game Satuan',
          'total'      => $gameTotal,
          'percentage' => $gamePercentage,
        ],
      ],
      'products'      => $products,
    ];
  }

  /**
   * Get products statistics and listed items.
   *
   * @return array<string, mixed>
   */
  protected function getProductsList(): array
  {
    $totalListed = Product::where('status', '!=', 'archive')->count();

    $items = Product::query()
      ->where('status', '!=', 'archive')
      ->withCount(['orderItems as total_sold' => function ($q) {
        $q->whereHas('order', fn($sub) => $sub->where('status', 'paid'));
      }])
      ->withSum(['orderItems as total_revenue' => function ($q) {
        $q->whereHas('order', fn($sub) => $sub->where('status', 'paid'));
      }], 'price')
      ->orderByDesc('total_revenue')
      ->limit(10)
      ->get();

    $itemsData = $items->map(function ($product) {
      $status = match ($product->status) {
        'draft'     => 'pending',
        'archive'   => 'inactive',
        default     => 'active',
      };

      return [
        'name'          => $product->name,
        'total_sold'    => (int) ($product->total_sold ?? 0),
        'total_revenue' => (int) ($product->total_revenue ?? 0),
        'date'          => $product->updated_at ? $product->updated_at->toIso8601String() : now()->toIso8601String(),
        'status'        => $status,
      ];
    })->values()->all();

    return [
      'total'       => $totalListed,
      'description' => "{$totalListed} Games Listed",
      'items'       => $itemsData,
    ];
  }

  /**
   * Get bundle statistics for monthly comparison.
   *
   * @return array<string, mixed>
   */
  protected function getBundleStatistics(): array
  {
    $now = now();
    $thisMonthStart = $now->copy()->startOfMonth();
    $thisMonthEnd = $now->copy()->endOfMonth();
    $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
    $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

    $thisMonthSubRev = (int) OrderItem::query()
      ->where('purchasable_type', SubscriptionPlan::class)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd]))
      ->sum('price');

    $lastMonthSubRev = (int) OrderItem::query()
      ->where('purchasable_type', SubscriptionPlan::class)
      ->whereHas('order', fn($q) => $q->where('status', 'paid')->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd]))
      ->sum('price');

    $diff = $thisMonthSubRev - $lastMonthSubRev;
    $growthPercentage = $lastMonthSubRev > 0
      ? (int) round(($diff / $lastMonthSubRev) * 100)
      : ($thisMonthSubRev > 0 ? 100 : 0);

    $formattedDiff = number_format(abs($diff), 0, ',', '.');
    $description = $diff >= 0
      ? "NAIK IDR {$formattedDiff} DARI BULAN LALU"
      : "TURUN IDR {$formattedDiff} DARI BULAN LALU";

    $activeSubs = UserSubscription::query()
      ->where('status', 'active')
      ->where('expired_at', '>', $now)
      ->count();

    $lastMonthSubs = UserSubscription::query()
      ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
      ->count();

    return [
      'growth_percentage'            => $growthPercentage,
      'description'                  => $description,
      'last_month'                   => [
        'total' => $lastMonthSubRev,
      ],
      'this_month'                   => [
        'total' => $thisMonthSubRev,
      ],
      'total_active_subscribers'     => $activeSubs,
      'total_subscribers_last_month' => $lastMonthSubs,
    ];
  }

  /**
   * Get voucher analytics and items used.
   *
   * @param array|null $currentRange
   * @return array<string, mixed>
   */
  protected function getVouchersList(?array $currentRange): array
  {
    $totalActive = Voucher::query()
      ->where('is_active', true)
      ->where(function ($q) {
        $q->whereNull('expired_at')->orWhere('expired_at', '>', now());
      })
      ->count();

    $totalBurn = (int) Order::query()
      ->where('status', 'paid')
      ->when($currentRange, fn($q) => $q->whereBetween('created_at', $currentRange))
      ->sum('discount_amount');

    $voucherUsage = Order::query()
      ->where('status', 'paid')
      ->whereNotNull('voucher_id')
      ->when($currentRange, fn($q) => $q->whereBetween('created_at', $currentRange))
      ->select('voucher_id', DB::raw('COUNT(*) as total_used'), DB::raw('SUM(discount_amount) as minus_rev'))
      ->groupBy('voucher_id')
      ->with('voucher')
      ->orderByDesc('total_used')
      ->limit(10)
      ->get();

    $items = $voucherUsage->map(function ($row) {
      $name = $row->voucher?->code ?? ($row->voucher?->name ?? "VOUCHER-{$row->voucher_id}");

      return [
        'name'          => $name,
        'total_used'    => (int) $row->total_used,
        'minus_revenue' => (int) $row->minus_rev,
      ];
    })->values()->all();

    return [
      'total_active' => $totalActive,
      'total_burn'   => $totalBurn,
      'items'        => $items,
    ];
  }
}

