<?php

namespace App\Repositories\Contracts\Api\V1\User\Community;

use App\Models\Community;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CommunityRepositoryInterface
{
    /**
     * Get active communities with optional filters and pagination.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getActiveCommunities(array $filters = []): LengthAwarePaginator|Collection;

    /**
     * Get single active community by ID.
     */
    public function getActiveCommunityById(int $id): ?Community;

    /**
     * Get available community tags.
     */
    public function getActiveTags(): Collection;
}
