<?php

namespace App\Services\Api\V1\Admin\Catalog;

use App\Models\Product;
use App\Repositories\Contracts\Api\V1\Admin\Catalog\AdminCatalogRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class AdminCatalogService
{
    public function __construct(
        protected AdminCatalogRepositoryInterface $catalogRepository,
        protected SteamService $steamService
    ) {}

    /**
     * Fetch game details from Steam URL for auto-filling catalog form.
     *
     * @return array<string, mixed>|null
     */
    public function fetchSteamData(string $steamUrl): ?array
    {
        return $this->steamService->fetchGameData($steamUrl);
    }

    /**
     * Get paginated catalog list with metadata.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getCatalog(array $filters = [], int $perPage = 10, bool $archiveOnly = false): array
    {
        $paginator = $this->catalogRepository->getCatalogList($filters, $perPage, $archiveOnly);
        $totalCount = $this->catalogRepository->getTotalProductCount();

        return [
            'paginator' => $paginator,
            'total_products' => $totalCount,
        ];
    }

    /**
     * Get single product by ID.
     *
     * @throws ModelNotFoundException
     */
    public function getProduct(int|string $id): Product
    {
        $product = $this->catalogRepository->findProduct($id);

        if (! $product) {
            throw new ModelNotFoundException("Product with ID {$id} not found.");
        }

        return $product;
    }

    /**
     * Store new catalog product.
     *
     * @param  array<string, mixed>  $data
     */
    public function storeProduct(array $data, mixed $thumbnail = null): Product
    {
        $data = $this->enrichWithSteamData($data, $thumbnail);

        if (($data['status'] ?? '') === 'published') {
            if (empty($data['specifications']['minimum']) || empty($data['specifications']['recommended'])) {
                throw ValidationException::withMessages([
                    'specifications.minimum' => 'Minimum specifications are required to publish the product.',
                ]);
            }
            if (empty($thumbnail)) {
                throw ValidationException::withMessages([
                    'thumbnail' => 'Thumbnail is required to publish the product.',
                ]);
            }
        }

        return $this->catalogRepository->createProduct($data, $thumbnail);
    }

    /**
     * Update catalog product.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ModelNotFoundException
     */
    public function updateProduct(int|string $id, array $data, mixed $thumbnail = null): Product
    {
        $product = $this->getProduct($id);
        $data = $this->enrichWithSteamData($data, $thumbnail);

        return $this->catalogRepository->updateProduct($product, $data, $thumbnail);
    }

    /**
     * Enrich product attributes with Steam data if steam_url is provided.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function enrichWithSteamData(array $data, mixed &$thumbnail = null): array
    {
        if (empty($data['steam_url'])) {
            return $data;
        }

        $steamData = $this->steamService->fetchGameData($data['steam_url']);
        if (! $steamData) {
            return $data;
        }

        if (empty($data['name']) && ! empty($steamData['name'])) {
            $data['name'] = $steamData['name'];
        }

        if (empty($data['description']) && ! empty($steamData['description'])) {
            $data['description'] = $steamData['description'];
        }

        if ((empty($data['price']) || $data['price'] == 0) && ! empty($steamData['price'])) {
            $data['price'] = $steamData['price'];
        }

        if (empty($data['original_price']) && ! empty($steamData['original_price'])) {
            $data['original_price'] = $steamData['original_price'];
        }

        if (empty($data['category_ids']) && ! empty($steamData['category_ids'])) {
            $data['category_ids'] = $steamData['category_ids'];
        }

        if (empty($data['launcher_ids']) && ! empty($steamData['launcher_ids'])) {
            $data['launcher_ids'] = $steamData['launcher_ids'];
        }

        if (empty($data['specifications']) && ! empty($steamData['specifications'])) {
            $data['specifications'] = $steamData['specifications'];
        }

        if (empty($thumbnail) && ! empty($steamData['image_url'])) {
            $thumbnail = $steamData['image_url'];
        }

        return $data;
    }

    /**
     * Bulk delete products.
     *
     * @param  array<int>  $ids
     * @return array{deleted_count: int, deleted_ids: array<int>}
     */
    public function deleteProducts(array $ids): array
    {
        return $this->catalogRepository->deleteProducts($ids);
    }

    /**
     * Archive or unarchive a product.
     *
     * @throws ModelNotFoundException
     */
    public function archiveProduct(int|string $id): Product
    {
        $product = $this->getProduct($id);

        return $this->catalogRepository->archiveProduct($product);
    }
}
