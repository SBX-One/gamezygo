<?php

namespace App\Repositories\Contracts\Api\V1\User\Profile;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProfileRepositoryInterface
{
    /**
     * Get user rankings across different periods (weekly, monthly, all_time).
     */
    public function getUserRankings(User $user): array;

    /**
     * Get recent transactions for the user (limited to 3).
     */
    public function getRecentTransactions(User $user, int $limit = 3): Collection;

    /**
     * Get total number of games owned by the user.
     */
    public function getTotalGamesOwned(User $user): int;

    /**
     * Update user profile attributes.
     */
    public function updateProfile(User $user, array $data): User;

    /**
     * Update user password.
     */
    public function updatePassword(User $user, string $newPassword): bool;

    /**
     * Get paginated products/games owned by the user with optional search and genre filters.
     */
    public function getUserOwnedProducts(User $user, array $filters = []): LengthAwarePaginator;
}
