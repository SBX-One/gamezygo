<?php

namespace App\Repositories\Api\V1\Admin\CustomSection;

use App\Models\CustomSection;
use App\Models\Product;
use App\Repositories\Contracts\Api\V1\Admin\CustomSection\AdminCustomSectionRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminCustomSectionRepository implements AdminCustomSectionRepositoryInterface
{
    /**
     * Get all custom sections with their products.
     */
    public function getSections(): Collection
    {
        $sections = CustomSection::with([
            'products' => function ($q) {
                $q->with('genreCategories')
                    ->orderBy('custom_section_products.order_number', 'asc');
            },
        ])
            ->orderBy('order_number', 'asc')
            ->get();

        return $sections->map(function ($section) {
            $productsData = $section->products->map(function ($product) {
                $sellingPrice = $product->discount_price > 0 ? (int) $product->discount_price : (int) $product->price;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'thumbnail' => $product->thumbnail ?? 'https://placehold.co/600x400',
                    'price' => (int) $product->price,
                    'discount_price' => $sellingPrice,
                    'discount' => (int) $product->discount,
                    'sort_order' => (int) ($product->pivot->order_number ?? 0),
                    'categories' => $product->genreCategories->map(function ($cat) {
                        return [
                            'id' => $cat->id,
                            'name' => $cat->name,
                            'slug' => $cat->slug,
                        ];
                    })->values()->all(),
                ];
            })->values()->all();

            return [
                'id' => $section->id,
                'title' => $section->title,
                'slug' => $section->slug,
                'display_type' => $section->display_type,
                'auto_rule' => $section->auto_rule,
                'order_number' => (int) $section->order_number,
                'is_active' => (bool) $section->is_active,
                'total_products' => count($productsData),
                'custom_section_products' => $productsData,
            ];
        });
    }

    /**
     * Create a new custom section.
     *
     * @param  array<string, mixed>  $data
     */
    public function createSection(array $data): CustomSection
    {
        $title = trim((string) ($data['name'] ?? ($data['title'] ?? 'New Section')));
        $slug = Str::slug($title);

        if (CustomSection::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::lower(Str::random(5));
        }

        $nextOrder = (int) (CustomSection::max('order_number') ?? 0) + 1;

        return CustomSection::create([
            'title' => $title,
            'slug' => $slug,
            'order_number' => $nextOrder,
            'is_active' => true,
            'display_type' => 'manual',
        ]);
    }

    /**
     * Update an existing custom section.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateSection(int $id, array $data): CustomSection
    {
        $section = CustomSection::withCount('products')->findOrFail($id);

        if (isset($data['name']) || isset($data['title'])) {
            $section->title = trim((string) ($data['name'] ?? $data['title']));
        }

        if (isset($data['is_active'])) {
            $section->is_active = (bool) $data['is_active'];
        }

        $section->save();

        return $section;
    }

    /**
     * Delete a custom section.
     */
    public function deleteSection(int $id): bool
    {
        $section = CustomSection::findOrFail($id);
        $section->products()->detach();

        return (bool) $section->delete();
    }

    /**
     * Reorder custom sections.
     *
     * @param  array<int>  $sectionIds
     * @return array<int, array{id: int, sort_order: int}>
     */
    public function sortSections(array $sectionIds): array
    {
        $result = [];

        foreach ($sectionIds as $index => $sectionId) {
            $sortOrder = $index + 1;

            CustomSection::where('id', $sectionId)->update([
                'order_number' => $sortOrder,
            ]);

            $result[] = [
                'id' => (int) $sectionId,
                'sort_order' => $sortOrder,
            ];
        }

        return $result;
    }

    /**
     * Get filtered products list for section selection.
     *
     * @param  array<string, mixed>  $filters
     * @return array<int, array<string, mixed>>
     */
    public function getAllProducts(array $filters): array
    {
        $query = Product::query()
            ->with('genreCategories')
            ->where('status', '!=', 'archive');

        // Filter by active status
        if (isset($filters['is_active'])) {
            $isActive = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($isActive === true) {
                $query->whereNotIn('status', ['archive', 'draft']);
            } elseif ($isActive === false) {
                $query->whereIn('status', ['draft', 'archive']);
            }
        }

        // Filter by category IDs
        if (! empty($filters['category_ids']) && is_array($filters['category_ids'])) {
            $categoryIds = array_map('intval', $filters['category_ids']);
            $query->whereHas('genreCategories', function ($q) use ($categoryIds) {
                $q->whereIn('genre_categories.id', $categoryIds);
            });
        }

        // Filter by min price
        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $minPrice = (int) $filters['min_price'];
            $query->where('price', '>=', $minPrice);
        }

        // Filter by max price
        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $maxPrice = (int) $filters['max_price'];
            $query->where('price', '<=', $maxPrice);
        }

        // Keyword search
        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $searchPattern = '%'.strtolower($search).'%';
            $query->where(function ($q) use ($searchPattern) {
                $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(description) LIKE ?', [$searchPattern]);
            });
        }

        // Sort order
        $sortBy = $filters['sort_by'] ?? 'latest';
        match ($sortBy) {
            'oldest' => $query->orderBy('id', 'asc'),
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            default => $query->orderBy('id', 'desc'),
        };

        $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
        $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        return $paginator->getCollection()->map(function ($product) {
            $price = $product->discount_price > 0 ? (int) $product->discount_price : (int) $product->price;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image_url' => $product->thumbnail ?? 'https://placehold.co/100x100',
                'categories' => $product->genreCategories->map(function ($cat) {
                    return [
                        'id' => $cat->id,
                        'name' => $cat->name,
                    ];
                })->values()->all(),
                'price' => $price,
            ];
        })->values()->all();
    }

    /**
     * Add products to a section.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function addProductsToSection(int $sectionId, array $productIds): array
    {
        $section = CustomSection::findOrFail($sectionId);

        $currentMaxOrder = (int) (DB::table('custom_section_products')
            ->where('custom_section_id', $section->id)
            ->max('order_number') ?? 0);

        $addedProducts = [];

        foreach ($productIds as $productId) {
            $exists = DB::table('custom_section_products')
                ->where('custom_section_id', $section->id)
                ->where('product_id', $productId)
                ->exists();

            if (! $exists) {
                $currentMaxOrder++;

                DB::table('custom_section_products')->insert([
                    'custom_section_id' => $section->id,
                    'product_id' => $productId,
                    'order_number' => $currentMaxOrder,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $product = Product::find($productId);

                $addedProducts[] = [
                    'id' => (int) $productId,
                    'name' => $product?->name ?? "Product #{$productId}",
                    'sort_order' => $currentMaxOrder,
                ];
            }
        }

        $totalProducts = DB::table('custom_section_products')
            ->where('custom_section_id', $section->id)
            ->count();

        return [
            'section_id' => (int) $section->id,
            'total_products' => (int) $totalProducts,
            'added_products' => $addedProducts,
        ];
    }

    /**
     * Remove a single product from a section.
     *
     * @return array<string, mixed>
     */
    public function removeProductFromSection(int $sectionId, int $productId): array
    {
        $section = CustomSection::findOrFail($sectionId);
        $section->products()->detach($productId);

        $totalProducts = DB::table('custom_section_products')
            ->where('custom_section_id', $section->id)
            ->count();

        return [
            'section_id' => (int) $section->id,
            'product_id' => (int) $productId,
            'total_products' => (int) $totalProducts,
        ];
    }

    /**
     * Clear all products from a section.
     *
     * @return array<string, mixed>
     */
    public function clearProductsFromSection(int $sectionId): array
    {
        $section = CustomSection::findOrFail($sectionId);
        $section->products()->detach();

        return [
            'section_id' => (int) $section->id,
            'total_products' => 0,
            'products' => [],
        ];
    }

    /**
     * Reorder products within a section.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function sortProductsInSection(int $sectionId, array $productIds): array
    {
        $section = CustomSection::findOrFail($sectionId);
        $products = [];

        foreach ($productIds as $index => $productId) {
            $sortOrder = $index + 1;

            DB::table('custom_section_products')
                ->where('custom_section_id', $section->id)
                ->where('product_id', $productId)
                ->update([
                    'order_number' => $sortOrder,
                ]);

            $products[] = [
                'id' => (int) $productId,
                'sort_order' => $sortOrder,
            ];
        }

        return [
            'section_id' => (int) $section->id,
            'products' => $products,
        ];
    }
}
