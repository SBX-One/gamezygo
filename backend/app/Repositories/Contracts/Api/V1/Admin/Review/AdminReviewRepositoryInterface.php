<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Review;

interface AdminReviewRepositoryInterface
{
  /**
   * Get filtered and paginated reviews list with breakdown and meta.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getReviews(array $filters): array;

  /**
   * Get single review details by ID.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getReviewById(int $id): array;

  /**
   * Update the status of a review.
   *
   * @param int $id
   * @param string $status
   * @return array<string, mixed>
   */
  public function updateStatus(int $id, string $status): array;

  /**
   * Reply to a review as admin.
   *
   * @param int $id
   * @param string $message
   * @param int|null $adminId
   * @return array<string, mixed>
   */
  public function replyToReview(int $id, string $message, ?int $adminId = null): array;

  /**
   * Delete a single review by ID.
   *
   * @param int $id
   * @return void
   */
  public function deleteReview(int $id): void;

  /**
   * Bulk delete reviews by IDs.
   *
   * @param array<int> $ids
   * @return int
   */
  public function bulkDeleteReviews(array $ids): int;
}

