<?php

namespace App\Repositories\Contracts\Api\V1\User\Blog;

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
}
