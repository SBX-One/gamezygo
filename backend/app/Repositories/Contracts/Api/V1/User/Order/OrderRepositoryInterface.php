<?php

namespace App\Repositories\Contracts\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Voucher;

interface OrderRepositoryInterface
{
  /**
   * Create a new pending order for a product.
   *
   * @param User $user
   * @param Product $product
   * @return Order
   */
  public function createOrderForProduct(User $user, Product $product): Order;

  /**
   * Find an order belonging to a user by ID or order code.
   *
   * @param User $user
   * @param int|string $orderIdentifier
   * @return Order|null
   */
  public function findUserOrder(User $user, int|string $orderIdentifier): ?Order;

  /**
   * Find an active voucher by its code.
   *
   * @param string $code
   * @return Voucher|null
   */
  public function findVoucherByCode(string $code): ?Voucher;

  /**
   * Apply a voucher to an order and update calculated totals.
   *
   * @param Order $order
   * @param Voucher $voucher
   * @param int $discountAmount
   * @return Order
   */
  public function applyVoucher(Order $order, Voucher $voucher, int $discountAmount): Order;

  /**
   * Remove voucher from an order and reset discount and total.
   *
   * @param Order $order
   * @return Order
   */
  public function removeVoucher(Order $order): Order;
}
