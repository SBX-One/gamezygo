<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Community;

interface AdminCommunityRepositoryInterface
{
    /**
     * Get list of communities with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getCommunities(array $filters): array;

    /**
     * Get single community by ID.
     *
     * @return array<string, mixed>
     */
    public function getCommunityById(int $id): array;

    /**
     * Create a new community.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createCommunity(array $data): array;

    /**
     * Update community by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateCommunity(int $id, array $data): array;

    /**
     * Update active status of community.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, bool $isActive): array;

    /**
     * Sort communities by array of IDs.
     *
     * @param  array<int>  $communityIds
     * @return array<string, mixed>
     */
    public function sortCommunities(array $communityIds): array;

    /**
     * Delete community by ID.
     */
    public function deleteCommunity(int $id): void;

    /**
     * Get available community tags.
     *
     * @return array<int, array{id: int, name: string}>
     */
    public function getTags(): array;
}
