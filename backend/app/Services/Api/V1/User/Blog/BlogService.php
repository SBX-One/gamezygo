<?php

namespace App\Services\Api\V1\User\Blog;

use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BlogService
{
    public function __construct(
        protected BlogRepositoryInterface $blogRepository
    ) {
    }

    /**
     * Fetch published blogs with category and optional filters.
     *
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getPublishedBlogs(array $filters = []): Collection
    {
        return $this->blogRepository->getPublishedBlogs($filters);
    }
}
