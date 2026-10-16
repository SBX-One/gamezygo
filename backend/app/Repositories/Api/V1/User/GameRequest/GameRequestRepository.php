<?php

namespace App\Repositories\Api\V1\User\GameRequest;

use App\Models\GameRequest;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\GameRequest\GameRequestRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GameRequestRepository implements GameRequestRepositoryInterface
{
  /**
   * Get all game requests paginated (for public view).
   *
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getAllRequests(array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    $query = GameRequest::query();

    if (!empty($filters['search'])) {
      $search = trim((string) $filters['search']);
      $query->where(function ($q) use ($search) {
        $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
          ->orWhere('steam_url', 'like', '%' . $search . '%');
      });
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    $page = isset($filters['page']) ? (int) $filters['page'] : null;

    return $query->orderByDesc('id')
      ->paginate(perPage: $perPage, page: $page);
  }

  /**
   * Get authenticated user's game requests paginated.
   *
   * @param User $user
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getUserRequests(User $user, int $perPage = 20): LengthAwarePaginator
  {
    return $user->gameRequests()
      ->orderByDesc('id')
      ->paginate($perPage);
  }

  /**
   * Find a game request by ID belonging to specific user.
   *
   * @param User $user
   * @param int $id
   * @return GameRequest|null
   */
  public function findUserRequest(User $user, int $id): ?GameRequest
  {
    return $user->gameRequests()->where('id', $id)->first();
  }

  /**
   * Find a game request by ID regardless of owner.
   *
   * @param int $id
   * @return GameRequest|null
   */
  public function findRequestById(int $id): ?GameRequest
  {
    return GameRequest::find($id);
  }

  /**
   * Check if a game is already in products catalog by name, steam URL, or app ID.
   *
   * @param string $gameName
   * @param string $steamUrl
   * @param string|null $appId
   * @return bool
   */
  public function isGameInCatalog(string $gameName, string $steamUrl, ?string $appId = null): bool
  {
    return Product::query()
      ->where(function ($q) use ($gameName, $steamUrl, $appId) {
        $q->whereRaw('LOWER(name) = ?', [strtolower(trim($gameName))])
          ->orWhere('steam_url', $steamUrl);

        if ($appId) {
          $q->orWhere('steam_url', 'like', "%/app/{$appId}%")
            ->orWhere('steam_url', 'like', "%/app/{$appId}/%");
        }
      })
      ->exists();
  }

  /**
   * Check if user has already requested this game with active/pending status.
   *
   * @param User $user
   * @param string $steamUrl
   * @param string|null $appId
   * @return bool
   */
  public function hasUserRequestedGame(User $user, string $steamUrl, ?string $appId = null): bool
  {
    return $user->gameRequests()
      ->whereIn('status', ['pending', 'reviewed'])
      ->where(function ($q) use ($steamUrl, $appId) {
        $q->where('steam_url', $steamUrl);

        if ($appId) {
          $q->orWhere('steam_url', 'like', "%/app/{$appId}%")
            ->orWhere('steam_url', 'like', "%/app/{$appId}/%");
        }
      })
      ->exists();
  }

  /**
   * Check if this game is already marked as available in existing game requests.
   *
   * @param string $steamUrl
   * @param string|null $appId
   * @return bool
   */
  public function isGameAlreadyAvailableInRequests(string $steamUrl, ?string $appId = null): bool
  {
    return GameRequest::query()
      ->where('status', 'available')
      ->where(function ($q) use ($steamUrl, $appId) {
        $q->where('steam_url', $steamUrl);

        if ($appId) {
          $q->orWhere('steam_url', 'like', "%/app/{$appId}%")
            ->orWhere('steam_url', 'like', "%/app/{$appId}/%");
        }
      })
      ->exists();
  }

  /**
   * Create a new game request and synchronize request count.
   *
   * @param User $user
   * @param array<string, mixed> $data
   * @return GameRequest
   */
  public function createRequest(User $user, array $data): GameRequest
  {
    $steamUrl = $data['steam_url'];
    $appId = $data['app_id'] ?? null;

    // Calculate existing requests for this game to compute new count
    $existingCountQuery = GameRequest::query()->where(function ($q) use ($steamUrl, $appId) {
      $q->where('steam_url', $steamUrl);
      if ($appId) {
        $q->orWhere('steam_url', 'like', "%/app/{$appId}%");
      }
    });

    $currentCount = $existingCountQuery->count();
    $newCount = $currentCount + 1;

    $gameRequest = $user->gameRequests()->create([
      'name'          => $data['name'],
      'steam_url'     => $steamUrl,
      'request_count' => $newCount,
      'note'          => $data['note'] ?? null,
      'status'        => 'pending',
      'admin_note'    => null,
    ]);

    // Synchronize request_count across all matching requests
    if ($currentCount > 0) {
      GameRequest::query()
        ->where(function ($q) use ($steamUrl, $appId) {
          $q->where('steam_url', $steamUrl);
          if ($appId) {
            $q->orWhere('steam_url', 'like', "%/app/{$appId}%");
          }
        })
        ->update(['request_count' => $newCount]);
    }

    return $gameRequest;
  }

  /**
   * Delete a game request and update counts for remaining requests.
   *
   * @param GameRequest $gameRequest
   * @return bool
   */
  public function deleteRequest(GameRequest $gameRequest): bool
  {
    $steamUrl = $gameRequest->steam_url;

    $deleted = (bool) $gameRequest->delete();

    if ($deleted) {
      $remainingCount = GameRequest::where('steam_url', $steamUrl)->count();
      if ($remainingCount > 0) {
        GameRequest::where('steam_url', $steamUrl)
          ->update(['request_count' => $remainingCount]);
      }
    }

    return $deleted;
  }
}
