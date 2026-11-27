<?php

namespace App\Repositories\Api\V1\User\Product;

use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProductRepository implements ProductRepositoryInterface
{
    /**
     * Get paginated list of guest products based on filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getGuestProducts(array $filters, int $perPage = 16): LengthAwarePaginator
    {
        $search = $filters['search'] ?? null;
        $category = $filters['category'] ?? null;
        $launcher = $filters['launcher'] ?? null;
        $priceRange = $filters['price_range'] ?? null;
        $filter = $filters['filter'] ?? null;
        $sortBy = $filters['sort_by'] ?? null;

        return Product::query()
            ->whereNotIn('status', ['archive', 'archived', 'draft'])
            ->whereNull('archived_at')
            ->with(['genreCategories', 'productLauncherCategory'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', '%'.$search.'%');
            })
            ->when($category, function ($query) use ($category) {
                $query->whereHas('genreCategories', function ($query) use ($category) {
                    $query->where('genre_categories.slug', Str::slug($category));
                });
            })
            ->when($launcher, function ($query) use ($launcher) {
                $query->whereHas('productLauncherCategory', function ($query) use ($launcher) {
                    $query->where('slug', Str::slug($launcher))
                        ->orWhere('name', 'like', '%'.$launcher.'%');
                });
            })
            ->when($priceRange, function ($query) use ($priceRange) {
                $parts = explode('-', $priceRange);
                if (count($parts) === 2) {
                    $query->whereBetween('price', [(int) $parts[0], (int) $parts[1]]);
                }
            })
            ->when($filter, function ($query) use ($filter) {
                match ($filter) {
                    'hot_deal' => $query
                        ->whereNotNull('discount_price')
                        ->where('discount_price', '>', 0),

                    'best_seller' => $query
                        ->withCount('orderItems')
                        ->orderByDesc('order_items_count'),

                    'new_release' => $query
                        ->where('status', 'listing')
                        ->orderByDesc('created_at'),

                    'coming_soon' => $query
                        ->where('status', 'pre-order'),

                    default => null,
                };
            })
            ->when($sortBy, function ($query) use ($sortBy) {
                match ($sortBy) {
                    'price_asc' => $query->orderBy('price'),
                    'price_desc' => $query->orderByDesc('price'),
                    'newest', 'latest' => $query->orderByDesc('created_at'),
                    'oldest' => $query->orderBy('created_at'),
                    'a_z' => $query->orderBy('name', 'asc'),
                    'z_a' => $query->orderBy('name', 'desc'),
                    default => $query->latest(),
                };
            }, function ($query) {
                $query->latest();
            })
            ->paginate($perPage);
    }

    /**
     * Find a product by its slug with all detailed relations.
     */
    public function findBySlug(string $slug): ?Product
    {
        return Product::query()
            ->where('slug', $slug)
            ->whereNotIn('status', ['archive', 'archived', 'draft'])
            ->whereNull('archived_at')
            ->with([
                'genreCategories',
                'productLauncherCategory',
                'specificationRequirements',
                'productInstruction',
            ])
            ->withAvg(['reviews' => function ($query) {
                $query->where('status', 'approved');
            }], 'rating')
            ->first();
    }

    /**
     * Check if a user owns a given product directly or via active subscription.
     */
    public function isUserOwnedProduct(User $user, Product $product): bool
    {
        $isDirectlyOwned = $user->ownedGames()
            ->where('products.id', $product->id)
            ->exists();

        if ($isDirectlyOwned) {
            return true;
        }

        if ($product->is_subscription_supported && $user->subscriptions()->where('status', 'active')->where('expired_at', '>', now())->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Get game account credentials for a product.
     */
    public function getGameAccount(Product $product): ?ProductGameAccount
    {
        return $product->gameAccounts()->first();
    }

    /**
     * Get available product filter data.
     *
     * @return array<string, mixed>
     */
    public function getProductFilters(): array
    {
        $categories = GenreCategory::query()->orderBy('id')->get();
        $launchers = ProductLauncherCategory::query()->orderBy('id')->get();
        $maxPrice = Product::max('price');

        return [
            'categories' => $categories,
            'launcher' => $launchers,
            'statuses' => [
                [
                    'label' => 'Active',
                    'value' => true,
                ],
                [
                    'label' => 'Inactive',
                    'value' => false,
                ],
            ],
            'price_range' => [
                'min' => 0,
                'max' => ($maxPrice && $maxPrice > 1500000) ? (int) $maxPrice : 1500000,
            ],
            'sort_options' => [
                [
                    'label' => 'Terbaru',
                    'value' => 'latest',
                ],
                [
                    'label' => 'Terlama',
                    'value' => 'oldest',
                ],
                [
                    'label' => 'Nama A-Z',
                    'value' => 'a_z',
                ],
                [
                    'label' => 'Nama Z-A',
                    'value' => 'z_a',
                ],
            ],
        ];
    }
}
