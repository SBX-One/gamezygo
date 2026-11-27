<?php

namespace App\Repositories\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Voucher;
use App\Repositories\Contracts\Api\V1\User\Order\OrderRepositoryInterface;
use App\Services\Credential\CredentialAllocationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\DB;

class OrderRepository implements OrderRepositoryInterface
{
    /**
     * Get paginated orders for a user with optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getUserOrders(User $user, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $status = $filters['status'] ?? null;

        return Order::where('user_id', $user->id)
            ->when($status, function ($query) use ($status) {
                if ($status === 'paid' || $status === 'settled') {
                    $query->whereIn('status', ['paid', 'settled']);
                } else {
                    $query->where('status', $status);
                }
            })
            ->with([
                'items.purchasable' => function (MorphTo $morphTo) {
                    $morphTo->morphWith([
                        Product::class => ['files'],
                    ]);
                },
                'payment',
            ])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Create a new pending order for a product.
     */
    public function createOrderForProduct(User $user, Product $product): Order
    {
        if (in_array($product->status, ['archive', 'archived', 'draft'], true) || ! empty($product->archived_at)) {
            throw new \DomainException('Product is currently unavailable or archived.');
        }

        $unitPrice = ($product->discount_price > 0 && $product->discount_price < $product->price)
          ? $product->discount_price
          : $product->price;

        $subtotalPrice = $unitPrice;
        $discountAmount = 0;
        $totalPrice = max(0, $subtotalPrice - $discountAmount);
        $orderCode = $this->generateOrderCode();

        return DB::transaction(function () use ($user, $product, $orderCode, $subtotalPrice, $discountAmount, $totalPrice, $unitPrice) {
            $order = Order::create([
                'user_id' => $user->id,
                'order_code' => $orderCode,
                'voucher_id' => null,
                'subtotal_price' => $subtotalPrice,
                'discount_amount' => $discountAmount,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'expired_at' => now()->addHours(24),
                'paid_at' => null,
            ]);

            $orderItem = $order->items()->create([
                'purchasable_type' => Product::class,
                'purchasable_id' => $product->id,
                'price' => $unitPrice,
            ]);

            // Anti-Double Allocation Concurrency Control
            app(CredentialAllocationService::class)->reserveCredential(
                $product,
                $user,
                $orderItem,
                15
            );

            return $order->load(['items.purchasable', 'payment']);
        });
    }

    /**
     * Create a new pending order from all items in user's cart.
     */
    public function createOrderFromCart(User $user): Order
    {
        $cartItems = $user->cartItems()->get();

        if ($cartItems->isEmpty()) {
            throw new \DomainException('Keranjang belanja Anda kosong.');
        }

        $archivedItems = $cartItems->filter(function ($product) {
            return in_array($product->status, ['archive', 'archived', 'draft'], true) || ! empty($product->archived_at);
        });

        if ($archivedItems->isNotEmpty()) {
            foreach ($archivedItems as $archivedItem) {
                $user->cartItems()->detach($archivedItem->id);
            }
            throw new \DomainException('Beberapa produk di keranjang Anda sudah tidak tersedia dan telah dihapus.');
        }

        $orderCode = $this->generateOrderCode();

        return DB::transaction(function () use ($user, $cartItems, $orderCode) {
            $subtotalPrice = 0;
            $itemsData = [];

            foreach ($cartItems as $product) {
                $unitPrice = ($product->discount_price > 0 && $product->discount_price < $product->price)
                  ? (int) $product->discount_price
                  : (int) $product->price;

                $subtotalPrice += $unitPrice;
                $itemsData[] = [
                    'product'   => $product,
                    'unitPrice' => $unitPrice,
                ];
            }

            $order = Order::create([
                'user_id'         => $user->id,
                'order_code'      => $orderCode,
                'voucher_id'      => null,
                'subtotal_price'  => $subtotalPrice,
                'discount_amount' => 0,
                'total_price'     => $subtotalPrice,
                'status'          => 'pending',
                'expired_at'      => now()->addHours(24),
                'paid_at'         => null,
            ]);

            $allocationService = app(CredentialAllocationService::class);

            foreach ($itemsData as $item) {
                $orderItem = $order->items()->create([
                    'purchasable_type' => Product::class,
                    'purchasable_id'   => $item['product']->id,
                    'price'            => $item['unitPrice'],
                ]);

                // Anti-Double Allocation Concurrency Control
                $allocationService->reserveCredential(
                    $item['product'],
                    $user,
                    $orderItem,
                    15
                );
            }

            // Clear the user's cart after creating the order
            $user->cartItems()->detach();

            return $order->load(['items.purchasable', 'payment']);
        });
    }

    /**
     * Create a new pending order for a subscription plan.
     */
    public function createOrderForSubscription(User $user, SubscriptionPlan $plan): Order
    {
        $unitPrice = (int) $plan->price;
        $subtotalPrice = $unitPrice;
        $discountAmount = 0;
        $totalPrice = $subtotalPrice;
        $orderCode = $this->generateOrderCode();

        return DB::transaction(function () use ($user, $plan, $orderCode, $subtotalPrice, $discountAmount, $totalPrice, $unitPrice) {
            $order = Order::create([
                'user_id' => $user->id,
                'order_code' => $orderCode,
                'voucher_id' => null,
                'subtotal_price' => $subtotalPrice,
                'discount_amount' => $discountAmount,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'expired_at' => now()->addHours(24),
                'paid_at' => null,
            ]);

            $order->items()->create([
                'purchasable_type' => SubscriptionPlan::class,
                'purchasable_id' => $plan->id,
                'price' => $unitPrice,
            ]);

            return $order->load(['items.purchasable', 'payment']);
        });
    }

    /**
     * Generate sequential unique order code.
     */
    protected function generateOrderCode(): string
    {
        $dateString = now()->format('Ymd');
        $latestOrder = Order::where('order_code', 'like', "ORD-{$dateString}-%")
            ->orderByDesc('id')
            ->first();

        $sequence = 1;
        if ($latestOrder && preg_match('/ORD-\d{8}-(\d+)/', $latestOrder->order_code, $matches)) {
            $sequence = ((int) $matches[1]) + 1;
        }

        $orderCode = 'ORD-'.$dateString.'-'.str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);

        while (Order::where('order_code', $orderCode)->exists()) {
            $sequence++;
            $orderCode = 'ORD-'.$dateString.'-'.str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
        }

        return $orderCode;
    }

    /**
     * Find an order belonging to a user by ID or order code.
     */
    public function findUserOrder(User $user, int|string $orderIdentifier): ?Order
    {
        return Order::where('user_id', $user->id)
            ->where(function ($query) use ($orderIdentifier) {
                if (is_numeric($orderIdentifier)) {
                    $query->where('id', (int) $orderIdentifier)
                        ->orWhere('order_code', (string) $orderIdentifier);
                } else {
                    $query->where('order_code', (string) $orderIdentifier);
                }
            })
            ->with([
                'items.purchasable' => function (MorphTo $morphTo) {
                    $morphTo->morphWith([
                        Product::class => ['files'],
                    ]);
                },
                'payment',
            ])
            ->first();
    }

    /**
     * Find an active voucher by its code.
     */
    public function findVoucherByCode(string $code): ?Voucher
    {
        return Voucher::where('code', $code)
            ->with(['users', 'products'])
            ->first();
    }

    /**
     * Apply a voucher to an order and update calculated totals.
     */
    public function applyVoucher(Order $order, Voucher $voucher, int $discountAmount): Order
    {
        $totalPrice = max(0, $order->subtotal_price - $discountAmount);

        $order->update([
            'voucher_id' => $voucher->id,
            'discount_amount' => $discountAmount,
            'total_price' => $totalPrice,
        ]);

        return $order->fresh();
    }

    /**
     * Remove voucher from an order and reset discount and total.
     */
    public function removeVoucher(Order $order): Order
    {
        $order->update([
            'voucher_id' => null,
            'discount_amount' => 0,
            'total_price' => $order->subtotal_price,
        ]);

        return $order->fresh();
    }
}
