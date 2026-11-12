<?php

namespace App\Repositories\Api\V1\Admin\Category;

use App\Models\GenreCategory;
use App\Repositories\Contracts\Api\V1\Admin\Category\AdminProductCategoryRepositoryInterface;
use Illuminate\Support\Str;

class AdminProductCategoryRepository implements AdminProductCategoryRepositoryInterface
{
  /**
   * Get list of product categories (root) with sub-categories.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getCategories(array $filters): array
  {
    $query = GenreCategory::whereNull('parent_id')
      ->withCount(['products', 'subCategories'])
      ->with(['subCategories' => function ($q) {
        $q->withCount('products')->orderBy('name', 'asc');
      }]);

    if (!empty($filters['search'])) {
      $searchPattern = '%' . strtolower(trim((string) $filters['search'])) . '%';
      $query->where(function ($q) use ($searchPattern) {
        $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern]);
      });
    }

    $all = $query->orderBy('name', 'asc')->get();

    $items = $all->map(function (GenreCategory $cat) {
      return $this->formatCategory($cat);
    })->values()->all();

    return [
      'total_categories' => count($items),
      'categories'       => $items,
    ];
  }

  /**
   * Get single product category by ID with its sub-categories.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getCategoryById(int $id): array
  {
    $cat = GenreCategory::whereNull('parent_id')
      ->withCount(['products', 'subCategories'])
      ->with(['subCategories' => function ($q) {
        $q->withCount('products')->orderBy('name', 'asc');
      }])
      ->findOrFail($id);

    return $this->formatCategory($cat);
  }

  /**
   * Create a new product root category.
   *
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function createCategory(array $data): array
  {
    $name = trim((string) $data['name']);
    $slug = $this->generateUniqueSlug($name);

    $cat = GenreCategory::create([
      'parent_id'   => null,
      'name'        => $name,
      'slug'        => $slug,
      'description' => $data['description'] ?? null,
    ]);

    return $this->getCategoryById($cat->id);
  }

  /**
   * Update an existing product root category.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function updateCategory(int $id, array $data): array
  {
    $cat = GenreCategory::whereNull('parent_id')->findOrFail($id);

    if (isset($data['name'])) {
      $name = trim((string) $data['name']);
      $cat->name = $name;
      $cat->slug = $this->generateUniqueSlug($name, $id);
    }

    if (array_key_exists('description', $data)) {
      $cat->description = $data['description'];
    }

    $cat->save();

    return $this->getCategoryById($id);
  }

  /**
   * Delete a product category.
   *
   * @param int $id
   * @return void
   */
  public function deleteCategory(int $id): void
  {
    $cat = GenreCategory::whereNull('parent_id')->findOrFail($id);
    $cat->subCategories()->delete();
    $cat->products()->detach();
    $cat->delete();
  }

  /**
   * Get list of product sub-categories (with parent category details).
   *
   * @param array<string, mixed> $filters
   * @param int|null $categoryId
   * @return array<string, mixed>
   */
  public function getSubCategories(array $filters, ?int $categoryId = null): array
  {
    $query = GenreCategory::whereNotNull('parent_id')
      ->with('parent')
      ->withCount('products');

    $targetCategoryId = $categoryId ?? ($filters['category_id'] ?? null);
    if (!empty($targetCategoryId)) {
      $query->where('parent_id', (int) $targetCategoryId);
    }

    if (!empty($filters['search'])) {
      $searchPattern = '%' . strtolower(trim((string) $filters['search'])) . '%';
      $query->where(function ($q) use ($searchPattern) {
        $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern]);
      });
    }

    $all = $query->orderBy('name', 'asc')->get();

    $items = $all->map(function (GenreCategory $sub) {
      return $this->formatSubCategory($sub);
    })->values()->all();

    return [
      'total_sub_categories' => count($items),
      'sub_categories'       => $items,
    ];
  }

  /**
   * Get single product sub-category by ID.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getSubCategoryById(int $id): array
  {
    $sub = GenreCategory::whereNotNull('parent_id')
      ->with('parent')
      ->withCount('products')
      ->findOrFail($id);

    return $this->formatSubCategory($sub);
  }

  /**
   * Create a new product sub-category.
   *
   * @param array<string, mixed> $data
   * @param int|null $categoryId
   * @return array<string, mixed>
   */
  public function createSubCategory(array $data, ?int $categoryId = null): array
  {
    $parentId = $categoryId ?? ($data['category_id'] ?? null);
    if (!$parentId) {
      throw new \InvalidArgumentException('Category ID is required for creating a sub-category.');
    }

    // Verify parent exists
    GenreCategory::whereNull('parent_id')->findOrFail((int) $parentId);

    $name = trim((string) $data['name']);
    $slug = $this->generateUniqueSlug($name);

    $sub = GenreCategory::create([
      'parent_id'   => (int) $parentId,
      'name'        => $name,
      'slug'        => $slug,
      'description' => $data['description'] ?? null,
    ]);

    return $this->getSubCategoryById($sub->id);
  }

  /**
   * Update an existing product sub-category.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function updateSubCategory(int $id, array $data): array
  {
    $sub = GenreCategory::whereNotNull('parent_id')->findOrFail($id);

    if (isset($data['category_id'])) {
      GenreCategory::whereNull('parent_id')->findOrFail((int) $data['category_id']);
      $sub->parent_id = (int) $data['category_id'];
    }

    if (isset($data['name'])) {
      $name = trim((string) $data['name']);
      $sub->name = $name;
      $sub->slug = $this->generateUniqueSlug($name, $id);
    }

    if (array_key_exists('description', $data)) {
      $sub->description = $data['description'];
    }

    $sub->save();

    return $this->getSubCategoryById($id);
  }

  /**
   * Delete a product sub-category.
   *
   * @param int $id
   * @return void
   */
  public function deleteSubCategory(int $id): void
  {
    $sub = GenreCategory::whereNotNull('parent_id')->findOrFail($id);
    $sub->products()->detach();
    $sub->delete();
  }

  /**
   * Format Category object into array.
   *
   * @param GenreCategory $cat
   * @return array<string, mixed>
   */
  protected function formatCategory(GenreCategory $cat): array
  {
    return [
      'id'                   => $cat->id,
      'name'                 => $cat->name,
      'slug'                 => $cat->slug,
      'description'          => $cat->description,
      'total_products'       => (int) ($cat->products_count ?? $cat->products()->count()),
      'total_sub_categories' => (int) ($cat->sub_categories_count ?? $cat->subCategories()->count()),
      'sub_categories'       => $cat->subCategories->map(function ($sub) use ($cat) {
        return [
          'id'             => $sub->id,
          'category_id'    => $cat->id,
          'name'           => $sub->name,
          'slug'           => $sub->slug,
          'description'    => $sub->description,
          'total_products' => (int) ($sub->products_count ?? $sub->products()->count()),
          'created_at'     => $sub->created_at?->toISOString(),
          'updated_at'     => $sub->updated_at?->toISOString(),
        ];
      })->values()->all(),
      'created_at'           => $cat->created_at?->toISOString(),
      'updated_at'           => $cat->updated_at?->toISOString(),
    ];
  }

  /**
   * Format SubCategory object into array.
   *
   * @param GenreCategory $sub
   * @return array<string, mixed>
   */
  protected function formatSubCategory(GenreCategory $sub): array
  {
    return [
      'id'             => $sub->id,
      'category_id'    => (int) $sub->parent_id,
      'category_name'  => $sub->parent?->name,
      'name'           => $sub->name,
      'slug'           => $sub->slug,
      'description'    => $sub->description,
      'total_products' => (int) ($sub->products_count ?? $sub->products()->count()),
      'created_at'     => $sub->created_at?->toISOString(),
      'updated_at'     => $sub->updated_at?->toISOString(),
    ];
  }

  /**
   * Generate unique slug for GenreCategory.
   *
   * @param string $name
   * @param int|null $ignoreId
   * @return string
   */
  protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
  {
    $baseSlug = Str::slug($name);
    if ($baseSlug === '') {
      $baseSlug = 'category';
    }

    $slug = $baseSlug;
    $counter = 1;

    while (GenreCategory::where('slug', $slug)
      ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
      ->exists()) {
      $slug = $baseSlug . '-' . $counter++;
    }

    return $slug;
  }
}

