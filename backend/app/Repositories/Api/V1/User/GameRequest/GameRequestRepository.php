<?php

namespace App\Repositories\Api\V1\User\GameRequest;

use App\Models\GameRequest;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\GameRequest\GameRequestRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class GameRequestRepository implements GameRequestRepositoryInterface
{
    /**
     * Get all game requests paginated (for public view).
     *
     * @param  array<string, mixed>  $filters
     */
    public function getAllRequests(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = GameRequest::query();

        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%'.strtolower($search).'%'])
                    ->orWhere('steam_url', 'like', '%'.$search.'%');
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $page = isset($filters['page']) ? (int) $filters['page'] : null;

        return $query->orderByDesc('id')
            ->paginate(perPage: $perPage, page: $page);
    }

    /**
     * Get authenticated user's game requests paginated.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getUserRequests(User $user, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = GameRequest::query()
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id);

                if (Schema::hasTable('game_request_users')) {
                    $q->orWhereExists(function ($sub) use ($user) {
                        $sub->select(DB::raw(1))
                            ->from('game_request_users')
                            ->whereColumn('game_request_users.game_request_id', 'game_requests.id')
                            ->where('game_request_users.user_id', $user->id);
                    });
                }
            });

        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%'.strtolower($search).'%'])
                    ->orWhere('steam_url', 'like', '%'.$search.'%');
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $page = isset($filters['page']) ? (int) $filters['page'] : null;

        return $query->orderByDesc('id')
            ->paginate(perPage: $perPage, page: $page);
    }

    /**
     * Find a game request by ID belonging to specific user.
     */
    public function findUserRequest(User $user, int $id): ?GameRequest
    {
        return $user->gameRequests()->where('id', $id)->first();
    }

    /**
     * Find a game request by ID regardless of owner.
     */
    public function findRequestById(int $id): ?GameRequest
    {
        return GameRequest::find($id);
    }

    /**
     * Check if a game is already in products catalog by name, steam URL, or app ID.
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
     */
    public function hasUserRequestedGame(User $user, string $steamUrl, ?string $appId = null): bool
    {
        $isCreator = $user->gameRequests()
            ->whereIn('status', ['pending', 'reviewed'])
            ->where(function ($q) use ($steamUrl, $appId) {
                $q->where('steam_url', $steamUrl);

                if ($appId) {
                    $q->orWhere('steam_url', 'like', "%/app/{$appId}%")
                        ->orWhere('steam_url', 'like', "%/app/{$appId}/%");
                }
            })
            ->exists();

        if ($isCreator) {
            return true;
        }

        if (Schema::hasTable('game_request_users')) {
            return DB::table('game_request_users')
                ->join('game_requests', 'game_requests.id', '=', 'game_request_users.game_request_id')
                ->where('game_request_users.user_id', $user->id)
                ->whereIn('game_requests.status', ['pending', 'reviewed'])
                ->where(function ($q) use ($steamUrl, $appId) {
                    $q->where('game_requests.steam_url', $steamUrl);

                    if ($appId) {
                        $q->orWhere('game_requests.steam_url', 'like', "%/app/{$appId}%")
                            ->orWhere('game_requests.steam_url', 'like', "%/app/{$appId}/%");
                    }
                })
                ->exists();
        }

        return false;
    }

    /**
     * Check if this game is already marked as available in existing game requests.
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
     * @param  array<string, mixed>  $data
     */
    public function createRequest(User $user, array $data): GameRequest
    {
        $steamUrl = $data['steam_url'];
        $appId = $data['app_id'] ?? null;

        // Check if an existing game request already exists for this Steam URL or App ID
        $existing = GameRequest::query()
            ->where(function ($q) use ($steamUrl, $appId) {
                $q->where('steam_url', $steamUrl);
                if ($appId) {
                    $q->orWhere('steam_url', 'like', "%/app/{$appId}%")
                        ->orWhere('steam_url', 'like', "%/app/{$appId}/%");
                }
            })
            ->first();

        if ($existing) {
            $existing->increment('request_count');
            $existing->update([
                'last_requested_at' => now(),
            ]);

            if (Schema::hasTable('game_request_users')) {
                DB::table('game_request_users')->insertOrIgnore([
                    'game_request_id' => $existing->id,
                    'user_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return $existing->fresh();
        }

        $gameRequest = $user->gameRequests()->create([
            'name' => $data['name'],
            'steam_url' => $steamUrl,
            'request_count' => 1,
            'note' => $data['note'] ?? null,
            'status' => 'pending',
            'admin_note' => null,
            'last_requested_at' => now(),
        ]);

        if (Schema::hasTable('game_request_users')) {
            DB::table('game_request_users')->insertOrIgnore([
                'game_request_id' => $gameRequest->id,
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $gameRequest;
    }

    /**
     * Delete a game request and update counts for remaining requests.
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
