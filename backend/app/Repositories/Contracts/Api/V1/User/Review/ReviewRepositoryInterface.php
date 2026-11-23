<?php

namespace App\Repositories\Contracts\Api\V1\User\Review;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

interface ReviewRepositoryInterface
{
    /**
     * Get approved reviews with user and images relations.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getApprovedReviews(array $filters = []): Collection;

    /**
     * Get reviews created by the authenticated user.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getUserReviews(User $user, array $filters = []): Collection;

    /**
     * Find a review by its ID.
     */
    public function findReviewById(int $id): ?Review;

    /**
     * Find a review belonging to a specific user.
     */
    public function findUserReview(User $user, int $id): ?Review;

    /**
     * Create a new review for a user.
     *
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $images
     */
    public function createReview(User $user, array $data, array $images = []): Review;

    /**
     * Update an existing review and optionally attach new images.
     *
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $images
     */
    public function updateReview(Review $review, array $data, array $images = []): Review;

    /**
     * Delete a review and its polymorphic image files.
     */
    public function deleteReview(Review $review): bool;
}
