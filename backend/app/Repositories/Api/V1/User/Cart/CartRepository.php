<?php

namespace App\Repositories\Api\V1\User\Cart;

use App\Models\User;
use App\Models\UserCartItem;
use App\Repositories\Contracts\Api\V1\User\Cart\CartRepositoryInterface;
use Illuminate\Support\Collection;

class CartRepository implements CartRepositoryInterface
{
    /**
     * Get all cart products for user with eager loaded relationships.
     */
    public function getUserCart(User $user): Collection
    {
        return $user->cartItems()
            ->with(['genreCategories', 'files'])
            ->orderBy('user_cart_items.created_at', 'desc')
            ->get();
    }

    /**
     * Add a product to the user's cart.
     */
    public function addToCart(User $user, int $productId): UserCartItem
    {
        return UserCartItem::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);
    }

    /**
     * Remove a product from the user's cart.
     */
    public function removeFromCart(User $user, int $productId): bool
    {
        return (bool) UserCartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();
    }

    /**
     * Check if a product is already in the user's cart.
     */
    public function isInCart(User $user, int $productId): bool
    {
        return UserCartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();
    }

    /**
     * Remove all items from the user's cart.
     */
    public function clearCart(User $user): int
    {
        return UserCartItem::where('user_id', $user->id)->delete();
    }
}
