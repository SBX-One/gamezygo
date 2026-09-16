<?php

namespace App\Services\Api\V1\User\Blog;

use App\Models\Blog;
use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BlogService
{
    public function __construct(
        protected BlogRepositoryInterface $blogRepository
    ) {
    }

    /**
     * Fetch paginated published blogs with category and optional filters.
     *
     * @param array<string, mixed> $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPublishedBlogs(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->blogRepository->getPublishedBlogs($filters, $perPage);
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
