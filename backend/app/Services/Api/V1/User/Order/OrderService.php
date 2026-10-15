<?php

namespace App\Services\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Order\OrderRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OrderService
{
  public function __construct(
    protected OrderRepositoryInterface $orderRepository
  ) {}

  /**
   * Create a new order for user.
   *
   * @param User $user
   * @param array $data
   * @return Order
   */
  public function createOrder(User $user, array $data): Order
  {
    $product = Product::findOrFail($data['product_id']);

    return $this->orderRepository->createOrderForProduct($user, $product);
  }

  /**
   * Get order details for a user.
   *
   * @param User $user
   * @param int|string $orderIdentifier
   * @return Order|null
   */
  public function getOrderDetails(User $user, int|string $orderIdentifier): ?Order
  {
    return $this->orderRepository->findUserOrder($user, $orderIdentifier);
  }

  /**
   * Apply voucher to an order.
   *
   * @param User $user
   * @param int|string $orderIdentifier
   * @param string $voucherCode
   * @return Order
   * @throws ModelNotFoundException
   * @throws \DomainException
   */
  public function applyVoucher(User $user, int|string $orderIdentifier, string $voucherCode): Order
  {
    $order = $this->orderRepository->findUserOrder($user, $orderIdentifier);

    if (!$order) {
      throw new ModelNotFoundException('Order not found.');
    }

    if ($order->status !== 'pending') {
      throw new \DomainException('Voucher can only be applied to pending orders.');
    }

    $voucher = $this->orderRepository->findVoucherByCode($voucherCode);

    if (!$voucher || !$voucher->is_active) {
      throw new \DomainException('Invalid voucher code.');
    }

    if ($voucher->started_at && now()->lt($voucher->started_at)) {
      throw new \DomainException('Voucher has not started yet.');
    }

    if ($voucher->expired_at && now()->gt($voucher->expired_at)) {
      throw new \DomainException('Voucher has expired.');
    }

    if ($voucher->slot > 0 && $voucher->total_usage >= $voucher->slot) {
      throw new \DomainException('Voucher usage limit has been reached.');
    }

    if ($voucher->usage_limit_per_user > 0) {
      $userUsage = Order::where('user_id', $user->id)
        ->where('voucher_id', $voucher->id)
        ->where('status', 'paid')
        ->count();

      if ($userUsage >= $voucher->usage_limit_per_user) {
        throw new \DomainException('You have reached the maximum usage limit for this voucher.');
      }
    }

    if ($voucher->target_type === 'specific_users') {
      $isTargetUser = $voucher->users()->where('users.id', $user->id)->exists();
      if (!$isTargetUser) {
        throw new \DomainException('This voucher is not applicable to your account.');
      }
    }

    if (in_array($voucher->applies_to, ['one_time', 'product'], true)) {
      $hasProduct = $order->items->contains(function ($item) {
        return $item->purchasable_type === Product::class
          || $item->purchasable instanceof Product;
      });

      if (!$hasProduct) {
        throw new \DomainException('This voucher can only be used for product purchases.');
      }
    } elseif ($voucher->applies_to === 'subscription') {
      $hasSubscription = $order->items->contains(function ($item) {
        return $item->purchasable_type === SubscriptionPlan::class
          || $item->purchasable instanceof SubscriptionPlan;
      });

      if (!$hasSubscription) {
        throw new \DomainException('This voucher can only be used for subscription purchases.');
      }
    }

    if ($voucher->product_scope === 'specific_products') {
      $productIds = $order->items->pluck('purchasable_id');
      $isProductEligible = $voucher->products()->whereIn('products.id', $productIds)->exists();
      if (!$isProductEligible) {
        throw new \DomainException('This voucher cannot be applied to the selected products.');
      }
    }

    if ($voucher->min_purchase > 0 && $order->subtotal_price < $voucher->min_purchase) {
      throw new \DomainException("Minimum purchase of {$voucher->min_purchase} is required to use this voucher.");
    }

    // Calculate discount amount
    if ($voucher->discount_type === 'percentage') {
      $discount = (int) round(($order->subtotal_price * $voucher->discount_amount) / 100);
      if ($voucher->max_discount > 0 && $discount > $voucher->max_discount) {
        $discount = $voucher->max_discount;
      }
    } else {
      $discount = (int) $voucher->discount_amount;
    }

    $discount = min($discount, $order->subtotal_price);

    return $this->orderRepository->applyVoucher($order, $voucher, $discount);
  }

  /**
   * Remove applied voucher from an order.
   *
   * @param User $user
   * @param int|string $orderIdentifier
   * @return Order
   * @throws ModelNotFoundException
   * @throws \DomainException
   */
  public function removeVoucher(User $user, int|string $orderIdentifier): Order
  {
    $order = $this->orderRepository->findUserOrder($user, $orderIdentifier);

    if (!$order) {
      throw new ModelNotFoundException('Order not found.');
    }

    if ($order->status !== 'pending') {
      throw new \DomainException('Voucher can only be removed from pending orders.');
    }

    if (!$order->voucher_id) {
      throw new \DomainException('No voucher is currently applied to this order.');
    }

    return $this->orderRepository->removeVoucher($order);
  }
}
