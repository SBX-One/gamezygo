<?php

namespace App\Repositories\Api\V1\User\Blog;

use App\Models\Blog;
use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class BlogRepository implements BlogRepositoryInterface
{
    /**
     * Get published blogs with category and optional filters.
     *
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getPublishedBlogs(array $filters = []): Collection
    {
        $search     = $filters['search'] ?? null;
        $categories = $filters['categories'] ?? null;

        return Blog::query()
            ->where('status', 'published')
            ->with('category')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('short_description', 'like', '%' . $search . '%');
                });
            })
            ->when($categories, function ($query) use ($categories) {
                $categoryList = is_array($categories)
                    ? $categories
                    : array_filter(explode(',', (string) $categories));

                if (!empty($categoryList)) {
                    $categorySlugs = array_map(fn ($cat) => Str::slug($cat), $categoryList);

                    $query->whereHas('category', function ($q) use ($categorySlugs) {
                        $q->whereIn('slug', $categorySlugs);
                    });
                }
            })
            ->orderByDesc('published_at')
            ->get();
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
