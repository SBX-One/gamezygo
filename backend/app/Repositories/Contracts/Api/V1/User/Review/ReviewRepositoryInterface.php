<?php

namespace App\Repositories\Contracts\Api\V1\User\Review;

use Illuminate\Database\Eloquent\Collection;

interface ReviewRepositoryInterface
{
    /**
     * Get approved reviews with user and images relations.
     *
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getApprovedReviews(array $filters = []): Collection;
}
