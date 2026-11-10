<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Catalog;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminCatalogRepositoryInterface
{
  /**
   * Get filtered and paginated catalog list.
   *
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @param bool $archiveOnly
   * @return LengthAwarePaginator
   */
  public function getCatalogList(array $filters = [], int $perPage = 10, bool $archiveOnly = false): LengthAwarePaginator;

  /**
   * Get total non-archived products count.
   *
   * @return int
   */
  public function getTotalProductCount(): int;

  /**
   * Find product by ID with all relations loaded.
   *
   * @param int|string $id
   * @return Product|null
   */
  public function findProduct(int|string $id): ?Product;

  /**
   * Store new catalog product and related models.
   *
   * @param array<string, mixed> $data
   * @param mixed $thumbnail
   * @return Product
   */
  public function createProduct(array $data, mixed $thumbnail = null): Product;

  /**
   * Update catalog product and related models.
   *
   * @param Product $product
   * @param array<string, mixed> $data
   * @param mixed $thumbnail
   * @return Product
   */
  public function updateProduct(Product $product, array $data, mixed $thumbnail = null): Product;

  /**
   * Bulk delete products by IDs.
   *
   * @param array<int> $ids
   * @return array{deleted_count: int, deleted_ids: array<int>}
   */
  public function deleteProducts(array $ids): array;

  /**
   * Toggle or set archive status on a product.
   *
   * @param Product $product
   * @return Product
   */
  public function archiveProduct(Product $product): Product;
}

