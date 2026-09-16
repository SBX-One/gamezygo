<?php

namespace App\Services\Api\V1\User\Product;

use App\Models\Product;
use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {
    }

    /**
     * Fetch products for guest view with filters and pagination.
     *
     * @param array<string, mixed> $filters
     * @return LengthAwarePaginator
     */
    public function getGuestProducts(array $filters): LengthAwarePaginator
    {
        return $this->productRepository->getGuestProducts($filters);
    }

    /**
     * Fetch product detail by slug.
     *
     * @param string $slug
     * @return Product
     * @throws ModelNotFoundException
     */
    public function getProductDetail(string $slug): Product
    {
        $product = $this->productRepository->findBySlug($slug);

        if (!$product) {
            throw new ModelNotFoundException('Product not found');
        }

        return $product;
    }
}
