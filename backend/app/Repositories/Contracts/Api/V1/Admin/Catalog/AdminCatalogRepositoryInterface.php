<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Catalog;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminCatalogRepositoryInterface
{
    /**
     * Get filtered and paginated catalog list.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getCatalogList(array $filters = [], int $perPage = 10, bool $archiveOnly = false): LengthAwarePaginator;

    /**
     * Get total non-archived products count.
     */
    public function getTotalProductCount(): int;

    /**
     * Find product by ID with all relations loaded.
     */
    public function findProduct(int|string $id): ?Product;

    /**
     * Store new catalog product and related models.
     *
     * @param  array<string, mixed>  $data
     */
    public function createProduct(array $data, mixed $thumbnail = null): Product;

    /**
     * Update catalog product and related models.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProduct(Product $product, array $data, mixed $thumbnail = null): Product;

    /**
     * Bulk delete products by IDs.
     *
     * @param  array<int>  $ids
     * @return array{deleted_count: int, deleted_ids: array<int>}
     */
    public function deleteProducts(array $ids): array;

    /**
     * Toggle or set archive status on a product.
     */
    public function archiveProduct(Product $product): Product;
}
