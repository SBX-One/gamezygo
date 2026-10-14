<?php

namespace App\Services\Api\V1\User\Profile;

use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Profile\ProfileRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
  public function __construct(
    protected ProfileRepositoryInterface $profileRepository
  ) {
  }

  /**
   * Get complete user profile details including stats, rankings, and recent transactions.
   *
   * @param User $user
   * @return array
   */
  public function getProfile(User $user): array
  {
    $rankings = $this->profileRepository->getUserRankings($user);
    $totalGames = $this->profileRepository->getTotalGamesOwned($user);
    $recentTransactions = $this->profileRepository->getRecentTransactions($user, 3);

    return [
      'user'                => $user,
      'rankings'            => $rankings,
      'total_games_owned'   => $totalGames,
      'recent_transactions' => $recentTransactions,
    ];
  }

  /**
   * Update user profile information.
   *
   * @param User $user
   * @param array $data
   * @param UploadedFile|null $avatarFile
   * @return User
   */
  public function updateProfile(User $user, array $data, ?UploadedFile $avatarFile = null): User
  {
    $updateData = [];

    if (isset($data['name'])) {
      $updateData['name'] = $data['name'];
    }

    if (array_key_exists('phone', $data)) {
      $updateData['phone'] = $data['phone'];
    }

    if ($avatarFile) {
      $path = Storage::disk('public')->putFile('avatars', $avatarFile);
      $updateData['avatar_url'] = Storage::disk('public')->url($path);
    } elseif (!empty($data['avatar_url'])) {
      $updateData['avatar_url'] = $data['avatar_url'];
    } elseif (!empty($data['avatar']) && is_string($data['avatar'])) {
      $updateData['avatar_url'] = $data['avatar'];
    }

    if (!empty($updateData)) {
      return $this->profileRepository->updateProfile($user, $updateData);
    }

    return $user;
  }

  /**
   * Change user password after verifying current password.
   *
   * @param User $user
   * @param string $currentPassword
   * @param string $newPassword
   * @return void
   * @throws \Exception
   */
  public function changePassword(User $user, string $currentPassword, string $newPassword): void
  {
    if (!empty($user->password) && !\Illuminate\Support\Facades\Hash::check($currentPassword, $user->password)) {
      throw new \Exception('Password lama yang Anda masukkan tidak sesuai.');
    }

    $this->profileRepository->updatePassword($user, $newPassword);
  }
}
