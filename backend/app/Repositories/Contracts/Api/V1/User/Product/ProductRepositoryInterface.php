<?php

namespace App\Repositories\Contracts\Api\V1\User\Product;

use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    /**
     * Get paginated list of guest products based on filters.
     *
     * @param array<string, mixed> $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getGuestProducts(array $filters, int $perPage = 16): LengthAwarePaginator;

    /**
     * Find a product by its slug with all detailed relations.
     *
     * @param string $slug
     * @return Product|null
     */
    public function findBySlug(string $slug): ?Product;

    /**
     * Check if a user owns a given product directly or via active subscription.
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function isUserOwnedProduct(User $user, Product $product): bool;

    /**
     * Get game account credentials for a product.
     *
     * @param Product $product
     * @return ProductGameAccount|null
     */
    public function getGameAccount(Product $product): ?ProductGameAccount;
}
