<?php

namespace App\Repositories\Api\V1\Admin\Dashboard;

use App\Models\GameRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\Admin\Dashboard\AdminDashboardRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardRepository implements AdminDashboardRepositoryInterface
{
    /**
     * Resolve date ranges for the requested period.
     *
     * @return array{current: ?array{0: Carbon, 1: Carbon}, previous: ?array{0: Carbon, 1: Carbon}}
     */
    public function resolvePeriodRanges(string $period): array
    {
        $now = now();

        return match ($period) {
            'yesterday' => [
                'current' => [$now->copy()->subDay()->startOfDay(), $now->copy()->subDay()->endOfDay()],
                'previous' => [$now->copy()->subDays(2)->startOfDay(), $now->copy()->subDays(2)->endOfDay()],
            ],
            'this_week', 'week' => [
                'current' => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
                'previous' => [$now->copy()->subWeek()->startOfWeek(), $now->copy()->subWeek()->endOfWeek()],
            ],
            'this_month', 'month' => [
                'current' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
                'previous' => [$now->copy()->subMonth()->startOfMonth(), $now->copy()->subMonth()->endOfMonth()],
            ],
            'this_year', 'year' => [
                'current' => [$now->copy()->startOfYear(), $now->copy()->endOfYear()],
                'previous' => [$now->copy()->subYear()->startOfYear(), $now->copy()->subYear()->endOfYear()],
            ],
            'all_time', 'all' => [
                'current' => null,
                'previous' => null,
            ],
            default => [
                'current' => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
                'previous' => [$now->copy()->subDay()->startOfDay(), $now->copy()->subDay()->endOfDay()],
            ],
        };
    }

    /**
     * Calculate income statistics and percentage growth for the period.
     *
     * @return array{total: int, percentage: float, description: string}
     */
    public function getIncomeStats(?array $currentRange, ?array $previousRange): array
    {
        $currentQuery = Order::query()->where('status', 'paid');
        if ($currentRange) {
            $currentQuery->whereBetween('created_at', $currentRange);
        }

        $totalIncome = (int) $currentQuery->sum('total_price');
        $transactionsCount = $currentQuery->count();

        $prevIncome = 0;
        if ($previousRange) {
            $prevIncome = (float) Order::query()
                ->where('status', 'paid')
                ->whereBetween('created_at', $previousRange)
                ->sum('total_price');
        }

        if ($prevIncome > 0) {
            $percentage = round((($totalIncome - $prevIncome) / $prevIncome) * 100, 1);
        } else {
            $percentage = $totalIncome > 0 ? 100.0 : 0.0;
        }

        return [
            'total' => $totalIncome,
            'percentage' => (float) $percentage,
            'description' => "PENDAPATAN DARI {$transactionsCount} TRANSAKSI",
        ];
    }

    /**
     * Get orders statistics.
     *
     * @return array{total: int, description: string}
     */
    public function getOrdersStats(?array $currentRange): array
    {
        $ordersQuery = Order::query();
        if ($currentRange) {
            $ordersQuery->whereBetween('created_at', $currentRange);
        }
        $totalOrders = $ordersQuery->count();

        $newOrdersToday = Order::query()
            ->whereBetween('created_at', [now()->startOfDay(), now()->endOfDay()])
            ->count();

        return [
            'total' => $totalOrders,
            'description' => "{$newOrdersToday} ORDER BARU HARI INI",
        ];
    }

    /**
     * Get active users count and total users description.
     *
     * @return array{total: int, description: string}
     */
    public function getUserActiveStats(): array
    {
        $activeUsers = User::query()->where('status', 'active')->count();
        $totalUsers = User::query()->count();

        return [
            'total' => $activeUsers,
            'description' => 'DARI TOTAL '.number_format($totalUsers).' USERS',
        ];
    }

    /**
     * Get active subscriptions count.
     *
     * @return array{total: int, description: string}
     */
    public function getActiveSubsStats(): array
    {
        $activeSubs = UserSubscription::query()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->count();

        return [
            'total' => $activeSubs,
            'description' => 'SUBSCRIPTION AKTIF',
        ];
    }

    /**
     * Get top performing products by order count.
     *
     * @return array<int, array{name: string, total: int}>
     */
    public function getProductPerformance(?array $currentRange, int $limit = 6): array
    {
        $products = Product::query()
            ->withCount(['orderItems as total' => function ($query) use ($currentRange) {
                if ($currentRange) {
                    $query->whereBetween('created_at', $currentRange);
                }
            }])
            ->orderByDesc('total')
            ->limit($limit)
            ->get();

        if ($products->sum('total') === 0 && $currentRange !== null) {
            $allTimeProducts = Product::query()
                ->withCount('orderItems as total')
                ->orderByDesc('total')
                ->limit($limit)
                ->get();

            if ($allTimeProducts->sum('total') > 0) {
                $products = $allTimeProducts;
            }
        }

        return $products->map(function ($product) {
            return [
                'name' => $product->name,
                'total' => (int) $product->total,
            ];
        })->values()->all();
    }

    /**
     * Get recent transactions.
     *
     * @return array<int, array{customer_email: string, product_name: string, revenue: string, date: string, status: string}>
     */
    public function getRecentTransactions(int $limit = 6): array
    {
        $statusMap = [
            'paid' => 'Paid',
            'pending' => 'Pending',
            'failed' => 'Failed',
            'cancelled' => 'Cancelled',
            'expired' => 'Cancelled',
            'refunded' => 'Refunded',
        ];

        $orders = Order::query()
            ->with(['user', 'items.purchasable'])
            ->latest('created_at')
            ->latest('id')
            ->limit($limit)
            ->get();

        return $orders->map(function ($order) use ($statusMap) {
            $firstItem = $order->items->first();
            $productName = $firstItem?->purchasable?->name ?? 'Gamezygo Product';

            $status = $statusMap[$order->status] ?? ucfirst((string) $order->status);

            return [
                'customer_email' => $order->user?->email ?? '-',
                'product_name' => $productName,
                'revenue' => 'Rp '.number_format((int) $order->total_price, 0, ',', '.'),
                'date' => $order->created_at ? $order->created_at->format('d/m/Y H:i:s') : now()->format('d/m/Y H:i:s'),
                'status' => $status,
            ];
        })->values()->all();
    }

    /**
     * Get top requested games.
     *
     * @return array<int, array{product_image_url: string, product_name: string, total_request: int, steam_url: string}>
     */
    public function getTopGameRequests(int $limit = 5): array
    {
        $requests = GameRequest::query()
            ->select('name', 'steam_url', DB::raw('MAX(request_count) as total_request'))
            ->whereNotNull('name')
            ->groupBy('name', 'steam_url')
            ->orderByDesc('total_request')
            ->limit($limit)
            ->get();

        return $requests->map(function ($item) {
            $product = Product::query()
                ->where('steam_url', $item->steam_url)
                ->orWhere('name', $item->name)
                ->first();

            return [
                'product_image_url' => $product?->thumbnail ?? 'https://placehold.co/200x300',
                'product_name' => (string) $item->name,
                'total_request' => (int) ($item->total_request ?? 1),
                'steam_url' => (string) $item->steam_url,
            ];
        })->values()->all();
    }

    /**
     * Get revenue dashboard transaction metrics for today, week, and month alongside recent transactions.
     *
     * @return array<string, mixed>
     */
    public function getRevenueDashboardData(int $limit = 10): array
    {
        $now = now();

        // Today vs Yesterday
        $todayStats = $this->calculateTransactionPeriodStats(
            $now->copy()->startOfDay(),
            $now->copy()->endOfDay(),
            $now->copy()->subDay()->startOfDay(),
            $now->copy()->subDay()->endOfDay()
        );

        // This Week vs Previous Week
        $weekStats = $this->calculateTransactionPeriodStats(
            $now->copy()->startOfWeek(),
            $now->copy()->endOfWeek(),
            $now->copy()->subWeek()->startOfWeek(),
            $now->copy()->subWeek()->endOfWeek()
        );

        // This Month vs Previous Month
        $monthStats = $this->calculateTransactionPeriodStats(
            $now->copy()->startOfMonth(),
            $now->copy()->endOfMonth(),
            $now->copy()->subMonth()->startOfMonth(),
            $now->copy()->subMonth()->endOfMonth()
        );

        $orders = Order::query()
            ->with(['user', 'items.purchasable'])
            ->latest('created_at')
            ->latest('id')
            ->limit($limit)
            ->get();

        $transactions = $orders->map(function ($order) {
            $firstItem = $order->items->first();
            $product = $firstItem?->purchasable;

            return [
                'id' => (string) ($order->order_code ?? $order->id),
                'customer_email' => (string) ($order->user?->email ?? '-'),
                'product_id' => (string) ($firstItem?->purchasable_id ?? ($product?->id ?? '-')),
                'product_name' => (string) ($product?->name ?? 'Gamezygo Product'),
                'total' => (int) $order->total_price,
                'date' => $order->created_at ? $order->created_at->format('d/m/Y H:i:s') : now()->format('d/m/Y H:i:s'),
                'status' => (string) strtolower($order->status),
            ];
        })->values()->all();

        return [
            'today_transactions' => $todayStats,
            'week_transactions' => $weekStats,
            'month_transactions' => $monthStats,
            'transactins' => $transactions,
        ];
    }

    /**
     * Helper to calculate period transaction count, percentage growth, and paid revenue description.
     *
     * @return array{total: int, percentage: float, description: string}
     */
    private function calculateTransactionPeriodStats(Carbon $currentStart, Carbon $currentEnd, Carbon $prevStart, Carbon $prevEnd): array
    {
        $currentCount = Order::query()
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->count();

        $prevCount = Order::query()
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $revenue = (int) Order::query()
            ->where('status', 'paid')
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->sum('total_price');

        if ($prevCount > 0) {
            $percentage = round((($currentCount - $prevCount) / $prevCount) * 100, 1);
        } else {
            $percentage = $currentCount > 0 ? 100.0 : 0.0;
        }

        return [
            'total' => $currentCount,
            'percentage' => (float) $percentage,
            'description' => 'KEUNTUNGAN IDR '.number_format($revenue),
        ];
    }
}
