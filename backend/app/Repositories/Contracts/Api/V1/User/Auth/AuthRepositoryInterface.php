<?php

namespace App\Repositories\Contracts\Api\V1\User\Auth;

use App\Models\User;

interface AuthRepositoryInterface
{
  /**
   * Find a user by email address.
   *
   * @param string $email
   * @return User|null
   */
  public function findByEmail(string $email): ?User;

  /**
   * Find a user by Google ID.
   *
   * @param string $googleId
   * @return User|null
   */
  public function findByGoogleId(string $googleId): ?User;

  /**
   * Create a new user record.
   *
   * @param array $data
   * @return User
   */
  public function createUser(array $data): User;

  /**
   * Update existing user or create a new user from Google profile data.
   *
   * @param array $data
   * @return User
   */
  public function updateOrCreateGoogleUser(array $data): User;
}
