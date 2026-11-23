<?php

namespace App\Services\Api\V1\User\Profile;

use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Profile\ProfileRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    public function __construct(
        protected ProfileRepositoryInterface $profileRepository,
        protected RedisCacheService $cacheService
    ) {}

    /**
     * Get complete user profile details including stats, rankings, and recent transactions.
     */
    public function getProfile(User $user): array
    {
        $cacheKey = "user:profile:{$user->id}";

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_SHORT,
            function () use ($user) {
                $user->loadMissing('avatar');
                $rankings = $this->profileRepository->getUserRankings($user);
                $totalGames = $this->profileRepository->getTotalGamesOwned($user);
                $recentTransactions = $this->profileRepository->getRecentTransactions($user, 3);

                return [
                    'user' => $user,
                    'rankings' => $rankings,
                    'total_games_owned' => $totalGames,
                    'recent_transactions' => $recentTransactions,
                ];
            },
            [RedisCacheService::userTag($user->id)]
        );
    }

    /**
     * Update user profile information.
     */
    public function updateProfile(User $user, array $data, ?UploadedFile $avatarFile = null): User
    {
        if (! $avatarFile && isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            $avatarFile = $data['avatar'];
        }

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (array_key_exists('phone', $data)) {
            $updateData['phone'] = $data['phone'];
        }

        if ($avatarFile) {
            $path = Storage::disk('public')->putFile('avatars/'.$user->id, $avatarFile, 'public');

            $existingAvatar = $user->avatar()->first();
            if ($existingAvatar) {
                if ($existingAvatar->file_path && Storage::disk('public')->exists($existingAvatar->file_path)) {
                    Storage::disk('public')->delete($existingAvatar->file_path);
                }
                $existingAvatar->update([
                    'file_name' => $avatarFile->getClientOriginalName(),
                    'file_type' => $avatarFile->getClientMimeType() ?? $avatarFile->extension(),
                    'file_path' => $path,
                    'file_size' => $avatarFile->getSize(),
                ]);
            } else {
                $user->avatar()->create([
                    'file_name' => $avatarFile->getClientOriginalName(),
                    'file_type' => $avatarFile->getClientMimeType() ?? $avatarFile->extension(),
                    'file_path' => $path,
                    'file_size' => $avatarFile->getSize(),
                ]);
            }

            $updateData['avatar_url'] = Storage::disk('public')->url($path);
        } elseif (! empty($data['avatar_url'])) {
            $updateData['avatar_url'] = $data['avatar_url'];
        } elseif (! empty($data['avatar']) && is_string($data['avatar'])) {
            $updateData['avatar_url'] = $data['avatar'];
        }

        $this->cacheService->flushUser($user->id);

        if (! empty($updateData)) {
            return $this->profileRepository->updateProfile($user, $updateData);
        }

        return $user->fresh(['avatar']);
    }

    /**
     * Change user password after verifying current password.
     *
     * @throws \Exception
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! empty($user->password) && ! Hash::check($currentPassword, $user->password)) {
            throw new \Exception('Password lama yang Anda masukkan tidak sesuai.');
        }

        $this->profileRepository->updatePassword($user, $newPassword);
        $this->cacheService->flushUser($user->id);
    }

    /**
     * Get paginated products owned by user with filters.
     */
    public function getOwnedProducts(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->profileRepository->getUserOwnedProducts($user, $filters);
    }

    /**
     * Get current leaderboard rank and points for the user.
     */
    public function getUserLeaderboard(User $user, ?string $period = null): array
    {
        $rankings = $this->profileRepository->getUserRankings($user);

        $rank = match ($period) {
            'weekly' => $rankings['weekly'],
            'monthly' => $rankings['monthly'],
            default => $rankings['all_time'],
        };

        return [
            'rank' => (int) $rank,
            'point' => (int) ($user->total_points ?? 0),
        ];
    }
}
