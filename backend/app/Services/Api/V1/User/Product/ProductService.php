<?php

namespace App\Services\Api\V1\User\Product;

use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
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

    /**
     * Fetch game credentials for a product owned by user.
     *
     * @param User $user
     * @param string $slug
     * @return ProductGameAccount
     * @throws ModelNotFoundException
     * @throws AuthorizationException
     */
    public function getProductCredentials(User $user, string $slug): ProductGameAccount
    {
        $product = $this->productRepository->findBySlug($slug);

        if (!$product) {
            throw new ModelNotFoundException('Product not found');
        }

        if (!$this->productRepository->isUserOwnedProduct($user, $product)) {
            throw new AuthorizationException('You do not own this game');
        }

        $gameAccount = $this->productRepository->getGameAccount($product);

        if (!$gameAccount) {
            throw new ModelNotFoundException('Game credentials not available for this product');
        }

        return $gameAccount;
    }
}
