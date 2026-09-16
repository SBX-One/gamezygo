<?php

namespace App\Http\Controllers\Api\V1\User\Blog;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Blog\BlogCollection;
use App\Http\Resources\Api\V1\User\Blog\BlogDetailResource;
use App\Models\Blog;
use App\Services\Api\V1\User\Blog\BlogService;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function __construct(
        protected BlogService $blogService
    ) {
    }

    public function index(Request $request): BlogCollection
    {
        $filters = $request->only([
            'search',
            'categories',
        ]);

        $blogs = $this->blogService->getPublishedBlogs($filters);

        return new BlogCollection($blogs);
    }

    public function show(Blog $blog): BlogDetailResource
    {
        $blogDetail = $this->blogService->getBlogDetail($blog->slug);

        return new BlogDetailResource($blogDetail);
    }
}
