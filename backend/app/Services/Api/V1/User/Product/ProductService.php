<?php

namespace App\Services\Api\V1\User\Product;

use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
        protected RedisCacheService $cacheService
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
        $page = request()->get('page', 1);
        $cacheKey = 'products:guest:list:' . md5(json_encode($filters) . ":page:{$page}");

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_MEDIUM,
            fn () => $this->productRepository->getGuestProducts($filters),
            [RedisCacheService::TAG_PRODUCTS]
        );
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
        $cacheKey = "products:detail:{$slug}";

        $product = $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_LONG,
            fn () => $this->productRepository->findBySlug($slug),
            [RedisCacheService::TAG_PRODUCTS]
        );

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
    public function getProductCredentials(User $user, string $slug): object
    {
        $product = $this->productRepository->findBySlug($slug);

        if (!$product) {
            throw new ModelNotFoundException('Product not found');
        }

        if (!$this->productRepository->isUserOwnedProduct($user, $product)) {
            throw new AuthorizationException('You do not own this game');
        }

        // Data Isolation Shield: First check GameCredential allocated specifically to this user
        $credential = \App\Models\GameCredential::where('product_id', $product->id)
            ->where('assigned_to_user_id', $user->id)
            ->where('status', \App\Models\GameCredential::STATUS_SOLD)
            ->first();

        if ($credential) {
            return $credential;
        }

        $gameAccount = $this->productRepository->getGameAccount($product);

        if (!$gameAccount) {
            throw new ModelNotFoundException('Game credentials not available for this product');
        }

        return $gameAccount;
    }

    /**
     * Retrieve available product filters including categories, launchers, statuses, price range, and sort options.
     *
     * @return array<string, mixed>
     */
    public function getProductFilters(): array
    {
        return $this->cacheService->remember(
            'products:filters',
            RedisCacheService::TTL_EXTENDED,
            fn () => $this->productRepository->getProductFilters(),
            [RedisCacheService::TAG_PRODUCTS]
        );
    }
}
