<?php

namespace App\Repositories\Contracts\Api\V1\User\Product;

use App\Models\Product;
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
}
