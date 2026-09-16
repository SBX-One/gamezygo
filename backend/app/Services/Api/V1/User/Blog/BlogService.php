<?php

namespace App\Services\Api\V1\User\Blog;

use App\Models\Blog;
use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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

    /**
     * Fetch published blog detail by slug.
     *
     * @param string $slug
     * @return Blog
     * @throws ModelNotFoundException
     */
    public function getBlogDetail(string $slug): Blog
    {
        $blog = $this->blogRepository->findBySlug($slug);

        if (!$blog) {
            throw new ModelNotFoundException('Blog not found');
        }

        return $blog;
    }
}
