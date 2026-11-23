<?php

namespace App\Http\Controllers\Api\V1\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Blog\AdminBlogBulkActionRequest;
use App\Http\Requests\Api\V1\Admin\Blog\AdminBlogIndexRequest;
use App\Http\Requests\Api\V1\Admin\Blog\AdminBlogStoreRequest;
use App\Http\Requests\Api\V1\Admin\Blog\AdminBlogUpdateRequest;
use App\Http\Resources\Api\V1\Admin\Blog\AdminBlogCreatedResource;
use App\Http\Resources\Api\V1\Admin\Blog\AdminBlogDetailResource;
use App\Http\Resources\Api\V1\Admin\Blog\AdminBlogUpdatedResource;
use App\Repositories\Contracts\Api\V1\Admin\Blog\AdminBlogRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminBlogController extends Controller
{
    public function __construct(
        protected AdminBlogRepositoryInterface $blogRepository
    ) {}

    /**
     * List blogs with search, status filter, and pagination.
     */
    public function index(AdminBlogIndexRequest $request): JsonResponse
    {
        $data = $this->blogRepository->getBlogs($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Blogs retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Create a new blog post.
     */
    public function store(AdminBlogStoreRequest $request): JsonResponse
    {
        $authorId = $request->user()?->id;
        $blog = $this->blogRepository->createBlog($request->validated(), $authorId);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully',
            'data' => (new AdminBlogCreatedResource($blog))->resolve($request),
        ], 201);
    }

    /**
     * Show blog preview / details.
     */
    public function show(int $blogId): JsonResponse
    {
        $blog = $this->blogRepository->getBlogById($blogId);

        return response()->json([
            'success' => true,
            'message' => 'Blog preview retrieved successfully',
            'data' => (new AdminBlogDetailResource($blog))->resolve(request()),
        ]);
    }

    /**
     * Update an existing blog post.
     */
    public function update(AdminBlogUpdateRequest $request, int $blogId): JsonResponse
    {
        $blog = $this->blogRepository->updateBlog($blogId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully',
            'data' => (new AdminBlogUpdatedResource($blog))->resolve($request),
        ]);
    }

    /**
     * Delete blogs (bulk or single).
     */
    public function destroy(AdminBlogBulkActionRequest $request, ?int $blogId = null): JsonResponse
    {
        $ids = $request->validated('ids') ?? [];
        if ($blogId) {
            $ids[] = $blogId;
        }
        $ids = array_values(array_unique(array_filter($ids)));

        $data = $this->blogRepository->deleteBlogs($ids);

        return response()->json([
            'success' => true,
            'message' => 'Blogs deleted successfully.',
            'data' => $data,
        ]);
    }

    /**
     * Publish blogs (bulk or single).
     */
    public function publish(AdminBlogBulkActionRequest $request, ?int $blogId = null): JsonResponse
    {
        $ids = $request->validated('ids') ?? [];
        if ($blogId) {
            $ids[] = $blogId;
        }
        $ids = array_values(array_unique(array_filter($ids)));

        $data = $this->blogRepository->publishBlogs($ids);

        return response()->json([
            'success' => true,
            'message' => 'Blogs published successfully.',
            'data' => $data,
        ]);
    }
}
