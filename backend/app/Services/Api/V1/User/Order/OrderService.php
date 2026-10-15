<?php

namespace App\Services\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Order\OrderRepositoryInterface;

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
}
