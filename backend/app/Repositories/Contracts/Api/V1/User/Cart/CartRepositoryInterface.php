<?php

namespace App\Repositories\Contracts\Api\V1\User\Cart;

use App\Models\User;
use App\Models\UserCartItem;
use Illuminate\Support\Collection;

interface CartRepositoryInterface
{
  /**
   * Get all cart products for user with eager loaded relationships.
   *
   * @param User $user
   * @return Collection
   */
  public function getUserCart(User $user): Collection;

  /**
   * Add a product to the user's cart.
   *
   * @param User $user
   * @param int $productId
   * @return UserCartItem
   */
  public function addToCart(User $user, int $productId): UserCartItem;

  /**
   * Remove a product from the user's cart.
   *
   * @param User $user
   * @param int $productId
   * @return bool
   */
  public function removeFromCart(User $user, int $productId): bool;

  /**
   * Check if a product is already in the user's cart.
   *
   * @param User $user
   * @param int $productId
   * @return bool
   */
  public function isInCart(User $user, int $productId): bool;

  /**
   * Remove all items from the user's cart.
   *
   * @param User $user
   * @return int
   */
  public function clearCart(User $user): int;
}
