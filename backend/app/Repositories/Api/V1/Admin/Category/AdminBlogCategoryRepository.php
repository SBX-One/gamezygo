<?php

namespace App\Repositories\Api\V1\Admin\Category;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Repositories\Contracts\Api\V1\Admin\Category\AdminBlogCategoryRepositoryInterface;
use Illuminate\Support\Str;

class AdminBlogCategoryRepository implements AdminBlogCategoryRepositoryInterface
{
    /**
     * Get list of blog categories (root) with sub-categories.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getCategories(array $filters): array
    {
        $query = BlogCategory::whereNull('parent_id')
            ->withCount(['blogs', 'subCategories'])
            ->with(['subCategories' => function ($q) {
                $q->withCount('blogs')->orderBy('name', 'asc');
            }]);

        if (! empty($filters['search'])) {
            $searchPattern = '%'.strtolower(trim((string) $filters['search'])).'%';
            $query->where(function ($q) use ($searchPattern) {
                $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern]);
            });
        }

        $all = $query->orderBy('name', 'asc')->get();

        $items = $all->map(function (BlogCategory $cat) {
            return $this->formatCategory($cat);
        })->values()->all();

        return [
            'total_categories' => count($items),
            'categories' => $items,
        ];
    }

    /**
     * Get single blog category by ID with its sub-categories.
     *
     * @return array<string, mixed>
     */
    public function getCategoryById(int $id): array
    {
        $cat = BlogCategory::whereNull('parent_id')
            ->withCount(['blogs', 'subCategories'])
            ->with(['subCategories' => function ($q) {
                $q->withCount('blogs')->orderBy('name', 'asc');
            }])
            ->findOrFail($id);

        return $this->formatCategory($cat);
    }

    /**
     * Create a new blog root category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createCategory(array $data): array
    {
        $name = trim((string) $data['name']);
        $slug = $this->generateUniqueSlug($name);

        $cat = BlogCategory::create([
            'parent_id' => null,
            'name' => $name,
            'slug' => $slug,
            'description' => $data['description'] ?? null,
        ]);

        return $this->getCategoryById($cat->id);
    }

    /**
     * Update an existing blog root category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateCategory(int $id, array $data): array
    {
        $cat = BlogCategory::whereNull('parent_id')->findOrFail($id);

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
     * Delete a blog category.
     */
    public function deleteCategory(int $id): void
    {
        $cat = BlogCategory::whereNull('parent_id')->findOrFail($id);
        $cat->subCategories()->delete();
        // Nullify blogs using this category
        Blog::where('blog_category_id', $id)->update(['blog_category_id' => null]);
        $cat->delete();
    }

    /**
     * Get list of blog sub-categories (with parent category details).
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getSubCategories(array $filters, ?int $categoryId = null): array
    {
        $query = BlogCategory::whereNotNull('parent_id')
            ->with('parent')
            ->withCount('blogs');

        $targetCategoryId = $categoryId ?? ($filters['category_id'] ?? null);
        if (! empty($targetCategoryId)) {
            $query->where('parent_id', (int) $targetCategoryId);
        }

        if (! empty($filters['search'])) {
            $searchPattern = '%'.strtolower(trim((string) $filters['search'])).'%';
            $query->where(function ($q) use ($searchPattern) {
                $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern]);
            });
        }

        $all = $query->orderBy('name', 'asc')->get();

        $items = $all->map(function (BlogCategory $sub) {
            return $this->formatSubCategory($sub);
        })->values()->all();

        return [
            'total_sub_categories' => count($items),
            'sub_categories' => $items,
        ];
    }

    /**
     * Get single blog sub-category by ID.
     *
     * @return array<string, mixed>
     */
    public function getSubCategoryById(int $id): array
    {
        $sub = BlogCategory::whereNotNull('parent_id')
            ->with('parent')
            ->withCount('blogs')
            ->findOrFail($id);

        return $this->formatSubCategory($sub);
    }

    /**
     * Create a new blog sub-category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createSubCategory(array $data, ?int $categoryId = null): array
    {
        $parentId = $categoryId ?? ($data['category_id'] ?? null);
        if (! $parentId) {
            throw new \InvalidArgumentException('Category ID is required for creating a sub-category.');
        }

        // Verify parent exists
        BlogCategory::whereNull('parent_id')->findOrFail((int) $parentId);

        $name = trim((string) $data['name']);
        $slug = $this->generateUniqueSlug($name);

        $sub = BlogCategory::create([
            'parent_id' => (int) $parentId,
            'name' => $name,
            'slug' => $slug,
            'description' => $data['description'] ?? null,
        ]);

        return $this->getSubCategoryById($sub->id);
    }

    /**
     * Update an existing blog sub-category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateSubCategory(int $id, array $data): array
    {
        $sub = BlogCategory::whereNotNull('parent_id')->findOrFail($id);

        if (isset($data['category_id'])) {
            BlogCategory::whereNull('parent_id')->findOrFail((int) $data['category_id']);
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
     * Delete a blog sub-category.
     */
    public function deleteSubCategory(int $id): void
    {
        $sub = BlogCategory::whereNotNull('parent_id')->findOrFail($id);
        // Nullify blogs using this subcategory
        Blog::where('blog_sub_category_id', $id)->update(['blog_sub_category_id' => null]);
        $sub->delete();
    }

    /**
     * Format Category object into array.
     *
     * @return array<string, mixed>
     */
    protected function formatCategory(BlogCategory $cat): array
    {
        return [
            'id' => $cat->id,
            'name' => $cat->name,
            'slug' => $cat->slug,
            'description' => $cat->description,
            'total_blogs' => (int) ($cat->blogs_count ?? $cat->blogs()->count()),
            'total_sub_categories' => (int) ($cat->sub_categories_count ?? $cat->subCategories()->count()),
            'sub_categories' => $cat->subCategories->map(function ($sub) use ($cat) {
                return [
                    'id' => $sub->id,
                    'category_id' => $cat->id,
                    'name' => $sub->name,
                    'slug' => $sub->slug,
                    'description' => $sub->description,
                    'total_blogs' => (int) ($sub->blogs_count ?? $sub->blogs()->count()),
                    'created_at' => $sub->created_at?->toISOString(),
                    'updated_at' => $sub->updated_at?->toISOString(),
                ];
            })->values()->all(),
            'created_at' => $cat->created_at?->toISOString(),
            'updated_at' => $cat->updated_at?->toISOString(),
        ];
    }

    /**
     * Format SubCategory object into array.
     *
     * @return array<string, mixed>
     */
    protected function formatSubCategory(BlogCategory $sub): array
    {
        return [
            'id' => $sub->id,
            'category_id' => (int) $sub->parent_id,
            'category_name' => $sub->parent?->name,
            'name' => $sub->name,
            'slug' => $sub->slug,
            'description' => $sub->description,
            'total_blogs' => (int) ($sub->blogs_count ?? $sub->blogs()->count()),
            'created_at' => $sub->created_at?->toISOString(),
            'updated_at' => $sub->updated_at?->toISOString(),
        ];
    }

    /**
     * Generate unique slug for BlogCategory.
     */
    protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        if ($baseSlug === '') {
            $baseSlug = 'category';
        }

        $slug = $baseSlug;
        $counter = 1;

        while (BlogCategory::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $baseSlug.'-'.$counter++;
        }

        return $slug;
    }
}
