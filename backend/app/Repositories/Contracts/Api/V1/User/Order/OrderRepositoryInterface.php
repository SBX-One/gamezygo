<?php

namespace App\Repositories\Contracts\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

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
}
