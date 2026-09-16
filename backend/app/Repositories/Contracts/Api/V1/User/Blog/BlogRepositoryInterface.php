<?php

namespace App\Repositories\Contracts\Api\V1\User\Blog;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Collection;

interface BlogRepositoryInterface
{
    /**
     * Get published blogs with category and optional filters.
     *
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getPublishedBlogs(array $filters = []): Collection;

    /**
     * Find a published blog by its slug with category and author.
     *
     * @param string $slug
     * @return Blog|null
     */
    public function findBySlug(string $slug): ?Blog;
}
