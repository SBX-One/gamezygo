<?php

namespace App\Services\Api\V1\User\Review;

use App\Repositories\Contracts\Api\V1\User\Review\ReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ReviewService
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository
    ) {
    }

    /**
     * Fetch approved reviews with user and images.
     *
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getApprovedReviews(array $filters = []): Collection
    {
        return $this->reviewRepository->getApprovedReviews($filters);
    }
}
