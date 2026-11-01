<?php

namespace App\Repositories\Api\V1\User\Profile;

use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Profile\ProfileRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProfileRepository implements ProfileRepositoryInterface
{
  /**
   * Get user rankings across different periods (weekly, monthly, all_time).
   *
   * @param User $user
   * @return array
   */
  public function getUserRankings(User $user): array
  {
    $points = (int) $user->total_points;

    $allTimeRank = User::where('status', 'active')
      ->where('total_points', '>', $points)
      ->count() + 1;

    $weeklyRank = User::where('status', 'active')
      ->where('total_points', '>', $points)
      ->where('updated_at', '>=', now()->startOfWeek())
      ->count() + 1;

    $monthlyRank = User::where('status', 'active')
      ->where('total_points', '>', $points)
      ->where('updated_at', '>=', now()->startOfMonth())
      ->count() + 1;

    return [
      'weekly'   => $weeklyRank,
      'monthly'  => $monthlyRank,
      'all_time' => $allTimeRank,
    ];
  }

  /**
   * Get recent transactions for the user (limited to 3).
   *
   * @param User $user
   * @param int $limit
   * @return Collection
   */
  public function getRecentTransactions(User $user, int $limit = 3): Collection
  {
    return $user->orders()
      ->withCount('items')
      ->orderByDesc('id')
      ->take($limit)
      ->get();
  }

  /**
   * Get total number of games owned by the user.
   *
   * @param User $user
   * @return int
   */
  public function getTotalGamesOwned(User $user): int
  {
    return $user->ownedGames()->count();
  }

  /**
   * Update user profile attributes.
   *
   * @param User $user
   * @param array $data
   * @return User
   */
  public function updateProfile(User $user, array $data): User
  {
    $user->update($data);

    return $user->fresh();
  }

  /**
   * Update user password.
   *
   * @param User $user
   * @param string $newPassword
   * @return bool
   */
  public function updatePassword(User $user, string $newPassword): bool
  {
    return $user->update([
      'password' => bcrypt($newPassword),
    ]);
  }

  /**
   * Get paginated products/games owned by the user with optional search and genre filters.
   *
   * @param User $user
   * @param array $filters
   * @return LengthAwarePaginator
   */
  public function getUserOwnedProducts(User $user, array $filters = []): LengthAwarePaginator
  {
    $query = $user->ownedGames()
      ->select('products.*')
      ->with([
        'genreCategories',
        'files',
      ]);

    if (!empty($filters['search'])) {
      $search = trim((string) $filters['search']);
      $query->where(function ($q) use ($search) {
        $q->whereRaw('LOWER(products.name) LIKE ?', ['%' . strtolower($search) . '%'])
          ->orWhereRaw('LOWER(products.slug) LIKE ?', ['%' . strtolower($search) . '%']);
      });
    }

    if (!empty($filters['genre_categories'])) {
      $genres = (array) $filters['genre_categories'];
      if (is_string($filters['genre_categories'])) {
        $genres = explode(',', $filters['genre_categories']);
      }
      $genres = array_filter(array_map('trim', $genres));

      if (!empty($genres)) {
        $genresLower = array_map('strtolower', $genres);
        $query->whereHas('genreCategories', function ($gQuery) use ($genres, $genresLower) {
          $gQuery->whereIn('genre_categories.slug', $genres)
            ->orWhereIn('genre_categories.name', $genres)
            ->orWhereIn(DB::raw('LOWER(genre_categories.slug)'), $genresLower)
            ->orWhereIn(DB::raw('LOWER(genre_categories.name)'), $genresLower);
        });
      }
    }

    $perPage = (int) ($filters['per_page'] ?? 20);

    return $query->orderBy('user_owned_games.created_at', 'desc')
      ->paginate($perPage);
  }
}
