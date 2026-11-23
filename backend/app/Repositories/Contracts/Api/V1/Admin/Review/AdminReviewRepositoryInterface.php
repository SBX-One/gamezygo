<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Review;

interface AdminReviewRepositoryInterface
{
    /**
     * Get filtered and paginated reviews list with breakdown and meta.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getReviews(array $filters): array;

    /**
     * Get single review details by ID.
     *
     * @return array<string, mixed>
     */
    public function getReviewById(int $id): array;

    /**
     * Update the status of a review.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, string $status): array;

    /**
     * Reply to a review as admin.
     *
     * @return array<string, mixed>
     */
    public function replyToReview(int $id, string $message, ?int $adminId = null): array;

    /**
     * Delete a single review by ID.
     */
    public function deleteReview(int $id): void;

    /**
     * Bulk delete reviews by IDs.
     *
     * @param  array<int>  $ids
     */
    public function bulkDeleteReviews(array $ids): int;
}
