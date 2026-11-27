<?php

namespace App\Services\Api\V1\User\Cart;

use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Cart\CartRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CartService
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository
    ) {}

    /**
     * Get calculated cart summary for a user.
     */
    public function getCartSummary(User $user): array
    {
        $rawItems = $this->cartRepository->getUserCart($user);

        // Auto-prune archived or draft items from cart
        $archivedItemIds = $rawItems->filter(function ($item) {
            return in_array($item->status, ['archive', 'archived', 'draft'], true) || ! empty($item->archived_at);
        })->pluck('id')->all();

        if (! empty($archivedItemIds)) {
            foreach ($archivedItemIds as $archivedId) {
                $this->cartRepository->removeFromCart($user, $archivedId);
            }
            $items = $rawItems->reject(function ($item) use ($archivedItemIds) {
                return in_array($item->id, $archivedItemIds, true);
            })->values();
        } else {
            $items = $rawItems;
        }

        $subtotalPrice = 0;
        $totalPrice = 0;

        foreach ($items as $item) {
            $originalPrice = (int) $item->price;
            $effectivePrice = $item->discount_price > 0 && $item->discount_price < $item->price
              ? (int) $item->discount_price
              : $originalPrice;

            $subtotalPrice += $originalPrice;
            $totalPrice += $effectivePrice;
        }

        $discountAmount = max(0, $subtotalPrice - $totalPrice);

        return [
            'items' => $items,
            'total_items' => $items->count(),
            'subtotal_price' => $subtotalPrice,
            'discount_amount' => $discountAmount,
            'total_price' => $totalPrice,
            'total_prices' => $totalPrice,
        ];
    }

    /**
     * Add a product to user's cart.
     *
     * @throws ModelNotFoundException
     * @throws DomainException
     */
    public function addItemToCart(User $user, int|string|null $productId = null, ?string $productSlug = null): array
    {
        $product = $this->resolveProduct($productId, $productSlug);

        if (! $product) {
            throw new ModelNotFoundException('Product not found');
        }

        if (in_array($product->status, ['archive', 'archived', 'draft'], true) || ! empty($product->archived_at)) {
            throw new DomainException('Product is currently unavailable or archived.');
        }

        if ($user->ownedGames()->where('products.id', $product->id)->exists()) {
            throw new DomainException('You already own this game');
        }

        if ($this->cartRepository->isInCart($user, $product->id)) {
            throw new DomainException('Product is already in your cart');
        }

        $cartItem = $this->cartRepository->addToCart($user, $product->id);

        return [
            'cart_item' => $cartItem,
            'product' => $product,
        ];
    }

    /**
     * Remove a product from user's cart.
     *
     * @throws ModelNotFoundException
     */
    public function removeItemFromCart(User $user, int|string|null $productId = null, ?string $productSlug = null): array
    {
        $product = $this->resolveProduct($productId, $productSlug);

        if (! $product || ! $this->cartRepository->isInCart($user, $product->id)) {
            throw new ModelNotFoundException('Product not found in cart');
        }

        $this->cartRepository->removeFromCart($user, $product->id);

        return $this->getCartSummary($user);
    }

    /**
     * Remove all items from user's cart.
     */
    public function clearUserCart(User $user): array
    {
        $this->cartRepository->clearCart($user);

        return $this->getCartSummary($user);
    }

    /**
     * Resolve product by ID or slug.
     */
    protected function resolveProduct(int|string|null $productId = null, ?string $productSlug = null): ?Product
    {
        if (! empty($productId)) {
            if (is_numeric($productId)) {
                return Product::find((int) $productId);
            }

            return Product::where('slug', $productId)->first();
        }

        if (! empty($productSlug)) {
            return Product::where('slug', $productSlug)->first();
        }

        return null;
    }
}
