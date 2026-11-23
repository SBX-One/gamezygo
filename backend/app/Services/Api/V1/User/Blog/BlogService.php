<?php

namespace App\Services\Api\V1\User\Blog;

use App\Models\Blog;
use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BlogService
{
    public function __construct(
        protected BlogRepositoryInterface $blogRepository,
        protected RedisCacheService $cacheService
    ) {}

    /**
     * Fetch paginated published blogs with category and optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getPublishedBlogs(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $page = request()->get('page', 1);
        $cacheKey = 'blogs:published:list:'.md5(json_encode($filters).":per_page:{$perPage}:page:{$page}");

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_LONG,
            fn () => $this->blogRepository->getPublishedBlogs($filters, $perPage),
            [RedisCacheService::TAG_BLOGS]
        );
    }

    /**
     * Fetch published blog detail by slug.
     *
     * @throws ModelNotFoundException
     */
    public function getBlogDetail(string $slug): Blog
    {
        $cacheKey = "blogs:detail:{$slug}";

        $blog = $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_EXTENDED,
            fn () => $this->blogRepository->findBySlug($slug),
            [RedisCacheService::TAG_BLOGS]
        );

        if (! $blog) {
            throw new ModelNotFoundException('Blog not found');
        }

        return $blog;
    }
}
