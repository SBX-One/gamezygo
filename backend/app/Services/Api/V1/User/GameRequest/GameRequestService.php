<?php

namespace App\Services\Api\V1\User\GameRequest;

use App\Models\GameRequest;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\GameRequest\GameRequestRepositoryInterface;
use App\Services\Steam\SteamService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class GameRequestService
{
  public function __construct(
    protected GameRequestRepositoryInterface $gameRequestRepository,
    protected SteamService $steamService
  ) {
  }

  /**
   * Get all public game requests.
   *
   * @param array<string, mixed> $filters
   * @return LengthAwarePaginator
   */
  public function getAllRequests(array $filters = []): LengthAwarePaginator
  {
    $perPage = (int) ($filters['per_page'] ?? 20);

    return $this->gameRequestRepository->getAllRequests($filters, $perPage);
  }

  /**
   * Get authenticated user's game requests.
   *
   * @param User $user
   * @param array<string, mixed> $filters
   * @return LengthAwarePaginator
   */
  public function getUserRequests(User $user, array $filters = []): LengthAwarePaginator
  {
    $perPage = (int) ($filters['per_page'] ?? 20);

    return $this->gameRequestRepository->getUserRequests($user, $filters, $perPage);
  }

  /**
   * Create a new game request after fetching Steam details and verifying conditions.
   *
   * @param User $user
   * @param array<string, mixed> $data
   * @return GameRequest
   * @throws ValidationException
   */
  public function createGameRequest(User $user, array $data): GameRequest
  {
    $steamUrl = trim($data['steam_url']);

    if (!$this->steamService->isValidSteamUrl($steamUrl)) {
      throw ValidationException::withMessages([
        'steam_url' => 'The steam url format is invalid. It must be a valid Steam store URL (e.g. https://store.steampowered.com/app/123456).',
      ]);
    }

    $appId = $this->steamService->extractAppId($steamUrl);
    $gameDetails = $this->steamService->fetchGameDetails($steamUrl);

    if (!$gameDetails || empty($gameDetails['name'])) {
      throw ValidationException::withMessages([
        'steam_url' => 'Steam game not found or invalid Steam URL.',
      ]);
    }

    $gameName = $gameDetails['name'];
    $normalizedSteamUrl = $gameDetails['steam_url'];

    // 1. Condition: Game already in catalog
    if ($this->gameRequestRepository->isGameInCatalog($gameName, $normalizedSteamUrl, $appId)) {
      throw ValidationException::withMessages([
        'steam_url' => 'Game is already available in the catalog.',
      ]);
    }

    // 2. Condition: Game request already marked available
    if ($this->gameRequestRepository->isGameAlreadyAvailableInRequests($normalizedSteamUrl, $appId)) {
      throw ValidationException::withMessages([
        'steam_url' => 'This game is already available.',
      ]);
    }

    // 3. Condition: User already requested this game
    if ($this->gameRequestRepository->hasUserRequestedGame($user, $normalizedSteamUrl, $appId)) {
      throw ValidationException::withMessages([
        'steam_url' => 'You have already requested this game.',
      ]);
    }

    return $this->gameRequestRepository->createRequest($user, [
      'name'      => $gameName,
      'steam_url' => $normalizedSteamUrl,
      'app_id'    => $appId,
      'note'      => $data['note'] ?? null,
    ]);
  }

  /**
   * Delete a game request ensuring the user owns it.
   *
   * @param User $user
   * @param int $id
   * @return bool
   * @throws ModelNotFoundException
   * @throws AuthorizationException
   */
  public function deleteGameRequest(User $user, int $id): bool
  {
    $gameRequest = $this->gameRequestRepository->findRequestById($id);

    if (!$gameRequest) {
      throw new ModelNotFoundException('Game request not found');
    }

    if ($gameRequest->user_id !== $user->id) {
      throw new AuthorizationException('You are not authorized to delete this game request');
    }

    return $this->gameRequestRepository->deleteRequest($gameRequest);
  }
}
