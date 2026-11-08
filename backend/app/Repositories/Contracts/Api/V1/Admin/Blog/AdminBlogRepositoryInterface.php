<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Blog;

use App\Models\Blog;

interface AdminBlogRepositoryInterface
{
  /**
   * Get paginated blogs list with meta and total.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getBlogs(array $filters): array;

  /**
   * Create a new blog.
   *
   * @param array<string, mixed> $data
   * @param int|null $authorId
   * @return Blog
   */
  public function createBlog(array $data, ?int $authorId = null): Blog;

  /**
   * Get single blog by ID with relations.
   *
   * @param int $id
   * @return Blog
   */
  public function getBlogById(int $id): Blog;

  /**
   * Update an existing blog.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return Blog
   */
  public function updateBlog(int $id, array $data): Blog;

  /**
   * Delete blogs by IDs.
   *
   * @param array<int> $ids
   * @return array{deleted_count: int, deleted_ids: array<int>}
   */
  public function deleteBlogs(array $ids): array;

  /**
   * Publish blogs by IDs.
   *
   * @param array<int> $ids
   * @return array{published_count: int, published_ids: array<int>}
   */
  public function publishBlogs(array $ids): array;
}

