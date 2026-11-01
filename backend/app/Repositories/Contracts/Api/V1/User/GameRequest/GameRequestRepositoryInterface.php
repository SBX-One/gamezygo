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
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getAllRequests(array $filters = [], int $perPage = 20): LengthAwarePaginator;

  /**
   * Get authenticated user's game requests paginated.
   *
   * @param User $user
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getUserRequests(User $user, array $filters = [], int $perPage = 20): LengthAwarePaginator;

  /**
   * Find a game request by ID belonging to specific user.
   *
   * @param User $user
   * @param int $id
   * @return GameRequest|null
   */
  public function findUserRequest(User $user, int $id): ?GameRequest;

  /**
   * Find a game request by ID regardless of owner.
   *
   * @param int $id
   * @return GameRequest|null
   */
  public function findRequestById(int $id): ?GameRequest;

  /**
   * Check if a game is already in products catalog by name, steam URL, or app ID.
   *
   * @param string $gameName
   * @param string $steamUrl
   * @param string|null $appId
   * @return bool
   */
  public function isGameInCatalog(string $gameName, string $steamUrl, ?string $appId = null): bool;

  /**
   * Check if user has already requested this game with active/pending status.
   *
   * @param User $user
   * @param string $steamUrl
   * @param string|null $appId
   * @return bool
   */
  public function hasUserRequestedGame(User $user, string $steamUrl, ?string $appId = null): bool;

  /**
   * Check if this game is already marked as available in existing game requests.
   *
   * @param string $steamUrl
   * @param string|null $appId
   * @return bool
   */
  public function isGameAlreadyAvailableInRequests(string $steamUrl, ?string $appId = null): bool;

  /**
   * Create a new game request.
   *
   * @param User $user
   * @param array<string, mixed> $data
   * @return GameRequest
   */
  public function createRequest(User $user, array $data): GameRequest;

  /**
   * Delete a game request.
   *
   * @param GameRequest $gameRequest
   * @return bool
   */
  public function deleteRequest(GameRequest $gameRequest): bool;
}
