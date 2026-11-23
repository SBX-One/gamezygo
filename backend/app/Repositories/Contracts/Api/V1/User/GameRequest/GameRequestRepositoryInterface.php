<?php

namespace App\Repositories\Contracts\Api\V1\User\GameRequest;

use App\Models\GameRequest;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GameRequestRepositoryInterface
{
    /**
     * Get all game requests paginated (for public view).
     *
     * @param  array<string, mixed>  $filters
     */
    public function getAllRequests(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * Get authenticated user's game requests paginated.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getUserRequests(User $user, array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * Find a game request by ID belonging to specific user.
     */
    public function findUserRequest(User $user, int $id): ?GameRequest;

    /**
     * Find a game request by ID regardless of owner.
     */
    public function findRequestById(int $id): ?GameRequest;

    /**
     * Check if a game is already in products catalog by name, steam URL, or app ID.
     */
    public function isGameInCatalog(string $gameName, string $steamUrl, ?string $appId = null): bool;

    /**
     * Check if user has already requested this game with active/pending status.
     */
    public function hasUserRequestedGame(User $user, string $steamUrl, ?string $appId = null): bool;

    /**
     * Check if this game is already marked as available in existing game requests.
     */
    public function isGameAlreadyAvailableInRequests(string $steamUrl, ?string $appId = null): bool;

    /**
     * Create a new game request.
     *
     * @param  array<string, mixed>  $data
     */
    public function createRequest(User $user, array $data): GameRequest;

    /**
     * Delete a game request.
     */
    public function deleteRequest(GameRequest $gameRequest): bool;
}
