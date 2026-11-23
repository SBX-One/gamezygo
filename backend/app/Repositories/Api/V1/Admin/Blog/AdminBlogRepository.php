<?php

namespace App\Repositories\Api\V1\Admin\Blog;

use App\Models\Blog;
use App\Repositories\Contracts\Api\V1\Admin\Blog\AdminBlogRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminBlogRepository implements AdminBlogRepositoryInterface
{
    /**
     * Get paginated blogs list with meta and total.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getBlogs(array $filters): array
    {
        $totalBlog = Blog::count();

        $query = Blog::query()->with('category');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['category_id'])) {
            $query->where('blog_category_id', (int) $filters['category_id']);
        }

        if (! empty($filters['search'])) {
            $searchPattern = '%'.strtolower(trim((string) $filters['search'])).'%';
            $query->where(function ($q) use ($searchPattern) {
                $q->whereRaw('LOWER(title) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(content) LIKE ?', [$searchPattern]);
            });
        }

        $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 20;
        $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

        $paginator = $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);

        $mappedBlogs = $paginator->getCollection()->map(function ($blog) {
            return [
                'id' => $blog->id,
                'banner_file_url' => $blog->banner_file_url ?? 'https://placehold.co/800x450',
                'title' => $blog->title,
                'slug' => $blog->slug,
                'status' => (string) $blog->status,
                'published_at' => $blog->published_at ? $blog->published_at->toIso8601String() : null,
                'total_views' => (int) ($blog->total_views ?? 0),
                'last_edit' => $blog->updated_at ? $blog->updated_at->toIso8601String() : null,
            ];
        })->values()->all();

        $meta = [
            'current_page' => $paginator->currentPage(),
            'from' => $paginator->firstItem() ?? 1,
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'to' => $paginator->lastItem() ?? $paginator->count(),
            'total' => $paginator->total(),
        ];

        return [
            'total_blog' => $totalBlog,
            'blogs' => $mappedBlogs,
            'meta' => $meta,
        ];
    }

    /**
     * Create a new blog.
     *
     * @param  array<string, mixed>  $data
     */
    public function createBlog(array $data, ?int $authorId = null): Blog
    {
        $title = trim((string) $data['title']);
        $slug = Str::slug($title);

        if (Blog::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::lower(Str::random(5));
        }

        $bannerUrl = null;
        if (isset($data['banner_file'])) {
            if ($data['banner_file'] instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('blogs', $data['banner_file']);
                $bannerUrl = Storage::disk('public')->url($path);
            } elseif (is_string($data['banner_file'])) {
                $bannerUrl = $data['banner_file'];
            }
        }

        $catId = null;
        if (! empty($data['category_ids']) && is_array($data['category_ids'])) {
            $catId = (int) $data['category_ids'][0];
        } elseif (! empty($data['category_id'])) {
            $catId = (int) $data['category_id'];
        }

        $status = $data['status'] ?? 'draft';
        $publishedAt = $status === 'published' ? now() : null;

        $blog = Blog::create([
            'title' => $title,
            'slug' => $slug,
            'content' => $data['content'],
            'banner_file_url' => $bannerUrl,
            'blog_category_id' => $catId,
            'author_id' => $authorId,
            'status' => $status,
            'published_at' => $publishedAt,
            'total_views' => 0,
        ]);

        return $blog->load('category');
    }

    /**
     * Get single blog by ID with relations.
     */
    public function getBlogById(int $id): Blog
    {
        return Blog::with(['category', 'author'])->findOrFail($id);
    }

    /**
     * Update an existing blog.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateBlog(int $id, array $data): Blog
    {
        $blog = Blog::with('category')->findOrFail($id);

        if (isset($data['title'])) {
            $blog->title = trim((string) $data['title']);
        }

        if (isset($data['content'])) {
            $blog->content = $data['content'];
        }

        if (isset($data['banner_file'])) {
            if ($data['banner_file'] instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('blogs', $data['banner_file']);
                $blog->banner_file_url = Storage::disk('public')->url($path);
            } elseif (is_string($data['banner_file'])) {
                $blog->banner_file_url = $data['banner_file'];
            }
        }

        if (array_key_exists('category_ids', $data)) {
            $catId = ! empty($data['category_ids']) && is_array($data['category_ids']) ? (int) $data['category_ids'][0] : null;
            $blog->blog_category_id = $catId;
        } elseif (isset($data['category_id'])) {
            $blog->blog_category_id = (int) $data['category_id'];
        }

        if (isset($data['status'])) {
            $blog->status = $data['status'];
            if ($data['status'] === 'published' && ! $blog->published_at) {
                $blog->published_at = now();
            } elseif ($data['status'] === 'draft') {
                $blog->published_at = null;
            }
        }

        $blog->save();

        return $blog->fresh('category');
    }

    /**
     * Delete blogs by IDs.
     *
     * @param  array<int>  $ids
     * @return array{deleted_count: int, deleted_ids: array<int>}
     */
    public function deleteBlogs(array $ids): array
    {
        $count = Blog::whereIn('id', $ids)->delete();

        return [
            'deleted_count' => (int) $count,
            'deleted_ids' => array_values(array_map('intval', $ids)),
        ];
    }

    /**
     * Publish blogs by IDs.
     *
     * @param  array<int>  $ids
     * @return array{published_count: int, published_ids: array<int>}
     */
    public function publishBlogs(array $ids): array
    {
        $count = Blog::whereIn('id', $ids)->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return [
            'published_count' => (int) $count,
            'published_ids' => array_values(array_map('intval', $ids)),
        ];
    }
}
