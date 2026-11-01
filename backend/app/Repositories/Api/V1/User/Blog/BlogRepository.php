<?php

namespace App\Repositories\Api\V1\User\Blog;

use App\Models\Blog;
use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BlogRepository implements BlogRepositoryInterface
{
    /**
     * Get paginated published blogs with category and optional filters.
     *
     * @param array<string, mixed> $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPublishedBlogs(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $search        = isset($filters['search']) ? trim((string) $filters['search']) : null;
        $rawCategories = $filters['categories'] ?? null;

        $categoryList = [];
        if (is_array($rawCategories)) {
            $categoryList = array_filter($rawCategories, fn ($cat) => !empty(trim((string) $cat)));
        } elseif (is_string($rawCategories) && trim($rawCategories) !== '') {
            $categoryList = array_filter(explode(',', $rawCategories), fn ($cat) => !empty(trim($cat)));
        }

        return Blog::query()
            ->where('status', 'published')
            ->with('category')
            ->when(!empty($search), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('short_description', 'like', '%' . $search . '%');
                });
            })
            ->when(!empty($categoryList), function ($query) use ($categoryList) {
                $categorySlugs = array_map(fn ($cat) => Str::slug($cat), $categoryList);

                $query->whereHas('category', function ($q) use ($categorySlugs) {
                    $q->whereIn('slug', $categorySlugs);
                });
            })
            ->orderByDesc('published_at')
            ->paginate($perPage);
    }

    /**
     * Find a published blog by its slug with category and author.
     *
     * @param string $slug
     * @return Blog|null
     */
    public function findBySlug(string $slug): ?Blog
    {
        return Blog::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['category', 'author'])
            ->first();
    }
}
