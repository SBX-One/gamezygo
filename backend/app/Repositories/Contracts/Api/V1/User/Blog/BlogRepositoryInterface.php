<?php

namespace App\Repositories\Contracts\Api\V1\User\Blog;

use App\Models\Blog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BlogRepositoryInterface
{
    /**
     * Get paginated published blogs with category and optional filters.
     *
     * @param array<string, mixed> $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPublishedBlogs(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    /**
     * Find a published blog by its slug with category and author.
     *
     * @param string $slug
     * @return Blog|null
     */
    public function findBySlug(string $slug): ?Blog;
}
