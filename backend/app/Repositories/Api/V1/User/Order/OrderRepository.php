<?php

namespace App\Repositories\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Order\OrderRepositoryInterface;
use Illuminate\Support\Facades\DB;

class OrderRepository implements OrderRepositoryInterface
{
  /**
   * Create a new pending order for a product.
   *
   * @param User $user
   * @param Product $product
   * @return Order
   */
  public function createOrderForProduct(User $user, Product $product): Order
  {
    $unitPrice = ($product->discount_price > 0 && $product->discount_price < $product->price)
      ? $product->discount_price
      : $product->price;

    $subtotalPrice = $unitPrice;
    $discountAmount = 0;
    $totalPrice = max(0, $subtotalPrice - $discountAmount);

    $dateString = now()->format('Ymd');
    $latestOrder = Order::where('order_code', 'like', "ORD-{$dateString}-%")
      ->orderByDesc('id')
      ->first();

    $sequence = 1;
    if ($latestOrder && preg_match('/ORD-\d{8}-(\d+)/', $latestOrder->order_code, $matches)) {
      $sequence = ((int) $matches[1]) + 1;
    }

    $orderCode = 'ORD-' . $dateString . '-' . str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);

    while (Order::where('order_code', $orderCode)->exists()) {
      $sequence++;
      $orderCode = 'ORD-' . $dateString . '-' . str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
    }

    return DB::transaction(function () use ($user, $product, $orderCode, $subtotalPrice, $discountAmount, $totalPrice, $unitPrice) {
      $order = Order::create([
        'user_id'         => $user->id,
        'order_code'      => $orderCode,
        'voucher_id'      => null,
        'subtotal_price'  => $subtotalPrice,
        'discount_amount' => $discountAmount,
        'total_price'     => $totalPrice,
        'status'          => 'pending',
        'expired_at'      => now()->addHours(24),
        'paid_at'         => null,
      ]);

      $order->items()->create([
        'purchasable_type' => Product::class,
        'purchasable_id'   => $product->id,
        'price'            => $unitPrice,
      ]);

      return $order->load(['items.purchasable', 'payment']);
    });
  }

  /**
   * Find an order belonging to a user by ID or order code.
   *
   * @param User $user
   * @param int|string $orderIdentifier
   * @return Order|null
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
      ->with(['items.purchasable.files', 'payment'])
      ->first();
  }
}
